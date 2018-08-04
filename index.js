var io = require('socket.io')(8081);
var cfg = require('../config');
var Twitter = require('twitter');
var debug = require('debug')('tweetsock')

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
