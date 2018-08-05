# tweetsock

this is a very simple bridge between socket.io and the twitter (infamous
api), you can probably write this in less than 5 mins, but i didn't directly
find something that did what i needed on npm.

# configure
create `../config.js`

```js
module.exports = {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: '',
    users: ['madona', 'maradona', 'messi']
}
```

you can also setup env variables
```sh
env TWITTER_CONSUMER_KEY="" \
TWITTER_CONSUMER_SECRET="" \
TWITTER_TOKEN="" \
TWITTER_TOKEN_SECRET="" \
TWITTER_FOLLOW_USERS="madona maradona messi" # look ma, no comas !
```

# running
```sh
yarn && yarn start
```

# tracking terms
pull requests are welcome =)
