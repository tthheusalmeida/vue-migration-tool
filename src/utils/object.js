'use strict';

function stringifyCircularStructureToJson(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

function removeEmptyObjects(obj) {
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        removeEmptyObjects(obj[key]);
      }

      if (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
}

module.exports = {
  stringifyCircularStructureToJson,
  removeEmptyObjects,
}