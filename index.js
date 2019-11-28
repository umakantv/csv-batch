'use strict';

const parse = require('./src/parse');

const defaultOptions = {
  header: true,
  columns: [],
  delimiter: ',',
  quote: '"',
  detail: false,
  nullOnEmpty: false,
  transform: null,
  batch: false,
  batchSize: 10000,
  batchExecution: batch => batch
};

/**
 * CSV parse and then batch
 * @param {Object} readStream - a readable stream
 * @param {Object} overrides - overrides default options
 * @return {Promise} - a promise the resolves when all the batches finish or rejects if there was an error
 */
function csvBatch(readStream, overrides) {
  const options = Object.assign({}, defaultOptions, overrides);
  return new Promise((resolve, reject) => {
    const parser = parse(options);
    let results = null;
    parser.on('finish', () => {
      resolve(results);
    });
    parser.on('results', result => {
      results = result;
    });
    parser.on('error', reject);
    readStream.pipe(parser);
  });
}
module.exports = csvBatch;
