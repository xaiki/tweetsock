var io = require('socket.io')(process.env.TWEETSOCK_PORT || 80);
let connected = 0

io.on('connect', () => connected++ )
io.on('disconnect', () => connected-- )

setInterval(() => console.log('peers: ', connected), 10000)

var cfg = {}
try {
    cfg = require('../config');
} catch (e) {
    console.log('no config defaulting to env vars', e)
}

var Twitter = require('twitter');
var debug = require('debug')('tweetsock')

if (process.env.TWITTER_CONSUMER_KEY)
    cfg.consumer_key = process.env.TWITTER_CONSUMER_KEY
if (process.env.TWITTER_CONSUMER_SECRET)
    cfg.consumer_secret = process.env.TWITTER_CONSUMER_SECRET
if (process.env.TWITTER_TOKEN_KEY)
    cfg.access_token_key = process.env.TWITTER_TOKEN_KEY
if (process.env.TWITTER_TOKEN_SECRET)
    cfg.access_token_secret = process.env.TWITTER_TOKEN_SECRET
if (process.env.TWITTER_FOLLOW_USERS)
    cfg.users = process.env.TWITTER_FOLLOW_USERS.split(' ')

var Client = new Twitter(cfg)

Client.get('users/lookup', {
    screen_name: cfg.users.join(',')
}).then(users => users.map((u, i) => u.id))
      .then(uids => {
          var config = {
              follow: uids.join(',')
          }

          debug('opening stream on', config)
          var stream = Client.stream('statuses/filter', config)
          stream.on('data', tweet => {
              if (uids.indexOf(tweet.user.id) === -1)
                  return console.error('ignoring tweet from', tweet.user.screen_name)
              if (tweet.in_reply_to_status_id)
                  return console.error('ignoring reply to', tweet.in_reply_to_screen_name)

              var text = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text
              io.emit('tweet', text);
              console.log('tweet', text)
          })
          stream.on('error', error => {
              console.error("got error", error)
          })
      }).catch(e => console.error('error', e))
