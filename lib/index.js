/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */

"use strict";
const { TwitterClient } = require('twitter-api-client');
const fs = require('fs');

const Util = require('./util');

(function () {

  const TwitterTrends = (function () {

    function TwitterTrends(params) {
      var options = {
      }
      for (var attr in params) options[attr] = params[attr];

      // logon to Twitter
      const twitterApiKeys = {
        apiKey: process.env['TWITTER_API_KEY'],
        apiSecret: process.env['TWITTER_API_SECRET'],
        accessToken: process.env['TWITTER_ACCESS_TOKEN'],
        accessTokenSecret: process.env['TWITTER_ACCESS_TOKEN_SECRET'],
      };
      const signature = Object.keys(twitterApiKeys).filter(key => typeof (twitterApiKeys[key]) != 'undefined');
      if (!signature.length) {
        throw new Error('missing api keys');
      }
      this.twitterClient = new TwitterClient(twitterApiKeys);
    }//TwitterTrends

    /**
     * Get Local Trends Places
     * @param {Object} params { countryCode: string } filter places by country code
     * @returns {Array} of places
     * [{
        "name": "Bologna",
        "placeType": {
          "code": 7,
          "name": "Town"
        },
        "url": "http://where.yahooapis.com/v1/place/711080",
        "parentid": 23424853,
        "country": "Italy",
        "woeid": 711080,
        "countryCode": "IT"
      }]
     */
    TwitterTrends.prototype.getPlaces = function (params) {
      var self = this;
      var options = {
        countryCode: ''
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        // Get local trends and update json to file
        self.twitterClient.trends.trendsAvailable()
          .then(data => {
            this.places = data; // update places
            if(options.countryCode!='') {
              data = data.filter( item => item.countryCode==options.countryCode);
            }
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          })
      });
    }//getPlaces

    /**
     * Returns the top 50 trending topics for a specific WOEID, if trending information is available for it
     * @param {*} params { id: int, exclude: bool }
     * @returns {Object} The response is an array of trend objects that encode the name of the trending topic
     [
      {
        "trends": [
          {
            "name": "#You_make_Me_DAY6",
            "url": "http://twitter.com/search?q=%23You_make_Me_DAY6",
            "promoted_content": null,
            "query": "%23You_make_Me_DAY6",
            "tweet_volume": 147818
          },
          {
            "name": "#SuperLeague",
            "url": "http://twitter.com/search?q=%23SuperLeague",
            "promoted_content": null,
            "query": "%23SuperLeague",
            "tweet_volume": 275567
          }
        ]
     */
    TwitterTrends.prototype.getTopics = function (params) {
      var self = this;
      var options = {
        // The numeric value that represents the location from where to return trending information for from.
        // Formerly linked to the Yahoo! Where On Earth ID Global information is available by using 1 as the WOEID
        id: '1',
        // Setting this equal to 'hashtags' will remove all hashtags from the trends list.		
        exclude: '',
        // max number of trending topics to return
        limit: 50
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        // Get local trends and update json to file
        self.twitterClient.trends.trendsPlace({
          id: params.id,
          exclude: options.exclude
        })
          .then(data => {
            if(!Util.empty(data) && data.length && !Util.empty(data[0].trends)) {
              data = data[0];
              data.trends = data.trends.slice(0,options.limit);
            }
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          })
      });
    }//getTopics

    /**
     * * Get the Top  Trending Topics in country code ISO 3166-2
     * @param {*} params { countryCode: string, placeType: string }
     * @returns 
     */
    TwitterTrends.prototype.getTopicsByCountryCode = function (params) {
      var self = this;
      var options = {
        // filter by country code
        countryCode: 'US',
        // filter by place type: Town | Country
        placeType: TwitterTrends.PLACE_TYPE_TOWN,
        // Setting this equal to 'hashtags' will remove all hashtags from the trends list.		
        exclude: '',
        // max number of trending topics to return
        limit: 50
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        self.getPlaces({ countryCode: options.countryCode })
          .then(data => {
            return Util.promiseAllP(data, (item, index, resolve, reject) => {
              self.getTopics({
                id: item.woeid, 
                limit: options.limit, 
                exclude: options.exclude })
              .then(data => {
                data.place=item;
                return resolve(data);
              })
              .catch(_ => {// ignore
                return resolve({ place: item });
              })
            });
          })
          .then(data => {
            data = data.filter(item => item.place.placeType.name == options.placeType);
            return resolve({
              places: data
            });
          })
          .catch(error => {
            return reject(error);
          })
      });
    }//getTopics

    /**
     * Place of type Country
     */
    TwitterTrends.PLACE_TYPE_COUNTRY = 'Country';

    /**
     * Place of type Town
     */
    TwitterTrends.PLACE_TYPE_TOWN = 'Town';

    return TwitterTrends;

  })();

  module.exports = TwitterTrends;

}).call(this);