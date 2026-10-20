# 12. Publishing with GitHub Actions

**You'll learn:** how the site gets built and published automatically, how to read the workflow file line by line, what to do when a build fails, and how the pull request check protects the live site.

## What GitHub Actions is

**GitHub Actions** runs instructions on GitHub's computers whenever something happens in the repository, like a new commit. The instructions are in **workflow** files in `.github/workflows/`. We have two:

| Workflow | Runs when | Does |
| --- | --- | --- |
| `deploy.yml` | A commit reaches `main`, every day at 9:17 UTC, or someone presses "Run workflow" | Builds the site and publishes it to GitHub Pages |
| `check.yml` | A pull request is opened or updated | Builds the site to check it works. Publishes nothing |

Think of a workflow as a recipe a robot follows, in a fresh, empty computer, every time.

## `deploy.yml`, line by line

### When to run

<!-- source: .github/workflows/deploy.yml -->
```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: "17 9 * * *"   # 9:17 UTC daily (early morning in Edmonton)
  workflow_dispatch:
```

- `push` to `main`: every commit, including saves from the site editor.
- `schedule`: once a day. `"17 9 * * *"` is a **cron** expression: minute 17, hour 9, every day of every month, every day of the week. Times are in UTC, so that's 3:17 am in Edmonton in summer and 2:17 am in winter. Why daily? Because `now` in a template means *when the site was built* ([chapter 6](06-templates.md#why-now-means-the-daily-rebuild)), so a daily build is what moves finished events into "Past events".
- `workflow_dispatch`: adds a **Run workflow** button in the Actions tab, for rebuilding by hand.

### Permissions

<!-- source: .github/workflows/deploy.yml -->
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

The workflow gets only the permissions it needs: read the repository, write to Pages, and prove its identity to Pages. Giving automated tools as little power as possible is a good security habit.

### One at a time

<!-- source: .github/workflows/deploy.yml -->
```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

If two commits arrive close together, the second deploy waits for the first instead of both publishing at once.

### The build job

<!-- source: .github/workflows/deploy.yml -->
```yaml
    env:
      HUGO_VERSION: 0.152.2
      TZ: America/Edmonton
```

- `HUGO_VERSION` pins the exact Hugo version. Hugo changes over time, and a site that builds with one version might not with another. Pinning means the build behaves the same every time. To upgrade, change this number, test with the same version on your computer, and open a pull request.
- `TZ` sets the time zone, so "today" means today in Edmonton, not in UTC, the time zone GitHub's computers use.

Then the steps run in order:

| Step | What it does |
| --- | --- |
| **Install Hugo** | Downloads that exact Hugo version and installs it. The computer starts empty every time |
| **Check out** | Copies our repository onto the computer |
| **Set up Pages** | Asks GitHub Pages for the site's address |
| **Build** | Runs `hugo --gc --minify --baseURL "..."` |
| **Upload** | Packs up `public/` for publishing |

The build command's options:

- `--gc` ("garbage collect") deletes unused cached files
- `--minify` shrinks the HTML, as well as the CSS and JavaScript
- `--baseURL` sets the site's address to whatever Pages says, overriding `baseURL` in `hugo.toml`

### The deploy job

<!-- source: .github/workflows/deploy.yml -->
```yaml
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
```

`needs: build` means "only start once the build has succeeded". If the build fails, nothing is published, so **a broken build never breaks the live site**. Visitors keep seeing the last good version.

## Watching a deploy

1. Go to the repository on GitHub and click the **Actions** tab.
2. Each run is listed with the commit message that started it. A yellow dot means running, a green ✓ means done, a red ✗ means failed.
3. Click a run, then the **build** job, then a step, to see everything it printed.

## When a build fails

1. Open the failed run, click **build**, and open the step with the red ✗ (usually **Build**).
2. Scroll to the bottom. Hugo's error starts with `Error:` and names a file and line number, the same as on your computer.
3. Fix it on your computer: `git pull`, run `hugo server` to see the same error, fix, commit, push. Or fix a content typo in the site editor.
4. The new commit starts a new deploy automatically.

[Troubleshooting](14-troubleshooting.md) lists the common errors.

## The pull request check

`check.yml` builds the site for every pull request, using the same Hugo version, plus one extra option:

<!-- source: .github/workflows/check.yml -->
```yaml
        run: hugo --gc --minify --panicOnWarning
```

`--panicOnWarning` treats warnings as failures, so even small problems block the merge. The result shows on the pull request as a green ✓ or red ✗ next to the commit.

**Make it required:** in **Settings > Branches**, add a rule for `main` that requires the **Check build** status to pass before merging. Then nobody can merge a pull request that breaks the build, even by accident.

## The site's address and `baseURL`

On GitHub Pages, a site's address is either:

- **A sub-folder**, like `https://our-team.github.io/website/`, if you haven't set a custom domain
- **A custom domain**, like `https://37974robotics.ca/`

The sub-folder case is tricky. A link written as `/about/` would point to `https://our-team.github.io/about/`, outside our site. That's why our templates never write links directly. They use `relURL`, or our `link.html` partial, which adds the sub-folder:

<!-- source: themes/ver37974/layouts/_partials/link.html -->
```go-html-template
{{- if not (or (strings.HasPrefix $u "http") (strings.HasPrefix $u "mailto:") (strings.HasPrefix $u "#")) -}}
  {{- $out = relURL (strings.TrimPrefix "/" $u) -}}
{{- end -}}
```

"Unless it's an outside link, an email link or a link to a spot on the same page, remove the leading `/` and let `relURL` add the site's sub-folder." (`relURL` leaves paths that start with `/` alone, so the slash has to come off first.) The `render-link.html` hook does the same for links inside Markdown.

**When you write a template, never type `href="/something/"` directly.** Use `{{ partial "link.html" "/something/" }}`, or `{{ "something/" | relURL }}`.

### Setting up a custom domain

1. Buy the domain from a registrar.
2. In the repository, **Settings > Pages > Custom domain**, enter it and save. GitHub shows the DNS records to add.
3. Add those records at the registrar. It can take a few hours to start working.
4. Tick **Enforce HTTPS** once it's available.
5. Change `baseURL` in `hugo.toml` and `site_url` in `static/admin/config.yml` to the new address.

## Try it

1. Open the Actions tab and find the run for the most recent commit. How long did the build step take?
2. Press **Run workflow** on the Deploy site workflow. Did anything on the site change? Why or why not?
3. On a branch, introduce a deliberate mistake (delete a `{{ end }}` in a template), push it and open a pull request. Watch the check fail and read its error. Then close the pull request without merging and delete the branch.

## Check your understanding

1. You commit a template with a mistake directly to `main`. What do visitors see?
2. Why does the deploy workflow run every day even when nobody commits?
3. What does `needs: build` do?
4. Why must templates use `relURL` or `link.html` for internal links?

<details>
<summary>Answers</summary>

1. The previous version of the site. The build fails, so the deploy job never runs. But the site won't update until someone fixes the mistake, so fix it quickly.
2. Some content depends on the date the site is built, like which events are upcoming. A daily build keeps that up to date.
3. It makes the deploy job wait for the build job, and skip if the build failed.
4. So links still work if the site is published in a sub-folder (like `our-team.github.io/website/`). A link starting with `/` would point outside the site.

</details>

Next: [13. Recipes: guided projects](13-recipes.md)
