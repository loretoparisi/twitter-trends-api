/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
const { TwitterClient } = require('twitter-api-client');
const fs = require('fs');

// logon to Twitter
const twitterApiKeys={
  apiKey: process.env['TWITTER_API_KEY'],
  apiSecret: process.env['TWITTER_API_SECRET'],
  accessToken: process.env['TWITTER_ACCESS_TOKEN'],
  accessTokenSecret: process.env['TWITTER_ACCESS_TOKEN_SECRET'],
};
const signature=Object.keys(twitterApiKeys).filter(key => typeof(twitterApiKeys[key])!='undefined');
if(!signature.length) {
  throw new Error('missing api keys');  
}
const twitterClient = new TwitterClient(twitterApiKeys);

// Get local trends and update json to file
twitterClient.trends.trendsAvailable()
.then(data => {
    console.log(JSON.stringify(data));
    fs.writeFileSync('./trends_places.json', JSON.stringify(data, null,2));

})
.catch(error => {
    console.error(error);
})
