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
    access_token_key: '',
    access_token_secret: '',
    users: ['madona', 'maradona', 'messi']
}
```

# running
```sh
yarn && yarn start
```

# tracking terms
pull requests are welcome =)
