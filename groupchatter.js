
var _ = require('underscore');

console.log('process.env.HUBOT_LOG_LEVEL', process.env.HUBOT_LOG_LEVEL);

var chatter = {};

(function() {
    /*
    * Set up our environment
    */
    env = {
        flipFlops: {},
        lastSent: {},
        pctBonus: {},
        pctChance: {},
        responses: {},
        timeouts: {},
        timeoutRandom: {},
        waitForIt: {}
    };

    /*
    * chatter public functions
    */

    chatter.addMsg = function(key, message) {
        if(!isStr(key) || !isStr(message)) {
            return;
        }

        if(!_.isArray(env.responses[key])) {
            env.responses[key] = [];
        }

        env.responses[key].push(message);
    };

    chatter.afterTimeout = function(key, timeout, random) {
        var tO = parseInt(timeout, 10);

        if(!isStr(key) || (tO < 1)) {
            return;
        }

        env.timeouts[key] = timeout;

        if(typeof random === 'number') {
            env.timeoutRandom[key] = parseInt(random, 10);
        }

    };

    chatter.flipFlop = function(key, responsesA, responsesB, pctA) {
        var pctInt = parseInt(pctA, 10);

        if(!isStr(key)) {
            return;
        }

        if(!_.isArray(env.responses[responsesA]) || env.responses[responsesA].length < 1) {
            return;
        }

        if(!_.isArray(env.responses[responsesB]) || env.responses[responsesB].length < 1) {
            return;
        }

        env.flipFlops[key] = [responsesA, responsesB];

        if(typeof pctA === 'number') {
            env.flipFlops[key].push(pctInt);
        } else {
            env.flipFlops[key].push(-1);
        }

        return env.flipFlops[key];
    };

    chatter.pctChance = function(key, pct, bonus) {
        var chance = parseInt(pct, 10);

        if(!isStr(key) || (chance < 1)) {
            return;
        }

        env.pctChance[key] = chance;

        if(typeof bonus === 'number') {
            env.pctBonus[key] = parseInt(bonus, 10);
        }
    };

    chatter.respond = function(key, msgObj) {
console.log('checking', key);

        if(!checkWaitForIt(key)) {
console.log('wait fail')
            return;
        }

        if(!checkTimeout(key)) {
console.log('time fail')
            return;
        }

        if(!checkChance(key)) {
console.log('chance fail')
            return;
        }

        if(flipFlop(key, msgObj)) {
            return;
        }

        msgRandom(key, msgObj);
    };

    /*
    * Internal functions
    */

    function checkChance(key) {
        var bonus = 0;

        if(typeof env.pctChance[key] !== 'number') {
            return;
        }

        if(typeof env.pctBonus[key] !== 'number') {
            bonus = env.pctBonus[key];
        }

        return pctChance(env.pctChance[key], bonus);
    }

    function checkTimeout(key) {
        var ago;

        if(typeof env.timeouts[key] !== 'number') {
            return true;
        }

        if(typeof env.lastSent[key] === 'undefined') {
            return true;
        }

        ago = new Date().getTime() - (env.timeouts[key] * 1000);

        if(env.lastSent[key] < ago) {
            return true;
        }

console.log('remains...', (env.lastSent[key] - ago) / 1000);
        return false;
    }

    function checkWaitForIt(key, msgObj) {
console.log('waitForIt '+key, env.waitForIt[key]);
        if(typeof env.waitForIt[key] !== 'number') {
            // carry on...
            return true;
        }

        return true;
    }

    function flipFlop(key, msgObj) {
        var msg,
            respKey,
            chance = 50;

        if(_.isArray(env.flipFlops[key])) {
            if(env.flipFlops[key][2] > -1) {
                chance = env.flipFlops[key][2];
            }

            if(pctChance(chance)) {
                respKey = env.flipFlops[key][0];
            } else {
                respKey = env.flipFlops[key][1];
            }

            if(checkTimeout(respKey)) {
                msg = msgRandom(respKey, msgObj);

                if(msg) {
                    setLastSent(key);
                    return msg;
                }
            }
        }

        return false;
    }

    function getUser(msgObj) {
        return msgObj.message.user.name;
    }

    function isStr(key) {
        return typeof key === 'string' && key.length > 0;
    }

    function msgRandom(key, msgObj) {
        var response,
            vars = {
                user: getUser(msgObj)
            };

        if(!_.isArray(env.responses[key]) || env.responses[key].length < 1) {
            return;
        }
        
        response = swapVars(env.responses[key][Math.floor(Math.random()*env.responses[key].length)], vars);

        msgObj.send(response)
        setLastSent(key);

        return response;
    }

    function pctChance(pct, bonus) {
        var ran = parseInt(Math.random() * 100, 10),
            plus = parseInt(bonus, 10) || 0;

        if(parseInt(pct, 10) >= (ran + plus)) {
            return true;
        }

        return false;
    }

    function setLastSent(key) {
        var rand = 0,
            randMsec = 0;

        if(typeof env.timeoutRandom[key] === 'number') {
            randMsec = parseInt(env.timeoutRandom[key], 10);
        }

        if(randMsec > 0) {
            rand = 0 + ((randMsec / 2) - (Math.random() * randMsec));
        }

        env.lastSent[key] = parseInt(new Date().getTime() + rand, 10);
    }

    function swapVars(str, vars) {
        var iter;

        if(typeof str === 'string' && typeof vars === 'object') {
            for (iter in vars) {
                str = str.replace(new RegExp('\\#\\#'+iter+'\\#\\#'), vars[iter]);
            }
        }

        return str;
    }

})();

