/**
 * Copyright 2020, Chaitanya Prakash N <chaitanyaprakash.n@gmail.com>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'user strict';
const cheerio = require('cheerio');
const express = require('express');
const https = require('https');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./swagger.yaml');

/**
 * Send response
 * @param {object} res server response
 * @param {code} code error code
 * @param {object} data data to be sent in the response
 */
function sendResponse(res, code, data) {
  console.log(`Sending response: ${code}`);
  res.writeHead(code, {'content-type': 'application/json'});
  res.end(JSON.stringify(data));
}

/**
 * Download COVID-19 India Cases Data from the
 * Ministry of Health and Family Welfare (mohfw.gov.in)
 * @param {object} response server response object
 */
function currentCovid19Data(response) {
  const DOWNLOAD_URL = 'www.mohfw.gov.in';
  const httpsOptions = {
    hostname: DOWNLOAD_URL,
    port: 443,
    path: '/',
    method: 'GET',
  };

  https.request(httpsOptions, (res) => {
    let data = '';
    console.log(`Response Status Code: ${res.statusCode}`);
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => parseAndSendResponse(response, data, sendResponse));
  })
      .on('error', (error) => {
        console.error(`Error occurred while fetching data: ${error}`);
        sendResponse(response, 500, {error: error});
      })
      .end();
}

/**
 * Parse COVID-19 India Cases Data from the
 * Ministry of Health and Family Welfare (mohfw.gov.in) website
 * and send the response back to the client
 * @param {object} res server response object
 * @param {string} data html page data (mohfw.gov.in)
 * @param {callback} callback callback function
 */
function parseAndSendResponse(res, data, callback) {
  console.log('Parsing data...');
  const $ = cheerio.load(data);

  const updatedAtStr = $('div .status-update > h2 > span').text();
  const updatedAt = new Date(
      Date.parse(updatedAtStr.substring(updatedAtStr.indexOf(': ')+1).trim()));
  const numActive = parseInt(
      $('div .site-stats-count ul').find('.bg-blue strong').text().trim());
  const numCured = parseInt(
      $('div .site-stats-count ul').find('.bg-green strong').text().trim());
  const numDeaths = parseInt(
      $('div .site-stats-count ul').find('.bg-red strong').text().trim());
  const numMigrated = parseInt(
      $('div .site-stats-count ul').find('.bg-orange strong').text().trim());

  const statesData = [];
  $('div .data-table table tbody').find('tr').each(
      (i, row) => {
        const cols = [];
        $(row).find('td').each(
            (j, col) => {
              cols.push($(col).text().trim());
            },
        );
        if (cols[0].match(/^\d+$/)) {
          statesData.push({
            name: cols[1].replace(/[^\w\s]/gi, ''),
            cases: {
              active: parseInt(cols[2]),
              cured: parseInt(cols[3]),
              deaths: parseInt(cols[4]),
              migrated: 0,
              total: parseInt(cols[2]) +
                                parseInt(cols[3]) +
                                parseInt(cols[4]),
            },
          });
        }
      },
  );

  const response = {
    updatedAt: updatedAt,
    cases: {
      active: numActive,
      cured: numCured,
      deaths: numDeaths,
      migrated: numMigrated,
      total: numActive + numCured + numDeaths + numMigrated,
    },
    states: statesData,
  };

  console.log(`Parsed data successfully: ${JSON.stringify(response)}`);
  callback(res, 200, response);
}

const app = express();
const SERVER_PORT = 8080;
const CURRENT_DATA_URL = '/v1/data/current';

/**
 * Fetch current data from MoHFW
 */
app.get(CURRENT_DATA_URL, (req, res) => currentCovid19Data(res));

/**
 * Swagger UI
 */
app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

/**
 * Catch all routes
 */
app.all('*',
    (req, res) => {
      if (req.method != 'GET') {
        sendResponse(res, 405, {error: 'Unsupported HTTP method'});
      } else {
        sendResponse(res, 404, {error: 'Requested URL does not exist'});
      }
    });

/**
 * Start the server
 */
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`));
