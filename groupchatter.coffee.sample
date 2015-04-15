# Description:
#   respond to various things said in group chats
#
# Dependencies:
#   hubot-groupchatter
#
# Configuration:
#   None
#
# Commands:
#
# Author:
#   bryn, based on brian's yourmom.coffee

###
#
# Required stuff
#
###

###
# Require the module
###
chatter = require 'hubot-groupchatter'

###
# Assign chatter to the bot/exports
###
module.exports = chatter.startup

###
#
# Optional Setup
#
###

###
# Get debug output.
###
# 'debug', 'info', 'warn', and 'silent' are the options.
#chatter.logLevel('debug')

###
# Set the prefix for usernames (so you can make callouts in chat)
###
# the default is '@'
#chatter.setUserPrefix('@');

###
# Set the suffix for usernames (so you can make callouts in chat)
###
# The default is ''
#chatter.setUserSuffix('');

###
#
# User setup of responses
#
###

###
# DO IT! - Respond with the classic "Do it" GIF from Starsky and Hutch.
###

# Look for someone saying only "do it" with optional punctuation.
chatter.regex('doIt', /^do ?it([?.!]*|$)/i)

# Play the classic "do it" gif
chatter.addResponse('doIt', 'http://i.imgur.com/nFSebim.gif')

# Only answer once every 45 seconds at most
chatter.throttle('doIt', 45)


###
# yo - Join in the group all saying "yo".
###

# Look for someone only saying "yo"
chatter.regex('yo', /^\(?yo\)?$/i)

# The group must say "yo" or "(yo)" 3 times in a 60 second span for this to trigger
chatter.waitForIt('yo', 3, 60)

# Wait before answering again for two minutes, give or take 15 seconds
# (notice we use 30 for the random argument - it is split in half and is either added or subtracted)
chatter.throttle('yo', 120, 30)

# What we want to reply with
chatter.addResponse('yo', 'yo')


###
# Count 30 - a cheapo countdown for showing off delays
###

# look for a request to count
chatter.regex('count30', /count to 30/i)

# set a 30 second delay for the message
chatter.delay('count30', 30)

# throttle other requests
chatter.throttle('count30', 30)

# set our "alarm"
chatter.addResponse('count30', '##user##! Your count of 30 is up!')


###
# BOO! - A simple random delay for those saref of robots.
###

chatter.regex('boo', /(^|[^a-z])scared of robots([^a-z]|$)/i)

chatter.delayRandom('boo', 45)

chatter.addResponse('boo', '##user## BOO!')


###
# Mentions of your mom - Self-explanatory and often used, just like your mom.
###

chatter.regex('yourMom', /your mom/i)

chatter.addResponse('yourMom', 'http://en.wikipedia.org/wiki/List_of_burn_centers_in_the_United_States')
chatter.addResponse('yourMom', 'http://i.imgur.com/a0QcvmK.gif')
chatter.addResponse('yourMom', 'https://i.imgur.com/S7miMzp.png')


##
# gratuitous thanks - Acknowledge gladhanding except for Geoff.
##

chatter.regex('gratuitousThanks', /(thanks|thank you)/i)

chatter.regexIgnore('gratuitousThanks', /(geoff|@geoff)/i)

chatter.waitForIt('gratuitousThanks', 3)

# don't do this again for 5 minutes
chatter.throttle('tony', 300)

chatter.addResponse('gratuitousThanks', 'Great job all!')
chatter.addResponse('gratuitousThanks', 'You\'re welcome, ##user##.')
# hipchat extras - comment out or remove these if you don't want them
chatter.addResponse('gratuitousThanks', '(goodmeeting)')
chatter.addResponse('gratuitousThanks', '(teamwork)')


###
# Magic 8 Ball - A 50% flip-flop example.
###

# set the regex to activate the "responses"
chatter.regex('eightBall', /(eight|8)[\t \-]*balls?([^a-z]|$)/i)

