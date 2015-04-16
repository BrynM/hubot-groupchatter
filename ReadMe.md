# Group Chatter for Hubot

This module (officially "*hubot-groupchatter*" or simply "*groupchatter*") is a framework for using [Hubot](https://github.com/github/hubot) as a conversation participant. The concept is that Hubot will listen to normal chat and interject, initiate, or join in group responses. It can also be used to make functional responses, such as a Magic 8 Ball, in a limited way.

Included is functionality for percentage based randomization, randomized binary decisions (flip-flop), delays, throttling, and responses with template variables.

On top of that, you don't need to have much understanding of CoffeeScript to add response logic or tie that logic together. You will need to know some about regular expressions though.

Keep in mind that I wrote this pretty quickly to get my feet wet with Hubot. No warranties or fitness, yadda, yadda, [license](https://github.com/BrynM/hubot-groupchatter/blob/master/license.txt), yadda... You know how it goes. Code contributions are welcome!

<!-- To generate the TOC, run `doctoc \-\-title '# Contents' ReadMe.md` -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Contents

- [Installation](#installation)
- [Usage](#usage)
  - [General](#general)
  - [Caveats](#caveats)
  - [Sample ```scripts``` file](#sample-scripts-file)
- [Reference](#reference)
  - [Response template Variables](#response-template-variables)
      - [List of Template Variables](#list-of-template-variables)
      - [Example](#example)
  - [```chatter``` ***Required***](#chatter-required)
      - [Example](#example-1)
  - [```chatter.addResponse(key, message)``` ***Required***](#chatteraddresponsekey-message-required)
      - [Argument: ```key```](#argument-key)
      - [Argument: ```message```](#argument-message)
      - [Example](#example-2)
  - [```chatter.delay(key, seconds)```](#chatterdelaykey-seconds)
      - [Argument: ```key```](#argument-key-1)
      - [Argument: ```seconds```](#argument-seconds)
      - [Example](#example-3)
  - [```chatter.delayRandom(key, seconds)```](#chatterdelayrandomkey-seconds)
      - [Argument: ```key```](#argument-key-2)
      - [Argument: ```seconds```](#argument-seconds-1)
      - [Example](#example-4)
  - [```chatter.flipFlop(key, keyA, keyB, percentA)```](#chatterflipflopkey-keya-keyb-percenta)
      - [Argument: ```key```](#argument-key-3)
      - [Argument: ```keyA```](#argument-keya)
      - [Argument: ```keyB```](#argument-keyb)
      - [Optional Argument: ```percentA```](#optional-argument-percenta)
      - [Example](#example-5)
  - [```chatter.logLevel(setMode)``` ***Optional Setup***](#chatterloglevelsetmode-optional-setup)
      - [Argument: ```setMode```](#argument-setmode)
      - [Example](#example-6)
  - [```chatter.percentChance(key, percent, bonus)```](#chatterpercentchancekey-percent-bonus)
      - [Argument: ```key```](#argument-key-4)
      - [Argument: ```percent```](#argument-percent)
      - [Optional Argument: ```bonus```](#optional-argument-bonus)
      - [Example](#example-7)
  - [```chatter.regex(key, regex)``` ***Required***](#chatterregexkey-regex-required)
      - [Argument: ```key```](#argument-key-5)
      - [Argument: ```regex```](#argument-regex)
      - [Example](#example-8)
  - [```chatter.regexIgnore(key, regex)```](#chatterregexignorekey-regex)
      - [Argument: ```key```](#argument-key-6)
      - [Argument: ```regex```](#argument-regex-1)
      - [Example](#example-9)
  - [```chatter.setUserPrefix(prefix)``` ***Optional Setup***](#chattersetuserprefixprefix-optional-setup)
      - [Argument: ```prefix```](#argument-prefix)
      - [Example](#example-10)
  - [```chatter.setUserSuffix(suffix)``` ***Optional Setup***](#chattersetusersuffixsuffix-optional-setup)
      - [Argument: ```suffix```](#argument-suffix)
      - [Example](#example-11)
  - [```chatter.startup(robot)``` ***Required***](#chatterstartuprobot-required)
      - [Argument: ```robot```](#argument-robot)
      - [Example](#example-12)
  - [```chatter.throttle(key, seconds, random)```](#chatterthrottlekey-seconds-random)
      - [Argument: ```key```](#argument-key-7)
      - [Argument: ```seconds```](#argument-seconds-2)
      - [Optional Argument: ```random```](#optional-argument-random)
      - [Example](#example-13)
  - [```chatter.waitForIt(key, count, seconds)```](#chatterwaitforitkey-count-seconds)
      - [Argument: ```key```](#argument-key-8)
      - [Argument: ```count```](#argument-count)
      - [Optional Argument: ```seconds```](#optional-argument-seconds)
      - [Example](#example-14)
- [Technical Details](#technical-details)
- [Future Hopes](#future-hopes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

1. Get [Hubot](https://github.com/github/hubot) installed.
1. In your Hubot directory, ```npm install hubot-groupchatter```.
1. Copy ```node_modules/hubot-groupchatter/groupchatter.coffee.sample``` to your Hubot ```scripts``` directory and rename the file to ```groupchatter.coffee```.
1. Edit ```groupchatter.coffee``` to your liking.
1. Run your bot and trigger the responses.

<small>Note: If you want to install from GitHub, use ```npm install git://github.com/BrynM/hubot-groupchatter.git``` or ```npm install git://github.com/BrynM/hubot-groupchatter.git#0.1.0``` for a specific version ("0.1.0" in this example). It is advised you install from npm's copy.</small>

## Usage

### General

The functionality and logic for groupchatter is organized by "*keys*". This facilitates tying things together to make more complex actions. A key should always contain one regular expression ([```chatter.regex()```](#chatterregexkey-regex-required)) and at least one response ([```chatter.addResponse()```](#chatteraddresponsekey-message-required)). If one of those is missing, no replies will be sent for that key.

When your Hubot observes the string your regular expression matches, whatever logic you may have specified for that key will be tested. If the tests all pass, Hubot will respond with one of your responses chosen at random.

### Caveats

The only exception to a key needing a regular expression are the two response keys used to store replies by [```chatter.flipFlop()```](#chatterflipflopkey-keya-keyb-percenta). In that case, you should use [```chatter.addResponse()```](#chatteraddresponsekey-message-required) for those keys and nothing else.  

[Concurrently](http://imgur.com/tHel6bY), the only exception to a key needing responses added is the primary key used for [```chatter.flipFlop()```](#chatterflipflopkey-keya-keyb-percenta) (the first argument). That key still does require a regular expression.

It is highly recommended that you thoroughly read through the sample ```scripts``` file even if you wish to start your file from scratch. The examples in it are functional and commented.

### Sample ```scripts``` file

The file "groupchatter.coffee.sample" contains examples for using and combining logic. It should be located at ```node_modules/hubot-groupchatter/groupchatter.coffee.sample``` relative to your Hubot or viewed online at [GitHub](https://github.com/BrynM/hubot-groupchatter/blob/master/groupchatter.coffee.sample).

Every function available to groupchatter should have an example in that file. Along with the reference section of this document, you should be able to . Here's a list of the examples:

* ***DO IT*** - Respond with the classic "Do it" GIF from Starsky and Hutch.
* ***yo*** - Join in the group all saying "yo".
* ***Count 30*** - A cheapo countdown for showing off delays.
* ***BOO!*** - A simple random delay for those scared of robots.
* ***Mentions of your mom*** - Self-explanatory and often used, just like your mom.
* ***gratuitous thanks*** - Acknowledge gladhanding except for Geoff.
* ***Magic 8 Ball*** - A 50% flip-flop example.
* ***table flip*** - A tendency to mostly reprimand, but sometimes reward, table flipping using flip-floping.

## Reference

This reference assumes you're using CoffeeScript and are at least a little familiar with it, as CoffeeScript is what Hubot was meant to use. That said, the translation to JavaScript is near-nonexistent so feel free to apply this documentation to that as well.


### Response template Variables

To use a template variable in your response, surround it in two hash marks ("##"). For now, the number of variables is fixed and limited.

##### List of Template Variables

|Variable|Explanation|
|:---|:---|
|date|The current server date|
|fulldate|The full date and time|
|id|The user id of the robot|
|match|Exact regex matched string from the  detected message|
|quote|Full quote of the detected message|
|robot|The name of the robot|
|room|The current chat room's name|
|time|The current server time|
|user|The user who sent the detected message|
|utc|The current server date and time translated to UTC|
|1|The first sub-match in your regular expression [<sup>1</sup>](#note-1)|

<a name="note-1">Note 1:</a><small> Regular expression matches are actually template variables 1 through 30 ("##1##", "##2##", "##3##", "##4##" ... "##30##",). Regular expression sub-matches that don't exist will be replaced with an empty string (""). This was the best way to deal with it for now.</small>

##### Example
```coffeescript
chatter.addResponse('iRule', 'Long live ##user##, Sovereign Ruler of ##room##!')
```

### ```chatter``` ***Required***

Our core object that gets exported when you require the module. Of course, you can call it whatever you want but it's absolutely required for groupchatter to work. You should put this at the top of your script along with your other imported modules.

##### Example
```coffeescript
chatter = require 'hubot-groupchatter'
```


### ```chatter.addResponse(key, message)``` ***Required***

Add a message for a given set key. Returns the message back on success and undefined on failure.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```message```

* *string*

The message you wish to reply with. This may include template variables.

##### Example
```coffeescript
chatter.addResponse('beratement', 'Well, you suck ##user##!')
```


### ```chatter.delay(key, seconds)```

Respond ```seconds``` after the detected message. For random delayed responses, see [```chatter.delayRandom()```](#chatterdelayrandomkey-seconds).

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```seconds```

* *positive integer*

The number of seconds you wish groupchatter to wait before responding. If this number is less than 1, chatter.delay() will be ignored.

##### Example
```coffeescript
chatter.delay('thritySecLater', 30)
```


### ```chatter.delayRandom(key, seconds)```

Respond between 0 and ```seconds``` after the detected message.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```seconds```

* *positive integer*

The maximum number of seconds you wish groupchatter to wait before responding. If this number is less than 1, chatter.delayRandom() will be ignored.

##### Example
```coffeescript
chatter.delayRandom('derp', 60)
```


### ```chatter.flipFlop(key, keyA, keyB, percentA)```

Create a superset of keyed responses to alternate between. Currently, only supports two sets. 

##### Argument: ```key```

* *string*

The key name for the set you'd like to use. This key is used for triggering regular expressions on this pairing of responses and does not require responses of its own.

##### Argument: ```keyA```

* *string*

The key name of a set where you've done nothing but store responses with [```chatter.addResponse()```](#chatteraddresponsekey-message-required). If you (by mistake perhaps) assign a regular expression to this key, it may get selected on its own and its responses may seem to trigger at random. 

##### Argument: ```keyB```

* *string*

The key name of a second set where you've done nothing but store responses with [```chatter.addResponse()```](#chatteraddresponsekey-message-required). If you (by mistake perhaps) assign a regular expression to this key, it may get selected on its own and its responses may seem to trigger at random. 

##### Optional Argument: ```percentA```

* *positive integer between 1 and 100*

You may optionally provide a percentage chance that keyA will be chosen for responses. By default, keyA and keyB each will have a 50% chance.

##### Example
```coffeescript
# reply yes or no evenly
chatter.flipFlop('yesOrNo', 'yesResponses', 'noResponses')

# join in flipping tables with a 75% chance of being positive/constructive/calming 
chatter.flipFlop('tableFlip', 'tablesPositive', 'tablesNegative', 75)
```


### ```chatter.logLevel(setMode)``` ***Optional Setup***

Set the log level for node console output. This is helpful for debugging your Hubot script or developing groupchatter.

##### Argument: ```setMode```

* *string*

The name of the logging mode you desire. The default is "warn". Valid names are as follows. Each log level also enables the ones listed after it up to "silent".

|Name||
|---:|:---|
|debug|Full logging. This is very noisy and is really only meant for development.|
|info|Some extra information about what's going on and which tests are failing.|
|warn|Log only warnings and errors.|
|silent|Don't log anything at all.|

##### Example
```coffeescript
chatter.logLevel('info')
```


### ```chatter.percentChance(key, percent, bonus)```

Only have a percentage chance of responding. This is the last test performed before a response is chosen, so delays and timeouts supersede it.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```percent```

* *positive integer between 1 and 100*

The percentage chance you'd like to give to respond.

##### Optional Argument: ```bonus```

* *positive integer between 1 and 100*

The value of this argument will be added to the generated random number, much like a role playing game. This can be used to give a "bottom-floor" to your ```percent``` chance. 

##### Example
```coffeescript
chatter.percentChance('rarelyRespond', 15)

chatter.percentChance('sometimesRespond', 20, 20)
```


### ```chatter.regex(key, regex)``` ***Required***

Set a regular expression to match something another user says that you'd like your set to trigger on. Only one regular expression is allowed per set, so multiple calls will overwrite each other with the newest call winning.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```regex```

* *```RegExp``` object*

The regular expression that you'd like your set to trigger on. This expression supports sub-matches that count from 1-30. Regular expression sub-matches that don't exist, but appear in templates, will be replaced with an empty string ("").

##### Example
```coffeescript
# set a simple regex
chatter.regex('noWay', /^way[!.]?$/i)

# use sub-matches in template vars
chatter.regex('matchedThing', /^look at (that|this|my|your|their|its) thing$/)
chatter.addResponse('matchedThing', 'Nobody wants ##1## thing, ##user##!')
```


### ```chatter.regexIgnore(key, regex)```

Set a regular expression to match something another user says that you'd like your set to trigger on. Quite handy for avoiding embarrassing phrases and situations if you need to. These must be created per-set as you need them and multiple ignored regular expressions are supported per set.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```regex```

* *```RegExp``` object*

The regular expression that you'd like your set to ignore.

##### Example
```coffeescript
chatter.regex('stayOutOfIt', /(vim|emacs).*(emacs|vim)/i)
```


### ```chatter.setUserPrefix(prefix)``` ***Optional Setup***

Set a prefix to be prepended to the ```##user##``` response template variable. By detault "@" is used. Thus, the template "Hi ##user##!" for the user "steve" would end up with the response of "Hi @steve!".

##### Argument: ```prefix```

* *string*

The string you'd like to be prepended to the user that triggered the response..

##### Example
```coffeescript
# change this for a reddit bot
chatter.setUserPrefix('/u/')
```

### ```chatter.setUserSuffix(suffix)``` ***Optional Setup***

Set a prefix to be prepended to the ```##user##``` response template variable. By default an empty string ("") is used. Thus, the template "Hi ##user##!" with a suffix of "(jerk)" for the user "steve" would end up with the response of "Hi steve(jerk)!".


##### Argument: ```suffix```

* *string*

The string you'd like to be appended to the user that triggered the response..

##### Example
```coffeescript
# add the clan tag to user names
chatter.setUserPrefix('[APES]')
```


### ```chatter.startup(robot)``` ***Required***

This is to be assigned as the ```module.exports``` of your Hubot script. If you do not put this somewhere in your script, groupchatter will never respond.

##### Argument: ```robot```

* *```module.exports``` invocated Hubot Robot object*

```module.exports``` will deal with this argument. Unless you're doing groupchatter development, you can safely ignore it.

##### Example
```coffeescript
module.exports = chatter.startup
```


### ```chatter.throttle(key, seconds, random)```

Throttle a set to only respond again after ```seconds```. Until that time expires, groupchatter will ignore any new triggers as well - including incrementing [```chatter.waitForIt()```](#chatterwaitforitkey-count-seconds) counts.

Optionally, a ```random``` variation in seconds can be provided. This number is split and applied centered to the end of ```seconds```. For example, with ```seconds``` set to 30 and ```random``` set to 10, groupchatter will not respond again for a random time between 25 and 35 seconds.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```seconds```

* *positive integer*

The number of seconds groupchatter should wait. Using a value of ```seconds``` below 1 will be ignored and throttling will be disabled.

##### Optional Argument: ```random```

* *positive integer*

The number of seconds to randomly add/subtract to ```seconds```. Using a value of ```random``` below 1 will nullify the randomization, but timing out may continue.

##### Example
```coffeescript
# wait 5 minutes before responding again
chatter.throttle('wait5Mins', 300)

# only respond every 30 to 90 seconds
chatter.throttle('notTooFast', 60, 60)
```


### ```chatter.waitForIt(key, count, seconds)```

Will wait until triggered ```count``` times before responding. Optionally, ```count``` can be constrained to a specific time window in ```seconds```.

##### Argument: ```key```

* *string*

The key name for the set you'd like to use.

##### Argument: ```count```

* *positive integer*

The number of triggers that must happen before groupchatter will respond. Using a value of ```count``` below 1 will be ignored.

##### Optional Argument: ```seconds```

* *positive integer*

Optional number of ```seconds``` that ```count``` must be achieved in. If not achieved, the counter will be reset on the next trigger after ```seconds``` expires. Using a value of ```seconds``` below 1 will be ignored, but triggering will continue.

##### Example
```coffeescript
chatter.waitForIt('replyEvery100', 100)

chatter.waitForIt('replyYesWithin1Min', 5, 60)
```

## Technical Details

* This code is released under the GPLv3 License.
* Most of the normal Hubot response setup logic has been abstracted away.
* This module will not help you write regular expressions. You're on your own there. Don't give up. They're infinitely useful.
* I wrote this code quickly and don't have a lot of time for maintaining it. If you have issues please feel free to file a bug, but I cannot guarantee a decent response time. If you'd like to join the project let me know, but I must ask that you have a history of contributing before allowing you direct access (unless I can personally vouch for you).
* As mentioned above, contribution is encouraged. If you make a pull request, please feel free to add yourself at the *bottom* of the contributors list in package.json with your PR.
* If you want to use the internal console messaging, keep your changes to being declarative. That is, report raw values - don't try to do things like math or calculation. This will keep the console functionality messages cheap.
* I didn't write any tests. My bad. See note further above about being written quickly. See GPLv3 language for fitness of use.


## Future Hopes

These are in order of importance. If you'd like to contribute, feel free to take a stab at one of them.

* Make a ```chatter.waitForItRandom()```.
* Add user defined variables for responses (requires regex escaping of var names).
* Optional per-user triggers in a clean way (throttling, delays, trolling someone specific, etc.).
* Add command interface from specific user names ("admins") to run public functions. This would make the bot configurable from chat.
* Add some callback functionality.
* Add alarm clock functionality (with snooze?).

