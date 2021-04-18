/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */

"use strict";

(function () {

  const TwitterTrends = (function () {

    function TwitterTrends(params) {
      var options = {
      }
      for (var attr in params) options[attr] = params[attr];
    }//TwitterTrends
    return TwitterTrends;

  })();

  module.exports = TwitterTrends;

}).call(this);