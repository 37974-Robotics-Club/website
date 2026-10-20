# 37974 Robotics website

The website for FIRST Tech Challenge team 37974, built with [Hugo](https://gohugo.io/) and a custom theme, `ver37974`, in the team's navy, gold and white.

- **No build tools beyond Hugo.** The theme is plain CSS and a small script. Students can change anything with a text editor.
- **A web editor at `/admin/`** lets coaches, parents and students post announcements, blog posts, photos and journal entries from a browser, without touching code.
- **Deploys itself.** Every change pushed to GitHub (including saves from the web editor) rebuilds the site.

Everything in `content/` is sample content. Replace it before the site goes public (see the checklist at the end).

## What's on the site

| Page | Where the content lives | Notes |
| --- | --- | --- |
| Home | `content/_index.md` | Pulls in the next event, latest announcement, current robot version, blog posts and sponsors automatically |
| About us | `content/about/_index.md` | Who we are, values, team structure and roles, contact details and form |
| Members | `content/members/*.md` | One file per person. First names only. Photos only with media consent |
| Robot | `content/robot/<season>.md` | One file per season, with a version history of the robot |
| Engineering portfolio | `content/portfolio/*.md` | Journal entries, filterable by subsystem, plus a link to the portfolio PDF |
| Outreach | `content/outreach/*.md` | Hours and people reached are totalled automatically |
| Events | `content/events/*.md` | Splits into "Coming up" and "Past events" by date |
| Gallery | `content/gallery/<album>/index.md` | Each album is a folder holding its photos. YouTube videos load only when someone presses play |
| Our sponsors | `content/sponsors/*.md` | Grouped by tier, with logos and a thank-you message |
| Become a sponsor | `content/sponsor-us/_index.md` and `data/sponsorship.yaml` | Why sponsor, budget, tiers, how to sponsor, and a contact form |
| Announcements | `content/announcements/*.md` | Short notices; pinned ones show first |
| Blog | `content/blog/*.md` | Longer updates for families and sponsors |

## Running it on your computer

1. Install Hugo **extended**, version 0.146 or newer ([install guide](https://gohugo.io/installation/)).
2. In this folder, run:

   ```sh
   hugo server
   ```

3. Open http://localhost:1313. Pages reload as you save files.

To add a page from the command line, use the templates in `archetypes/`, for example `hugo new content portfolio/arm-redesign.md`.

## Putting it online (GitHub Pages)

1. Create a repository on GitHub and push this folder to the `main` branch.
2. In the repository, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push, and once a day so past events move to the right list.
4. Change `baseURL` in `hugo.toml` to the site's address. For a custom domain (for example `37974robotics.ca`), add it under **Settings > Pages > Custom domain** and follow GitHub's DNS instructions.

GitHub Pages on a free account needs a **public** repository. If you'd rather keep the repository private (for example, to keep unpublished photos out of view), Netlify and Cloudflare Pages both deploy private repositories on their free plans; build command `hugo --gc --minify`, output folder `public`.

## Turning on the web editor

The editor is [Sveltia CMS](https://github.com/sveltia/sveltia-cms). It saves each change as a commit to GitHub, which triggers a rebuild.

1. In `static/admin/config.yml`, change `repo:` to your `account/repository`, and set `site_url` to the site's address.
2. Deploy, then go to `https://your-site/admin/`.
3. Sign in. There are two ways:
   - **Personal access token (simplest).** Each editor creates a fine-grained GitHub token with read and write access to this repository's contents, then chooses "Sign in with token".
   - **"Sign in with GitHub" button.** Deploy the free [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) worker on Cloudflare, then uncomment `base_url` in `config.yml` and put the worker's address there.
4. Editors need to be collaborators on the GitHub repository.

## Contact forms

A static site can't receive form submissions by itself. Sign up for a form service such as [Formspree](https://formspree.io/), create a form, and paste its endpoint into `formAction` in `hugo.toml`. Until you do, the contact and sponsorship forms show an email link instead.

## Changing the look

- **Colours, fonts and spacing** are set as variables at the top of `themes/ver37974/assets/css/main.css`. Navy `#002147`, gold `#b1892a` and wheat `#d8c495` are sampled from the logo.
- **Small tweaks** can go in a new file, `assets/css/custom.css`, at the site level. It loads after the theme, so you never have to edit the theme itself.
- **Fonts** are Big Shoulders Display (headings) and Atkinson Hyperlegible Next (body), both self-hosted in `themes/ver37974/static/fonts` under the SIL Open Font License. No requests go to Google.
- **Logo** files are in `themes/ver37974/static/images`: a transparent `logo.png`, favicons and a social sharing image.
- **Navigation** is in the `[menus]` section of `hugo.toml`.

## Privacy and safety checklist (most members are minors)

- [ ] Members show **first names only**. Adults may use full names.
- [ ] Only set `photo_consent: true` when a parent has signed a media release. Without it, the site shows a triangle with the member's initial instead.
- [ ] Gallery photos: only upload photos where every identifiable student has media consent. Uploaded photos are stored in the GitHub repository, so in a public repository they're visible there even before they appear on the site.
- [ ] Never publish a host family's address. Event addresses are for public venues only. The About page says registered families get meeting details privately.
- [ ] Contact emails should go to adult coaches or directors, not to students.
- [ ] Keep `registeredCharity = false` in `hugo.toml` unless the Club becomes a CRA-registered charity. It controls the tax-receipt wording on the sponsorship page.

## Before going live: replace the sample content

- [ ] `hugo.toml`: `baseURL`, team name, emails, social links, `formAction`
- [ ] `static/admin/config.yml`: `repo`, `site_url`
- [ ] Members, sponsors, events, blog posts, announcements, outreach and journal entries (all marked "sample")
- [ ] `data/sponsorship.yaml`: real budget figures and tier benefits
- [ ] Gallery: replace the placeholder album and images in `assets/images/uploads/`
- [ ] Robot page: real specs and version history

*FIRST*® and *FIRST*® Tech Challenge are registered trademarks of *FIRST*. Follow FIRST's brand guidelines if you add FIRST logos to the site.
