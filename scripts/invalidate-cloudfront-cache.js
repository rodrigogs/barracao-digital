#!/usr/bin/env node

const AWS = require('aws-sdk');

// const credentials = new AWS.SharedIniFileCredentials({ profile: 'covid-19' });
// if (credentials) AWS.config.credentials = credentials;

const cloudfront = new AWS.CloudFront();

const listDistributions = async () => {
  let distributions = [];

  let data;
  let marker;
  do {
    data = await cloudfront.listDistributions({ Marker: marker }).promise();
    distributions = distributions.concat(data.DistributionList.Items);
    marker = data.DistributionList.NextMarker;
  } while (data.DistributionList.IsTruncated);

  return distributions;
}

const createInvalidation = async (distributionId) => {
  const reference = new Date().getTime().toString();
  const params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: reference,
      Paths: {
        Quantity: 1,
        Items: [
          '/',
        ],
      },
    },
  };
  return cloudfront.createInvalidation(params).promise();
};

(async () => {
  const cnames = process.argv.slice(2);

  try {
    const all = await listDistributions();
    const distributions = all.reduce((dists, dist) => {
      for (const alias of dist.Aliases.Items) {
        if (cnames.includes(alias)) dists.push(dist);
      }
      return dists;
    }, []);
  
    if (!distributions.length) throw new Error('No distributions found for the given cnames');

    await Promise.all(distributions.map(async (distribution) => {
      const invalidation = await createInvalidation(distribution.Id);
      console.log(`Created invalidation for distribution ${distribution.Id}`);
      var params = {
        DistributionId: distribution.Id,
        Id: invalidation.Id,
      };
      console.log(`Waiting for distribution ${distribution.Id} invalidation...`);
      await cloudfront.waitFor('invalidationCompleted', params).promise();
    }));
  } catch (err) {
    console.error(err);
  }
})();