# set our two message keys for the flip-flop
# by default a 50/50 chance
chatter.flipFlop('eightBall', 'eightBallYes', 'eightBallNo')

# set up our prefix
# unicode ➑ example: '\u2791' 
eightBallPrefix = '##user##\'s \u2791: '

# yesses
chatter.addResponse('eightBallYes', eightBallPrefix+'It is certain.')
chatter.addResponse('eightBallYes', eightBallPrefix+'It is decidedly so.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Without a doubt.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Yes definitely.')
chatter.addResponse('eightBallYes', eightBallPrefix+'You may rely on it.')
chatter.addResponse('eightBallYes', eightBallPrefix+'As I see it, yes.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Most likely.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Outlook good.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Yes.')
chatter.addResponse('eightBallYes', eightBallPrefix+'Signs point to yes.')

# noses?
chatter.addResponse('eightBallNo', eightBallPrefix+'Reply hazy try again.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Ask again later.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Better not tell you now.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Cannot predict now.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Concentrate and ask again.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Don\'t count on it.')
chatter.addResponse('eightBallNo', eightBallPrefix+'My reply is no.')
chatter.addResponse('eightBallNo', eightBallPrefix+'My sources say no.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Outlook not so good.')
chatter.addResponse('eightBallNo', eightBallPrefix+'Very doubtful.')


###
# table flip - A tendency to mostly reprimand, but sometimes reward, table flipping using flip-floping.
###

# set the regex to activate the "responses"
chatter.regex('tableFlip', /(\(?tableflip\)?|\( *\uFF89.*(\uFF09|\))\uFF89.*\u253B.*\u253B)/i);

# set our two message keys for the flip-flop
chatter.flipFlop('tableFlip', 'tablesPositive', 'tablesNegative', 75)

# only respond with an N percent chance
chatter.percentChance('tableFlip', 35)

# only answer once every N seconds at most
chatter.throttle('tableFlip', 25, 10)

# Negative/anarchist responses to flipping tables (encouragement)
chatter.addResponse('tablesNegative', '(╯°□°）╯︵ ┻━┻')
chatter.addResponse('tablesNegative', '┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻')
chatter.addResponse('tablesNegative', '(ﾉ ಥ 益 ಥ ）ﾉ﻿ ┻━┻')
chatter.addResponse('tablesNegative', '(ノ ゜Д゜)ノ ︵ ┻━┻')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/xBQOzc4.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/QBOsBHT.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/8E7Vk.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/G3ISG8d.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/veH7CZ3.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/LhtcAgb.gif')
chatter.addResponse('tablesNegative', 'http://i.imgur.com/m1PO7Gd.gif')
chatter.addResponse('tablesNegative', 'Yeah, ##user##! Screw Tables!')

# Positive/comforting responses to flipping tables
chatter.addResponse('tablesPositive', '┬─┬ノ( º _ ºノ)')
chatter.addResponse('tablesPositive', '┬─┬ノ( º _ ºノ) Please be nice to tables.')
chatter.addResponse('tablesPositive', '(._.)~ ┬──┬ ##user##, be nice to tables.')
chatter.addResponse('tablesPositive', '┬──┬﻿ ¯ヽ_(ツ)')
chatter.addResponse('tablesPositive', '┬──┬﻿ ¯ヽ_(ツ) A straigntened table is a happy table.')
chatter.addResponse('tablesPositive', '(/¯◡ ‿ ◡)/¯ ~ ┬──┬﻿')
chatter.addResponse('tablesPositive', '(/¯◡ ‿ ◡)/¯ ~ ┬──┬ That table\'s always been there to support you!﻿')
chatter.addResponse('tablesPositive', 'It\'s okay table. I\'ll get you out of here. http://i.imgur.com/mVYADwk.gif')
chatter.addResponse('tablesPositive', 'Run table! ##user##\'s gonna get you! http://i.imgur.com/NVg73.gif')
chatter.addResponse('tablesPositive', 'Hey ##user##! Let\'s be positive about tables! http://i.imgur.com/dbHxR5I.gif')
