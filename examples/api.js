/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */
const TwitterTrends = require('../lib/index');
const fs = require('fs');

// twitter trends instance
const trends = new TwitterTrends({});
// Get local trends and update json to file
trends.getPlaces()
    .then(data => {
        console.log(JSON.stringify(data));
        fs.writeFileSync('./trends_places.json', JSON.stringify(data, null, 2));
        // get a place trends
        return trends.getTopics({
            // Yahoo! woeid: the location from where to return trending information for from.
            id: '1',
            // Setting this equal to hashtags will remove all hashtags from the trends list.
            exclude: ''
        });
    })
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    })
