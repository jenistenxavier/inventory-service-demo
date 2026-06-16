const express = require("express");
const config = require("./config");

const app = express();
app.disable("x-powered-by");

const inventory = [
  { id: 1, name: "widget", qty: 42 },
  { id: 2, name: "gadget", qty: 7 },
];

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/inventory", (_req, res) => res.json(inventory));

app.get("/error", (_req, res) => res.status(500).json({ error: "internal error" }));

// SEED: deliberate code smell for the SonarQube self-healing demo.
// Duplicated/needlessly-nested logic Sonar flags; the AI agent proposes the fix.
app.get("/inventory/:id", (req, res) => {
  let found = null;
  for (const item of inventory) {
    if (item.id == req.params.id) {   // smell: == not ===
      found = item;
    }
  }
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

if (require.main === module) {
  app.listen(config.port, () => console.log(`up on :${config.port}`));
}

module.exports = app;
