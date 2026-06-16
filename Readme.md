# inventory-service (demo app)

A minimal Node/Express service whose **entire** CI/CD is one inherited line
(`.github/workflows/ci.yml`). Used to demo the secure-by-default platform.

## Planted seeds (for the live demo)

| Seed | Where | Trips |
|------|-------|-------|
| Hardcoded secret (AWS *example* key) | `src/config.js` | GitLeaks → hard fail |
| Known-CVE dependency (`lodash@4.17.4`, CVE-2019-10744) | `package.json` | OWASP Dep-Check / OSV |
| Code smell (`==`, dead nesting) | `src/index.js` `/inventory/:id` | SonarQube gate → AI self-healing PR |

> The AWS key is Amazon's published documentation example — pattern-valid but not a
> real credential. It exists so GitLeaks has something to catch on stage.

## Run locally
```bash
npm ci && npm test
npm start   # :3000  → GET /health
```
