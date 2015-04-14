/*
* groupchatter.js
* https://github.com/BrynM/hubot-groupchatter
* Copyright (C) 2015 Bryn Mosher
* 
* This program is free software: you can redistribute it and/or modify it under
* the terms of the GNU General Public License as published by the Free Software
* Foundation, either version 3 of the License, or (at your option) any later
* version.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
* details.
* 
* You should have received a copy of the GNU General Public License along with
* this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var _ = require('underscore');

var chatter = {};

(function() {

    /*
    * Set up our environment
    */
    var env = {
        consolePrefix: '[CHATTER] ',
        debugMode: true,
        flipFlops: {},
        infoMode: true,
        lastSent: {},
        logLevel: 'warn',
        pctBonus: {},
        percentChance: {},
        responses: {},
        regexes: {},
        robot: null,
        silentMode: false,
        timeouts: {},
        timeoutRandom: {},
        userPrefix: '@',
        userSuffix: '',
        waitForIt: {},
        warnMode: true
    };

    /*
    * chatter public functions
    */

    chatter.addResponse = function(key, message) {
        if(!isStr(key) || !isStr(message)) {
            return;
        }

        if(!_.isArray(env.responses[key])) {
            env.responses[key] = [];
        }

        env.responses[key].push(message);

        return message;
    };

    chatter.delay = function(key, amount) {
//stub
    }

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

    chatter.logLevel = function(setMode) {
        if(isStr(setMode)) {
            switch(setMode.toLowerCase()) {
                case 'debug':
                    env.debugMode = true;
                    env.infoMode = true;
                    env.warnMode = true;
                    env.logLevel = 'debug';
                    break;
                case 'info':
                    env.infoMode = true;
                    env.warnMode = true;
                    env.logLevel = 'info';
                    break;
                case 'warn':
                case 'warning':
                    env.warnMode = true;
                    env.logLevel = 'warn';
                    break;
                case 'silent':
                    env.silentMode = true;
                    env.logLevel = 'silent';
                    break;
            }
        }

        return ''+env.logLevel;
    }
    // set the default log level
    chatter.logLevel('warn');

    chatter.percentChance = function(key, pct, bonus) {
        var chance = parseInt(pct, 10);

        if(!isStr(key) || (chance < 1)) {
            return;
        }

        env.percentChance[key] = chance;

        if(typeof bonus === 'number') {
            env.pctBonus[key] = parseInt(bonus, 10);
        }

        return env.percentChance[key];
    };

    chatter.randomDelay = function(key, amount) {
//stub
    }

    chatter.regex = function(key, regex) {
        var rex = false;

        if(!isStr(key)) {
            return;
        }

        if(regex instanceof RegExp) {
            rex = regex;
        } else if(isStr(regex)) {
            try {
                rex = new RegExp(regex);
            } catch(e) {
                err()
                rex = false;
            }
        }

        if(rex) {
            env.regexes[key] = rex;
        }

        return rex;
    };

    chatter.setUserPrefix = function(prefix) {
        if(typeof prefix === 'string') {
            env.userPrefix = ''+prefix;
        }

        return ''+env.userPrefix;
    }

    chatter.setUserSuffix = function(suffix) {
        if(typeof suffix === 'string') {
            env.userSuffix = ''+suffix;
        }

        return ''+env.userPrefix;
    }

    chatter.startup = function(robot) {
        info('Loading up!');
        env.robot = robot;

        applyAllRegexes(robot);
    };

    chatter.throttle = function(key, timeout, random) {
        var tO = parseInt(timeout, 10);

        if(!isStr(key) || (tO < 1)) {
            return;
        }

        env.timeouts[key] = timeout;

        if(typeof random === 'number') {
            env.timeoutRandom[key] = parseInt(random, 10);
        }

        return env.timeouts[key];
    };

    /*
    * Communication functions
    */

    function consoleArgs(args) {
        var argsCopy = _.toArray(args);

        if(typeof argsCopy[0] === 'string') {
            argsCopy[0] = env.consolePrefix+argsCopy[0];
        }

        return argsCopy;
    }

    function dbg(msg) {
        if(!env.silentMode && env.debugMode) {
            console.log.apply(console, consoleArgs(arguments));
        }
    }

    function err(msg) {
        if(!env.silentMode) {
            console.error.apply(console, consoleArgs(arguments));
        }
    }

    function info(msg) {
        if(!env.silentMode && env.infoMode) {
            console.info.apply(console, consoleArgs(arguments));
        }
    }

    function warn(msg) {
        if(!env.silentMode && env.warnMode) {
            console.warn.apply(console, consoleArgs(arguments));
        }
    }

    /*
    * Internal functions
    */

    function applyAllRegexes(robot) {
        var rgxSets = _.extendOwn({}, env.regexes),
            iter;

        for(iter in rgxSets) {
            if(rgxSets[iter] instanceof RegExp) {
                dbg('Attempting to apply regex.', iter);
                applyRegex(robot, iter, rgxSets[iter]);
            }
        }
    }

    function applyRegex(robot, key, regex) {
        var callback;

        if(_.isObject(robot) && _.isFunction(robot.hear) && regex instanceof RegExp) {
            callback = function(msg) {
                return respond(key, msg);
            };

            robot.hear(regex, callback);
            dbg('Applied regex.', [key, regex]);
        }
    }

    function checkChance(key) {
        var bonus = 0;

        if(typeof env.percentChance[key] !== 'number') {
            return;
        }

        if(typeof env.pctBonus[key] !== 'number') {
            bonus = env.pctBonus[key];
        }

        return percentChance(env.percentChance[key], bonus);
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

        dbg('Time remaining for '+key, (env.lastSent[key] - ago) / 1000);
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

            if(percentChance(chance)) {
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

    function getMatchFromMsg(msgObj) {
        if(_.isArray(msgObj.match)) {
            return msgObj.match[0];
        }

        return 'unknown-match';
    }

    function getQuoteFromMsg(msgObj) {
        if(_.isObject(msgObj.message) && isStr(msgObj.message.text)) {
            return msgObj.message.text;
        }

        return 'unknown-text';
    }

    function getRobotFromMsg(msgObj) {
        if(_.isObject(msgObj.robot)) {
            return msgObj.robot.name;
        }

        return 'unknown-robot';
    }

    function getRobotIdFromMsg(msgObj) {
        if(_.isObject(msgObj.message) && _.isObject(msgObj.message.user)) {
            return msgObj.message.user.id;
        }

        return 'unknown-robot-id';
    }

    function getRoomFromMsg(msgObj) {
        if(_.isObject(msgObj.message)) {
            return msgObj.message.room;
        }

        return 'unknown-room';
    }

    function getUserFromMsg(msgObj) {
        if(_.isObject(msgObj.message) && _.isObject(msgObj.message.user)) {
            return msgObj.message.user.name;
        }

        return 'unknown-user';
    }

    function isStr(key) {
        return typeof key === 'string' && key.length > 0;
    }

    function msgRandom(key, msgObj) {
        var response,
            last,
            vars = {
                'id': getRobotIdFromMsg(msgObj),
                'match': getMatchFromMsg(msgObj),
                'quote': getQuoteFromMsg(msgObj),
                'robot': env.userPrefix+getRobotFromMsg(msgObj)+env.userSuffix,
                'room': getRoomFromMsg(msgObj),
                'user': env.userPrefix+getUserFromMsg(msgObj)+env.userSuffix,
                'time': new Date().toTimeString(),
                'date': new Date().toDateString(),
                'utc': new Date().toUTCString(),
                'fulldate': new Date().toString()
            };

        if(!_.isArray(env.responses[key]) || env.responses[key].length < 1) {
            return;
        }
        
        response = swapVars(env.responses[key][Math.floor(Math.random()*env.responses[key].length)], vars);

        msgObj.send(response)
        last = setLastSent(key);

        if(env.debugMode) {
           debug('Message sent.', {'key': key, 'response': response, 'vars': vars, 'lastSent': last});
        } else {
           info('Message sent.', key);
        }

        return response;
    }

    function percentChance(pct, bonus) {
        var ran = parseInt(Math.random() * 100, 10),
            plus = parseInt(bonus, 10) || 0;

        if(parseInt(pct, 10) >= (ran + plus)) {
            return true;
        }

        return false;
    }

    function respond(key, msgObj) {
        info('Checking for possible responses.', key);

        if(!checkWaitForIt(key)) {
            info('Check waitForIt test fail.', key);
            return;
        }

        if(!checkTimeout(key)) {
            info('Check throttle test fail.', key);
            return;
        }

        if(!checkChance(key)) {
            info('Check chance test fail.', key);
            return;
        }

        if(flipFlop(key, msgObj)) {
            info('Found a flip-flop.', key);
            return;
        }

        info('Delivering random message.', key);
        msgRandom(key, msgObj);
    };

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

        return env.lastSent[key];
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
