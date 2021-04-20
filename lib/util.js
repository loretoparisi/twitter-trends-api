/**
 * Twitter Trends API Example
 * @copyright 2021 Loreto Parisi
 * @author Loreto Parisi (loretoparisi at gmail dot com)
 */

var Util = {

  /**
  * Get random element in array
  * @param shuffle true to shuffle array
  */
  randomElement: function (arr, shuffle) {
    if (shuffle) arr = this.shuffle(arr);
    return arr[Math.floor(Math.random() * arr.length)];
  },//randomElement

  /*
  //  discuss at: http://locutusjs.io/php/empty/
  // original by: Philippe Baumann
  //    input by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: LH
  //    input by: Stoyan Kyosev (http://www.svest.org/)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Francesco
  // improved by: Marc Jansen
  // improved by: Rafał Kukawski (http://blog.kukawski.pl)
  //   example 1: empty(null)
  //   returns 1: true
  //   example 2: empty(undefined)
  //   returns 2: true
  //   example 3: empty([])
  //   returns 3: true
  //   example 4: empty({})
  //   returns 4: true
  //   example 5: empty({'aFunc' : function () { alert('humpty'); } })
  //   returns 5: false
*/
  empty: function (mixedVar) {
    var undef
    var key
    var i
    var len
    //var emptyValues = [undef, null, false, 0, '', '0']
    var emptyValues = [undef, null, ''];

    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixedVar === emptyValues[i]) {
        return true
      }
    }

    if (typeof mixedVar === 'object') {
      for (key in mixedVar) {
        if (mixedVar.hasOwnProperty(key)) {
          return false
        }
      }
      return true
    }

    return false
  },//empty

  /**
     * Array flatten
     * @see http://stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
     */
  arrayFlatten: function (a) {
    var store = [];
    return function () {
      var internMapper = function (b) {
        if (Array.isArray(b)) {
          return b.map(internMapper);
        }
        store.push(b);
        return b;
      }
      a.map(internMapper);
      return store;
    }()
  },

  /**
     * Group objects by objects properties
     * @param {Array} array 
     * @param {Function} f 
     */
  arrayGroupBy: function (array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  },//arrayGroupBy

  /**
   * Group objects by objects properties
   * @param {Array} arr 
   * @param {Array} properties 
   */
  arrayGroupByProperties: function (arr, properties) {
    var groups = [];
    for (var i = 0, len = arr.length; i < len; i += 1) {
      var obj = arr[i];
      if (groups.length == 0) {
        groups.push([obj]);
      } else {
        var equalGroup = false;
        for (var a = 0, glen = groups.length; a < glen; a += 1) {
          var group = groups[a];
          var equal = true;
          var firstElement = group[0];
          properties.forEach(function (property) {
            if (firstElement[property].toLowerCase() !== obj[property].toLowerCase()) {
              equal = false;
            }
          });
          if (equal) {
            equalGroup = group;
          }
        }
        if (equalGroup) {
          equalGroup.push(obj);
        } else {
          groups.push([obj]);
        }
      }
    }
    return groups;
  },//arrayGroupByProperties

  /**
 * Promise All
 * @param block Function (item:object,index:int,resolve:Promise.resolve,reject:Promise.reject)
 * @param timeout float Race timeout in milliseconds
 * @return Promise
 */
  promiseAllP: function (items, block) {
    var promises = [];
    items.forEach(function (item, index) {
      promises.push(function (item, i) {
        return new Promise(function (resolve, reject) {
          return block.apply(this, [item, index, resolve, reject]);
        });
      }(item, index))
    });
    return Promise.all(promises);
  } //promiseAllP
}

module.exports = Util;