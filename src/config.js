// SEED: planted hardcoded secret for the GitLeaks demo beat.
// This is AWS's PUBLISHED example key — pattern-valid, NOT a real credential.
// GitLeaks hard-fails on it; the talk shows the gate blocking the merge.
module.exports = {
  port: process.env.PORT || 3000,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
