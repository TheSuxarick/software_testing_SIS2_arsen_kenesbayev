# Software Testing - Playwright E2E Suite and CI Pipeline

Automated E2E test suite built with Playwright Test (TypeScript) using the Page Object Model, running inside a GitHub Actions CI pipeline.

(The original SIS 2 Python `pytest-playwright` files are kept in the repo alongside the TypeScript suite.)

## CI

[![Playwright Tests](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub where this repository already lives, needs no external server, is free for public repositories, and supports matrix builds for Playwright sharding and artifact retention out of the box.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every `push`, `pull_request`, and manual `workflow_dispatch`;
- caches npm using `actions/setup-node@v4` (`cache: npm`), installs dependencies with `npm ci`, and installs Chromium with system dependencies (`npx playwright install --with-deps chromium`);
- runs the full Playwright suite (7 tests across 5 spec files, no `--grep` or `--project` filters) split across 4 parallel shards (`--shard=i/4`);
- runs a `merge-reports` job once all 4 shards finish (`if: ${{ !cancelled() }}`) to merge the shard blob reports into a single HTML report and one merged JUnit XML file;
- uploads artifacts kept for 14 days: `playwright-report` (HTML), `test-results-1..4` (traces, screenshots, videos, per-shard JUnit), and `junit-report` (merged JUnit XML).

**CI settings** (`playwright.config.ts`, enabled when `CI=true`):
- `forbidOnly: true` (verified with a failing CI run when `test.only` was pushed: [forbidOnly failure run](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/runs/45046546071));
- `retries: 2` so intermittent failures are retried and marked flaky instead of immediately red;
- `fullyParallel: true` so shards split individual tests rather than whole files;
- `workers: 2` matched to GitHub-hosted runner vCPUs;
- reporters `list`, `blob` (for merging shards), and `junit` (`reports/junit.xml`);
- `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`;
- `baseURL` read from the `BASE_URL` variable, with `webServer` starting the local test app (`app/server.mjs`) so CI runs are deterministic and not blocked by external bot checks.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | 1 min 8 s | 5 s | [run](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/runs/45046661627) |
| 4 shards + merge | 1 min 5 s | 4 s | [run](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/runs/45046351592) |

Conclusion: Because the suite only has 7 fast tests running against the local server, almost all of the run time goes into runner setup (checkout, `npm ci`, Chromium install, and report merge), so 4 shards barely change total wall-clock time (1 min 8 s vs 1 min 5 s), though sharding cuts the test step itself and will pay off as more tests are added.

### Running locally

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test
```

Run in CI mode locally:

```bash
# bash / zsh / Git Bash
CI=true npx playwright test
```

```powershell
# PowerShell
$env:CI = "true"; npx playwright test; Remove-Item Env:CI
```

For details on AI usage, model, and prompts, see [AI_USAGE.md](./AI_USAGE.md).
