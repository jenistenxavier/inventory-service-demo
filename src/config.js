// SEED: planted hardcoded secret for the GitLeaks demo beat.
// This is AWS's PUBLISHED example key — pattern-valid, NOT a real credential.
// GitLeaks hard-fails on it; the talk shows the gate blocking the merge.
module.exports = {
  port: process.env.PORT || 3000,
  awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE",
  awsSecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
};