module.exports = chatter;


/*
# Description:
#   respond to various things said in group chats
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#
# Author:
#   bryn, based on brian's yourmom.coffee

chatter = require 'hubot-groupchatter'

# the responses - format to your use (arrays, strings, etc.)
groupResponses = {
    doIt: "http://i.imgur.com/nFSebim.gif",
    tablesNegative: [
      "(╯°□°）╯︵ ┻━┻",
      "┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻",
      "(ﾉಥ益ಥ）ﾉ﻿ ┻━┻",
      "Yeah! Screw Tables!"
    ],
    tablesPositive: [
      "┬─┬ノ( º _ ºノ) Please be nice to tables.",
      "┬──┬﻿ ¯\\_(ツ) A straigntened table is a happy table."
    ],
    thanksGeoff: [
      "Thanks Geoff!",
      "http://s.imgur.com/images/aboutus/geoff.jpg"
    ],
    NSFW: "ಠ__ಠ"
    yourMom: [
      "(rekt)",
      "http://en.wikipedia.org/wiki/List_of_burn_centers_in_the_United_States",
      "http://i.imgur.com/a0QcvmK.gif",
      "https://i.imgur.com/S7miMzp.png"
    ]
}

###
YOUR SETTINGS GO HERE
###

# The bot will wait until triggered N times in S secnds.
# An array of [N, S].
waitForIt = {
  thanksGeoff: [5, 300]
}

# The bot should only say these once per N in seconds
timeouts = {
    doIt: 10,
    thanksGeoff: 300
}

# Add +/- this number of seconds totimeouts.
# The number must be a positive int > 10.
# The middle of the number is normalized to 0 and either
# the first half is subtracted or the second half is added
# ot the lastSent timestamp
timoutRandom = {
  thanksGeoff: 60
}

###
INTERNAL SETTINGS
###

# keep track of the last time one of something was sent
lastSent = {};

###
INTERNAL FUNCTIONS
###

getMessage = (key) ->
  console.log("#{key} is an array", isArray(groupResponses[key]))

setLastSent = (key) ->
  if !key
    return 0
  randAmt = 0
  randMsec = 0
  if timoutRandom[key]
    randMsec = parseInt(timoutRandom[key], 10) * 1000
  if randMsec > 10
    randAmt = 0 + ((randMsec / 2) - (Math.random() * randMsec))
  lastSent[key] = new Date().getTime() + randAmt
  return randAmt

checkLastSent = (key) ->
  if !key
    return false
  if lastSent[key] and timeouts[key]
    currAgo = new Date().getTime() - (timeouts[key] * 1000)
    if lastSent[key] < currAgo
      setLastSent(key)
      return true
  else
    setLastSent(key)
    return 'yo'
  return false

waitingForIt = (key) ->
  if !key
    return false
  counted = 0
  waitKey = '@@WAITING@@'+key+'@@'

###
YOUR FUNCTIONS
###

module.exports = (robot) ->
  # doIt
  robot.hear /^do it/i, (msg) ->
    msg.send(groupResponses.doIt)

  robot.hear /^thanks (geoff|@gm)[.!]*$/i, (msg) ->
    getMessage('thanksGeoff')
    if checkLastSent('thanksGeoff')
      msg.send(groupResponses.thanksGeoff[Math.floor(Math.random()*groupResponses.thanksGeoff.length)])

  robot.hear /your mom/i, (msg) ->
    msg.send(groupResponses.doit)


*/