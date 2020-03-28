const AWS = require('aws-sdk');

const cloudFront = new AWS.CloudFront();

(async () => {
  try {
    const params = {
      DistributionId: process.env.DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: Date.now(),
        Paths: {
          Quantity: 1,
          Items: [
            '/*',
          ],
        },
      },
    };

    console.log('Invalidating CloudFront cache');
    const invalidation = await cloudFront.createInvalidation(params).promise();

    console.log('Waiting for invalidation...');
    await cloudFront.waitFor('invalidationCompleted', invalidation).promise();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
