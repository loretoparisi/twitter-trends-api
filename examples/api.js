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

    })
    .catch(error => {
        console.error(error);
    })
