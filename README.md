# Software Testing — Playwright E2E Suite & CI Pipeline

Automated End-to-End (E2E) test suite for [Practice Software Testing](https://practicesoftwaretesting.com/) using **Playwright Test (TypeScript)** with the Page Object Model (POM) architecture, integrated with a **GitHub Actions CI pipeline**.

*(The original SIS 2 Python `pytest-playwright` implementation is preserved alongside the TypeScript Playwright Test suite.)*

## CI

[![Playwright Tests](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/TheSuxarick/software_testing_SIS2_arsen_kenesbayev/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built directly into GitHub where the repository already lives, requires no separate server setup, is free for public repositories, and natively supports matrix strategies for Playwright sharding and artifact retention.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every `push`, `pull_request`, and manual `workflow_dispatch`;
- caches npm via `actions/setup-node@v4` (`cache: npm`), installs dependencies with `npm ci`, and installs Chromium with system dependencies (`npx playwright install --with-deps chromium`);
- runs the full Playwright test suite (7 tests across 5 spec files, no `--grep` or `--project` filters) split into **4 parallel shards** (`--shard=i/4`);
- runs a `merge-reports` job after all shards complete (`if: ${{ !cancelled() }}`) to merge blob reports into a single HTML report and merged JUnit XML;
- uploads artifacts kept for **14 days**: `playwright-report` (merged HTML), `test-results-1..4` (traces, screenshots, videos, per-shard JUnit), and `junit-report` (merged JUnit XML).

**CI settings** (`playwright.config.ts`, when `CI=true`):
- `forbidOnly: true` — fails CI immediately if a `test.only` is left in the code;
- `retries: 2` — retries failed tests up to 2 times and marks intermittent ones as flaky;
- `fullyParallel: true` — distributes individual tests evenly across shards;
- `workers: 2` — tuned for GitHub-hosted runner vCPUs;
- `reporters`: `list`, `blob` (for shard merging), and `junit` (`reports/junit.xml`);
- `use`: `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `baseURL` from `BASE_URL` env var (`https://practicesoftwaretesting.com` default).

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | _measuring..._ | _measuring..._ | _pending_ |
| 4 shards + merge | _measuring..._ | _measuring..._ | _pending_ |

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

For AI usage details, model, and prompts, see [`AI_USAGE.md`](./AI_USAGE.md).
