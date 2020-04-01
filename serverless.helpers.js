module.exports = async () => {
  return {
    currentTimestamp: Date.now(),
    coudFrontDistributionID: process.env.DISTRIBUTION_ID,
  };
};
