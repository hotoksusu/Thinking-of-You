# Hospital navigation tests

Install dependencies with `pnpm install`, then install the browser with
`pnpm exec playwright install chromium`.

Start the app in one terminal:

```sh
pnpm dev --port 3100
```

Run the browser regression tests in another:

```sh
pnpm test:navigation
```

`TEST_BASE_URL` overrides `http://localhost:3100`. Set
`TEST_BROWSER_CHANNEL=msedge` to use an installed Microsoft Edge browser instead
of Playwright Chromium.

Tests use isolated browser contexts and local storage fixtures. They cover both
the public demo and authenticated hospital dashboard: all six priority/quick
CTAs, exact patient membership (including today vs yesterday/future discharge),
keyboard activation, URL/filter labels, reload and browser history, detail/list
round trips, action persistence, and disabled cards/empty lists.
