#!/usr/bin/env bash
# Pre-bake the three demo branches so the talk can jump to known pipeline states
# without waiting on live builds. Run from the inventory-service repo root.
#
#   step-1-fail   : seeds present  → pipeline RED  (secret + CVE + smell)
#   step-2-ai-fix : self-healing PR applied → code smell fixed
#   step-3-green  : fully remediated → pipeline GREEN
#
# You run this (it pushes). Uses --force-with-lease so it's re-runnable.
set -euo pipefail

git fetch origin
git checkout main
git pull --ff-only

# ── step-1-fail : main as-is (all seeds intact) ─────────────────────────────
git checkout -B step-1-fail main
git push -u origin step-1-fail --force-with-lease

# ── step-2-ai-fix : the AI self-healing fix (code smell remediated) ─────────
git checkout -B step-2-ai-fix main
cat > src/index.js <<'EOF'
const express = require("express");
const config = require("./config");

const app = express();

const inventory = [
  { id: 1, name: "widget", qty: 42 },
  { id: 2, name: "gadget", qty: 7 },
];

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/inventory", (_req, res) => res.json(inventory));

// Remediated by the self-healing agent: strict equality + .find(), no dead nesting.
app.get("/inventory/:id", (req, res) => {
  const item = inventory.find((i) => i.id === Number(req.params.id));
  return item ? res.json(item) : res.status(404).json({ error: "not found" });
});

if (require.main === module) {
  app.listen(config.port, () => console.log(`up on :${config.port}`));
}

module.exports = app;
EOF
git commit -am "fix(sonar): auto-remediate code smell in /inventory/:id [ai]"
git push -u origin step-2-ai-fix --force-with-lease

# ── step-3-green : remove secret + bump vulnerable dep → all gates pass ──────
git checkout -B step-3-green step-2-ai-fix
cat > src/config.js <<'EOF'
// Secret removed — read from the environment (injected via org secrets / k8s).
module.exports = {
  port: process.env.PORT || 3000,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
EOF
# lodash 4.17.4 (CVE-2019-10744) -> 4.17.21
sed -i.bak 's/"lodash": "4.17.4"/"lodash": "^4.17.21"/' package.json && rm -f package.json.bak
git commit -am "fix(security): remove hardcoded secret + bump lodash to 4.17.21"
git push -u origin step-3-green --force-with-lease

git checkout main
echo
echo "Branches ready: step-1-fail (red) · step-2-ai-fix (smell fixed) · step-3-green (all pass)"
