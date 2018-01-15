<div align="center">
  <h1>R6Bot</h1>
  <h3>Reddit bot for busy moderators</h3>
  </br>
  </br>
</div>  
  
# Init  

```
npm init or yarn  
```

Run `yarn run watch` to watch for changes in `src/` and compile to `lib/`. `yarn run dev` to run in dev mode.

# What is R6Bot

R6Bot is a moderator bot we use at /r/Rainbow6. So far, it can watch for user reports and spit out a nice embed message to our Discord channel we use to communicate. R6Bot is (pretty) easily extendable with custom tasks that run periodically. We use [snoowrap](https://github.com/not-an-aardvark/snoowrap) reddit API wrapper and [discord.js](https://github.com/hydrabolt/discord.js/).

# How to use R6Bot

## Setting up

* Create reddit app from [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps/)
* Create Discord app from [discordapp.com/developers/applications/me](https://discordapp.com/developers/applications/me)
* Rename `.env.example` to `.env` and fill out the fields.
  * `DC_` and `R_` prefixes are for Discord and reddit respectively
  * Fill `BOT_TARGETSUB` and `BOT_DEVSUB`. With these you let the bot know which subreddit is the target subreddit for tasks. If `BOT_DEVSUB` is omitted, the bot will target `BOT_TARGETSUB` for tasks
  * `DC_DEFAULT_CHANNEL` if you want discord functionalities with R6Bot, this will be the default channel which the bot sends task messages.
* Create a new subreddit wiki page to /r/`subreddit_name`/wiki/r6bot/config
* Copy the `exampleSubConfig.json` from this root directory to the new wiki page and hit save. Remember to at least change the target and dev sub properties.
* [Run the bot](#init).
