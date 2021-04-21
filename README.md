# twitter-trends-api
Twitter Trends API Exampes

[![NPM Version](https://img.shields.io/npm/v/twittertrendsapi.js)](https://img.shields.io/npm/v/twittertrendsapi.js)

## How to install

```
npm i twittertrendsapi.js
```

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

- `getPlaces`, Get Local Trends Places.
- `getTopics`, Get the top 50 trending topics for a specific location or worldwide.
- `getTopicsByCountry`, To get the top trending topics by ISO 3166-2 Country Code (e.g. `US` ) and place type (`Town` or `Country`).
- `getTopicsByLanguage`, To get the top trending topics by ISO 639-1 Language Code (e.g. `en` ) and place type (`Town` or `Country`).

## Examples
Creare a new `TwitterTrends` instance with in memory cache `expire` parameter. We suggest at least `15` minutes of cache expiration at minimum, due to Twitter API rate limits that has a 15-minute window (see section Errors).
```javascript
const twitterTrends = new TwitterTrends({ expire: (1000 * 60 * 15) });
```

Get Local Trends Places in Italy (`IT`)
```javascript
twitterTrends.getPlaces({
    // ISO 3166-2 Country Code
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
twitterTrends.getTopicsByCountry({
    // ISO 3166-2 Country Code
    countryCode: 'IT',
    // filter by place of type 'Town'
    placeType: TwitterTrends.PLACE_TYPE_TOWN
});
```
Get the top trending topics in Spain (`ES`) for place type `Country` (so Spain).
```javascript
twitterTrends.getTopicsByCountryCode({
    // filter trends places by ISO 3166-2 Country Code
    countryCode: 'ES',
    // filter by place of type 'Country'
    placeType: TwitterTrends.PLACE_TYPE_COUNTRY
});
```
Get the top trending topics in italian (`it`) for `Town` places.
```javascript
twitterTrends.getTopicsByLanguage({
    // ISO 639-1 Language Code
    languageCode: 'it',
    // filter by place of type 'Town'
    placeType: TwitterTrends.PLACE_TYPE_TOWN
});
```

## Errors
- `Rate limit exceeded`, indicates that api rate limit has been reached. Please check [Twitter API v2 rate limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits#v2-limits)
```json
{
	"errors": [{
		"message": "Rate limit exceeded",
		"code": 88
	}]
}
```

## Acknowledgments
`TwitterTrends` uses the following libraries
- [twitter-api-client](https://github.com/FeedHive/twitter-api-client)
- [simple-mem-cache](https://github.com/fsoft72/simple-mem-cache)