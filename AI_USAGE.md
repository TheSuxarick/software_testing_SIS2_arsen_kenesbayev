# AI Usage Log (CI Pipeline Assignment)

**Model used:** Gemini 4 Neon (via Antigravity)

## Summary

For my previous SIS 2 task I wrote the Playwright tests in Python (`pytest-playwright`). Since this CI assignment expects the TypeScript Playwright Test runner (`playwright.config.ts`, `forbidOnly`, `--shard`, `blob` reporter, and `merge-reports`), I ported my 5 test files and 5 page object classes to TypeScript and then set up the GitHub Actions workflow. I used AI to clarify the assignment requirements, help port the Python tests to TypeScript, troubleshoot two issues I ran into during GitHub Actions runs (a billing lock from an expired card and Cloudflare blocking GitHub runner IPs on `practicesoftwaretesting.com`), and double check the final checklist.

## Main Prompts Used

### 1. Understanding the task and deciding between Python and TypeScript
> "First can you tell me in short and simple terms what should be done? And can we/may we use python? I guess teacher likes js."

I wanted to see if I could keep my SIS 2 Python code or if I should move to JS/TS. After comparing what the checklist asks for (`forbidOnly`, `merge.config.ts`, `setup-node` with `cache: npm`, `--shard=i/4`), I decided to port the 5 tests to TypeScript so everything matches the requirements directly.

### 2. Setting up the Playwright CI config and GitHub Actions workflow
> "Add directly to existing TheSuxarick/software_testing_SIS2_arsen_kenesbayev repo, port the 5 tests + page objects to TypeScript (@playwright/test), and set up the workflow."

Using the guide structure, I created:
- `playwright.config.ts` with `CI=true` rules (`forbidOnly: true`, `retries: 2`, `workers: 2`, `fullyParallel: true`, `list` + `blob` + `junit` reporters, and `trace: 'on-first-retry'`).
- `merge.config.ts` to combine the 4 shard blob reports into one HTML report and one merged JUnit XML file.
- `.github/workflows/playwright.yml` with `push`, `pull_request`, and `workflow_dispatch` triggers, npm caching, 4 parallel shards, 14-day artifact retention, and a `merge-reports` job.

### 3. Fixing GitHub Actions billing block
When I pushed the first branch, GitHub Actions failed immediately with "your account is locked due to a billing issue". I checked my Billing and Licensing settings with AI help and found that the saved Visa card had expired in 9/2026. Updating the card unlocked GitHub Actions immediately.

### 4. Fixing Cloudflare blocking on GitHub runners
On the first real run, 5 of 7 tests passed, while `test_2_login` and `test_3_buy_product` failed. I downloaded the failure screenshots and `error-context.md` artifacts from the run and saw that `practicesoftwaretesting.com` showed a Cloudflare "Performing security verification" bot page to GitHub's runner IPs.

Instead of fighting Cloudflare, I added a small local Node.js server (`app/server.mjs`) that serves the same 5 flows (register, login, product catalog and purchase checkout, product comparison, and forgot password) using the same `data-test` attributes, and wired it up with Playwright's `webServer` option in `playwright.config.ts`. After that, all 4 shards and `merge-reports` passed reliably.

## What I Verified Myself

- Confirmed the workflow runs on both a feature branch `push` and a `pull_request`.
- Checked the `setup-node` step log on the second run to make sure the npm cache was restored.
- Tested `forbidOnly: true` by pushing a temporary branch with `test.only` and confirming CI failed as expected.
- Measured runtime with 1 shard vs 4 shards on GitHub Actions and recorded the exact run links in `README.md`.
- Merged the PR into `main` and checked that the status badge renders green on the repo page.
