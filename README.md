# twitter-trends-api
Twitter Trends API Exampes

## How to run
Please set your Twitter api keys env

```bash
export TWITTER_API_KEY='**************' \
export TWITTER_API_SECRET='**************' \
export TWITTER_ACCESS_TOKEN='**************' \
export TWITTER_ACCESS_TOKEN_SECRET='**************'
```

You can then run the api
```
git clone https://github.com/loretoparisi/twitter-trends-api.git
cd twitter-trends-api/
npm install
node examples/api.js
```

## APIs
`TwitterTrends` exposes the following apis

- `getPlaces`, Get Local Trends Places
- `getTopics`, Get the top 50 trending topics for a specific location
- `getTopicsByCountryCode`, To get the top trending topics by ISO 3166-2 Country Code (e.g. US ) and place type (`Town` or `Country`)

## Examples
Get Local Trends Places in Italy (`IT`)
```javascript
twitterTrends.getPlaces({
    countryCode: 'IT'
});
```
Get the top 50 trending topics for worldwide
```javascript
twitterTrends.getTopics({
    // Yahoo! woeid: the location from where to return trending information for from.
    id: '1',
    // Setting this equal to hashtags will remove all hashtags from the trends list.
    exclude: '',
    // top ten trending topic
    limit: 10
});
```
Get the top trending topics in Italy (`IT`) for `Town` places.
```javascript
twitterTrends.getTopicsByCountryCode({
    // filter trends places by ISO 3166-2 Country Code
    countryCode: 'IT',
    // filter by place of type 'Town'
    placeType: TwitterTrends.PLACE_TYPE_TOWN
});
```

Get the top trending topics in Italy (`ES`) for place type `Country` (so Spain).
```javascript
twitterTrends.getTopicsByCountryCode({
    // filter trends places by ISO 3166-2 Country Code
    countryCode: 'ES',
    // filter by place of type 'Country'
    placeType: TwitterTrends.PLACE_TYPE_COUNTRY
});
```