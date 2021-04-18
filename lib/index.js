/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */

"use strict";
const { TwitterClient } = require('twitter-api-client');
const fs = require('fs');

(function () {

  const TwitterTrends = (function () {

    function TwitterTrends(params) {
      var options = {
      }
      for (var attr in params) options[attr] = params[attr];

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
      this.twitterClient = new TwitterClient(twitterApiKeys);
    }//TwitterTrends

    /**
     * Get Local Trends Places
     * @param {*} params 
     * @returns 
     */
    TwitterTrends.prototype.getPlaces = function(params) {
      var self = this;
      var options = {
      }
      for (var attr in params) options[attr] = params[attr];
      return new Promise((resolve, reject) => {
        // Get local trends and update json to file
        self.twitterClient.trends.trendsAvailable()
          .then(data => {
            this.places = data; // update places
            return resolve(this.places);
          })
          .catch(error => {
            return reject(error);
          })
      });
    }//getPlaces

    return TwitterTrends;

  })();

  module.exports = TwitterTrends;

}).call(this);