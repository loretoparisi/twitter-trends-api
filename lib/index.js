/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */

"use strict";
const { TwitterClient } = require('twitter-api-client');
const fs = require('fs');
const path = require('path');

const Util = require('./util');
const MD5 = require('./md5');
const MemCache = require('./memcache');

(function () {

  const TwitterTrends = (function () {

    function TwitterTrends(params) {
      var options = {
        // expire time in msec
        expire: 1000 * 60 * 5
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
      // Twitter API Client
      this.twitterClient = new TwitterClient(twitterApiKeys);
      // Simple in memory cache
      this.memCache = new MemCache();

      // read stored trends places
      this.places = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/trends_places.json')).toString('utf-8'));
      // ISO 639-1 and 3166-2 mappings
      this.isocodes = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/isocodes.json')).toString('utf-8'));

      /**
       * Helper method to create a cache key
       * @param {*} method 
       * @param {*} params 
       */
      this.getCacheKey = function (method, params) {
        var options = {
          method: method
        }
        for (var attr in params) options[attr] = params[attr];
        var cacheKey = MD5.md5(JSON.stringify(options));
        return cacheKey;
      }//getCacheKey

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
        // ISO 3166-2 country code
        countryCode: ''
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        const data = self.memCache.get(self.getCacheKey('getPlaces', options));
        if (Util.empty(data)) { // miss
          // Get local trends and update json to file
          self.twitterClient.trends.trendsAvailable()
            .then(data => {
              this.places = data; // update places
              self.memCache.add('TT.getPlaces', data, options.expire)
              if (options.countryCode != '') {
                data = data.filter(item => !Util.empty(item.countryCode))
                  .filter(item => item.countryCode == options.countryCode);
              }
              return resolve(data);
            })
            .catch(error => {
              return reject(error);
            })
        } else { // hit
          return resolve(data);
        }
      });
    }//getPlaces

    /**
     * Get the top 50 trending topics for a specific location
     * @param {*} params { id: int, exclude: bool }
     * @returns {Object} The response contains an array of trend objects that encode the name of the trending topic
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
        const data = self.memCache.get(self.getCacheKey('getTopics', options));
        if (Util.empty(data)) { // miss
          // Get local trends and update json to file
          self.twitterClient.trends.trendsPlace({
            id: params.id,
            exclude: options.exclude
          })
            .then(data => {
              if (!Util.empty(data) && data.length && !Util.empty(data[0].trends)) {
                data = data[0];
                data.trends = data.trends.slice(0, options.limit);
              }
              return resolve(data);
            })
            .catch(error => {
              return reject(error);
            })
        } else { // hit
          return resolve(data);
        }
      });
    }//getTopics

    /**
     * Get the Top  Trending Topics by country code ISO 3166-2 and place type
     * @param {*} params { countryCode: string, placeType: string }
     * @returns {Object} The response contains an array of trend objects that encode the name of the trending topic
     */
    TwitterTrends.prototype.getTopicsByCountry = function (params) {
      var self = this;
      var options = {
        // ISO 3166-2 country code
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
        const data = self.memCache.get(self.getCacheKey('getTopicsByCountry', options));
        if (Util.empty(data)) { // miss
          self.getPlaces({ countryCode: options.countryCode })
            .then(data => {
              return Util.promiseAllP(data, (item, index, resolve, reject) => {
                self.getTopics({
                  id: item.woeid,
                  limit: options.limit,
                  exclude: options.exclude
                })
                  .then(data => {
                    data.place = item;
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
        } else { // hit
          return resolve(data);
        }
      });
    }//getTopicsByCountry

    /**
     * Get the Top  Trending Topics by ISO 639-1 language code
     * @param {*} params { langCode: string, placeType: string }
     * @returns {Object} The response contains an array of trend objects that encode the name of the trending topic
     */
    TwitterTrends.prototype.getTopicsByLanguage = function (params) {
      var self = this;
      var options = {
        // ISO 639-1 language code
        languageCode: 'EN',
        // filter by place type: Town | Country
        placeType: TwitterTrends.PLACE_TYPE_TOWN,
        // Setting this equal to 'hashtags' will remove all hashtags from the trends list.		
        exclude: '',
        // max number of trending topics to return
        limit: 50
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        const data = self.memCache.get(self.getCacheKey('getTopicsByLanguage', options));
        if (Util.empty(data)) { // miss
          self.getPlaces({})
            .then(data => {
              data = data.filter(item => !Util.empty(item.countryCode))
                .filter(item => self.isocodes.CountryCode2LangCode[item.countryCode] == options.languageCode.toLowerCase());
              return Util.promiseAllP(data, (item, index, resolve, reject) => {
                self.getTopics({
                  id: item.woeid,
                  limit: options.limit,
                  exclude: options.exclude
                })
                  .then(data => {
                    data.place = item;
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
        } else { // hit
          return resolve(data);
        }
      });
    }//getTopicsByLanguage

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