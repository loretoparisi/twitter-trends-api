/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
const TwitterTrends = require('../lib/index');
const TwitterTrendsUtil = require('../lib/util');
const fs = require('fs');

var countryCode = 'IT', languageCode = 'it';

// twitter trends instance
const twitterTrends = new TwitterTrends({});

// Get Local Trends Places
twitterTrends.getPlaces({})
    .then(data => {
        console.log("TOPIC PLACES SAMPLE\n",TwitterTrendsUtil.randomElement(data));
        fs.writeFileSync('./trends_places.json', JSON.stringify(data, null, 2));
        // filter  Local Trends Places by ISO 3166-2 Country Code (e.g. US )
        return twitterTrends.getPlaces({
            countryCode: countryCode
        });
    })
    .then(data => {
        console.log("TOPIC PLACES in [%s]\n",countryCode, JSON.stringify(data, null, 2));
        // get a place trends
        return twitterTrends.getTopics({
            // Yahoo! woeid: the location from where to return trending information for from.
            id: '1',
            // Setting this equal to hashtags will remove all hashtags from the trends list.
            exclude: '',
            // top ten trending topic
            limit: 10
        });
    })
    .then(data => {
        console.log("TOP [%d] TOPICS WORDLWIDE\n",data.trends.length, JSON.stringify(data, null, 2));
        //  get the top  trending topics by ISO 3166-2 Country Code (e.g. US ) and place type
        return twitterTrends.getTopicsByCountry({
            countryCode: countryCode,
            // filter by place of type 'Town'
            placeType: TwitterTrends.PLACE_TYPE_TOWN
        });
    })
    .then(data => {
        fs.writeFileSync(`./trending_topics_${countryCode}.json`, JSON.stringify(data, null, 2));
        console.log("Found [%d] PLACES of type [%s] in [%s]\n", data.places.length, TwitterTrends.PLACE_TYPE_TOWN, countryCode);
        data.places.forEach(place => {
            console.log("PLACE [%s] TOPIC SAMPLE\n",place.locations[0].name, TwitterTrendsUtil.randomElement(place.trends));
        });
        return twitterTrends.getTopicsByCountry({
            countryCode: countryCode,
            // filter by place of type 'Country'
            placeType: TwitterTrends.PLACE_TYPE_COUNTRY
        });
    })
    .then(data => {
        console.log("Found [%d] PLACES of type [%s] in [%s]\n", data.places.length, TwitterTrends.PLACE_TYPE_COUNTRY, countryCode);
        data.places.forEach(place => {
            console.log("PLACE [%s] TOPIC SAMPLE\n",place.locations[0].name, TwitterTrendsUtil.randomElement(place.trends));
        });
        return twitterTrends.getTopicsByLanguage({
            languageCode: languageCode,
            // filter by place of type 'Country'
            placeType: TwitterTrends.PLACE_TYPE_TOWN
        });
    })
    .then(data => {
        console.log("Found [%d] PLACES of type [%s] for language [%s]\n", data.places.length, TwitterTrends.PLACE_TYPE_COUNTRY, languageCode);
        data.places.forEach(place => {
            console.log("PLACE [%s] TOPIC SAMPLE\n",place.locations[0].name, TwitterTrendsUtil.randomElement(place.trends));
        });
    })
    .catch(error => {
        console.error(error);
    })
