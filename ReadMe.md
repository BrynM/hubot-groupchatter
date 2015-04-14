# Group Chatter for Hubot

This module is a framework for setting up Hubot as a conversation participant. The concept is that Hubot will listen to normal chat and interject or join in.

## Installation

## Technical Details

* This code is released under the 
* Most of the logic has been abstracted away via methods on the chatter object that gets exported.
* I am not sure of how to abstract away the4 callback portion of Hubot yet (the ```module.exports = (robot) ->...``` portion of your script). If I did, they would have been abstracted away as well. This means your script is a two-section deal for now. If you know how to do this, please feel free to hand me a PR.
* This module will not help you write regular expressions. You're on your own there.
* I wrote this code quickly and don't have a lot of time for maintaining it. If you have issues please feel free to file a bug, but I cannot guarantee a decent response time. If you'd like to join the project let me know, but I must ask that you have a history of contributing before allowing you direct access (unless I can personally vouch for you).
* As mentioned above, contribution is encouraged. If you make a pull request, please feel free to add yourself at the *bottom* of the contributors list in package.json with your PR.

## Usage

## Reference

This documentation assumes you're using CoffeeScript, as this is what Hubot was meant to use. That said the translation to JavaScript is nominal, so feel free to apply this documentation to that as well.

### ```chatter #hubot-groupchatter```

##### Parameters

*None.*

### ```chatter.addMsg(key, message)```

##### Parameters

* ***key***
* ***message***

### ```chatter.afterTimeout(key, timeout, random)```

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

### ```chatter.pctChance(key, percent, bonus)```

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
