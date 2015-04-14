<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Future Plans](#future-plans)
- [Reference](#reference)
  - [Response template vars](#response-template-vars)
      - [Response Template Variables](#response-template-variables)
  - [```chatter #hubot-groupchatter```](#chatter-#hubot-groupchatter)
      - [Parameters](#parameters)
  - [```chatter.addResponse(key, message)```](#chatteraddresponsekey-message)
      - [Parameters](#parameters-1)
  - [```chatter.throttle(key, timeout, random)```](#chatterthrottlekey-timeout-random)
      - [Parameters](#parameters-2)
  - [```chatter.flipFlop(key, responseKeyA, responseKeyB, percentageA)```](#chatterflipflopkey-responsekeya-responsekeyb-percentagea)
      - [Parameters](#parameters-3)
  - [```chatter.percentChance(key, percent, bonus)```](#chatterpercentchancekey-percent-bonus)
      - [Parameters](#parameters-4)
  - [```chatter.respond(key, messageObject)```](#chatterrespondkey-messageobject)
      - [Parameters](#parameters-5)
  - [```chatter.waitForIt(key, count, random)```](#chatterwaitforitkey-count-random)
      - [Parameters](#parameters-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

1. Get [Hubot](https://github.com/github/hubot) installed.
1. In your Hubot directory, ```npm install hubot-groupchatter```.
1. Copy ```node_modules/hubot-groupchatter/groupchatter.coffee.sample``` to your Hubot scripts directory and rename the file to ```groupchatter.coffee```.
1. Edit ```groupchatter.coffee``` to your liking.

## Usage

## Technical Details

* This code is released under the GPLv3 License.
* Most of the logic has been abstracted away via methods on the chatter object that gets exported.
* I am not sure of how to abstract away the4 callback portion of Hubot yet (the ```module.exports = (robot) ->...``` portion of your script). If I did, they would have been abstracted away as well. This means your script is a two-section deal for now. If you know how to do this, please feel free to hand me a PR.
* This module will not help you write regular expressions. You're on your own there.
* I wrote this code quickly and don't have a lot of time for maintaining it. If you have issues please feel free to file a bug, but I cannot guarantee a decent response time. If you'd like to join the project let me know, but I must ask that you have a history of contributing before allowing you direct access (unless I can personally vouch for you).
* As mentioned above, contribution is encouraged. If you make a pull request, please feel free to add yourself at the *bottom* of the contributors list in package.json with your PR.
* If you want to install from GitHub, use ```npm install git://github.com/BrynM/hubot-groupchatte.git``` or ```npm install git://github.com/BrynM/hubot-groupchatte.git#0.0.2``` for a specific version.
* If you want to use the internal console messaging, keep your changes to being declarative. That is, report raw values - don't try to do things like math or calculation. This will keep the console functionality messages cheap.
* I didn't write any tests. My bad. See note further above about being written quickly. See GPLv3 language for fitness of use.


## Future Plans

* Add command interface from specific user names to run public functions. This would make the bot configurable from chat.
* Implement Hubot logging? Might need a delayed queue on startup until the exports.
* Per-user triggers (trottling, delays, trolling someone specific, etc.).
* Add alarm clock functionality (with snooze?).

## Reference

This documentation assumes you're using CoffeeScript, as this is what Hubot was meant to use. That said the translation to JavaScript is nominal, so feel free to apply this documentation to that as well.

### Response template vars

To use a template variable, surround it in two hash marks ("##"). For example:

```coffeescript
chatter.addResponse('encouragements', 'Yeah, ##user##!')
```

##### Response Template Variables

|Variable|..|
|---|---|
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

### ```chatter #hubot-groupchatter```

##### Parameters

*None.*

### ```chatter.addResponse(key, message)```

##### Parameters

* ***key***
* ***message***

### ```chatter.throttle(key, timeout, random)```

##### Parameters

* ***key***
* ***timeout***
* ***random*** *(optional)*

### ```chatter.flipFlop(key, responseKeyA, responseKeyB, percentageA)```

##### Parameters

* ***key***
* ***responseKeyA***
* ***responseKeyB***
* ***percentageA*** *(optional)*

### ```chatter.percentChance(key, percent, bonus)```

##### Parameters

* ***key***
* ***percent***
* ***bonus*** *(optional)*

### ```chatter.respond(key, messageObject)```

##### Parameters

* ***key***
* ***messageObject***

### ```chatter.waitForIt(key, count, random)```

##### Parameters

* ***key***
* ***count***
* ***random*** *(optional)*
