# 4. Content: Markdown and front matter

**You'll learn:** how a content file is put together, how to write Markdown and YAML, how sections and page bundles work, and every field each part of the site uses.

## Anatomy of a content file

Open `content/blog/first-build.md`:

<!-- source: content/blog/first-build.md -->
```markdown
---
title: Our first month of building
date: 2026-10-05
author: Priya
summary: From a cardboard mock-up to a driving robot in three weeks. Here's what we learned.
cover: /images/uploads/blog-first-build.jpg
tags: [build, robot]
---

Sample post. Talk about what went well, what broke, and what you'd do differently. Link to the [engineering portfolio](/portfolio/) for the details.
```

It has two parts:

1. **Front matter**, between the two `---` lines. It's written in **YAML** and holds facts *about* the page: its title, date, author, and so on. Templates use these to build the page.
2. **The body**, after the second `---`. It's written in **Markdown** and is the main text of the page.

## Markdown

Markdown is plain text with a few symbols that mean formatting. Hugo turns it into HTML.

| You type | You get |
| --- | --- |
| `## Heading` | A heading (use `##` for sections and `###` for sub-sections; the page title is already the top heading) |
| `**bold**` and `*italic*` | **bold** and *italic* |
| `- item` | A bulleted list (our theme shows gold triangles) |
| `1. item` | A numbered list |
| `[link text](https://example.com)` | A link |
| `[our robot](/robot/)` | A link to another page on our site |
| `![A description of the photo](/images/uploads/photo.jpg)` | An image. The text in `[ ]` describes it for people who can't see it |
| `` `code` `` | `code` |
| `> quote` | A quote, with a gold bar |
| A line with three backticks, code, three backticks | A code block |

Tables use pipes and dashes, like the decision matrix in `content/portfolio/choosing-a-drivetrain.md`:

```markdown
| Criterion (weight) | Tank | Mecanum |
| --- | --- | --- |
| Speed (3) | 4 | 3 |
```

**Leave a blank line between paragraphs**, and before and after lists, tables and headings. Lines that touch each other are joined into one paragraph.

## YAML front matter

YAML is a way of writing structured data that's easy for people to read. Everything is `key: value`.

```yaml
title: Driving base          # text
grade: 10                    # a number
photo_consent: false         # true or false
date: 2026-10-04             # a date: year-month-day
start: 2026-10-25T13:00:00-06:00   # a date and time, with the time zone
```

**Lists** can be written two ways. These mean the same thing:

```yaml
authors: [Priya, Mateo]

authors:
  - Priya
  - Mateo
```

**Lists of groups** (each item has several fields) use a dash for each item, with that item's fields indented under it. This is from `content/robot/2026-27.md`:

<!-- source: content/robot/2026-27.md -->
```yaml
specs:
  - label: Drivetrain
    value: Mecanum, 4 motors
  - label: Control
    value: REV Control Hub
```

**Groups inside groups** use indentation. Here `kicker`, `title` and `text` all belong to `hero`:

<!-- source: content/_index.md -->
```yaml
hero:
  kicker: FIRST Tech Challenge team 37974, Edmonton
  title: Every robot is a new version.
```

### YAML rules that catch everyone

- **Indent with spaces, never tabs.** Use two spaces per level. VS Code with the YAML extension will warn you.
- **Indentation means something.** Moving a line left or right changes what it belongs to.
- **Put quotes around text that starts with a special character or looks like something else.** A colon followed by a space, a `#`, a leading `*` or `[`, or text like `yes`, `no`, `2026–27` or `"2026"` can confuse YAML. When in doubt, quote it: `title: "Kickoff: reading the manual"`.
- **Field names are case-sensitive in the file**, but Hugo lowercases them when templates read them. Use `lower_case_with_underscores` for new field names to avoid surprises.

## Hugo's built-in fields

Hugo itself understands some front matter fields. Use them for their intended purpose, and don't reuse their names for something else.

| Field | What Hugo does with it |
| --- | --- |
| `title` | The page title |
| `date` | The page date. Used for sorting, and for "Newer / Older" links |
| `draft` | If `true`, the page is left out of the published site |
| `summary` | Used instead of the automatic summary (the first 30 words) |
| `description` | The text search engines show for the page |
| `weight` | Sort order: lower numbers come first |
| `slug` | Changes the last part of the page's address |
| `aliases` | Old addresses that should redirect to this page |
| `type`, `layout`, `kind`, `url`, `build`, `cascade` | Change how Hugo builds the page. **Don't use these as your own field names.** We learned this the hard way: an event field called `kind` broke the build, so it's called `event_type` instead |

> **Future dates are hidden.** By default Hugo doesn't publish a page whose `date` is in the future. That's useful for scheduling a blog post, but bad for events, which are *about* the future. That's why events use a separate `start` field for when the event happens, and `date` just records when it was posted.

## Sections, list pages and single pages

Each folder in `content/` is a **section**. A section has:

- **One list page**, made from its `_index.md`. The front matter holds the section's title and intro, and the template lists the section's pages.
- **Any number of single pages**, one per `.md` file in the folder.

```text
content/blog/
├── _index.md           → /blog/            (the list page)
├── welcome.md          → /blog/welcome/    (a single page)
├── first-build.md      → /blog/first-build/
└── thank-you-sponsors.md → /blog/thank-you-sponsors/
```

The file name becomes the address, so use lowercase letters, numbers and hyphens: `intake-v1-to-v2.md`, not `Intake V1 to V2!.md`.

### Page bundles: a page with its own files

A gallery album needs to keep its photos together. So instead of a single `.md` file, an album is a **folder** containing `index.md` and the photos:

```text
content/gallery/
├── _index.md
└── 2026-season-kickoff/
    ├── index.md        → /gallery/2026-season-kickoff/
    ├── photo-1.jpg
    ├── photo-2.jpg
    └── ...
```

Templates can find files in the same folder as the page, which is how the album template finds its photos. Watch the underscore: **`index.md` makes a page bundle; `_index.md` makes a section's list page.** Mixing them up is a common mistake.

### Pages without their own page

Members and sponsors are only shown on their list pages; there's no `/members/avery/` page. That's set in `hugo.toml`:

<!-- source: hugo.toml -->
```toml
[[cascade]]
  [cascade.build]
    render = "never"
    list = "always"
  [cascade.target]
    kind = "page"
    path = "{/members/**,/sponsors/**}"
```

A **cascade** applies settings to many pages at once. This one says: for single pages (`kind = "page"`) under `/members/` or `/sponsors/`, never render a page of their own (`render = "never"`) but always include them in lists (`list = "always"`).

## The params: site-wide settings

Some things aren't on any one page, like the team's email. They live in `hugo.toml` under `[params]`:

<!-- source: hugo.toml -->
```toml
[params]
  # Shown in the header, footer and page titles.
  teamNumber = "37974"
  teamName = "37974 Robotics"
```

That's **TOML**, not YAML: it uses `key = value` and `[sections]`. Templates read these as `site.Params.teamName`.

## Field reference: what each section uses

These tables list every front matter field the templates read. If you add a field that isn't listed, nothing will show it until a template uses it ([chapter 7](07-follow-a-field.md) shows how).

### Home (`content/_index.md`)

| Field | Used for |
| --- | --- |
| `description` | Search engine and sharing description |
| `hero.kicker`, `hero.title`, `hero.text` | The small line, headline and intro at the top |
| `hero.buttons` (list of `label`, `url`) | The first button is gold, the second is outlined |
| `pillars` (list of `title`, `text`, `url`, `link_label`) | The "Build / Document / Share" columns |

Everything else on the home page (next event, latest announcement, current robot, blog posts, sponsors) is pulled in automatically from the other sections.

### About (`content/about/_index.md`)

| Field | Used for |
| --- | --- |
| `title`, `lead` | Page title and intro |
| Body | The "who we are" text |
| `facts` (list of `label`, `value`) | The quick-facts box |
| `values` (list of `title`, `text`) | "What we value" |
| `structure.title`, `structure.text` | The heading and overview for team structure |
| `structure.roles` (list of `name`, `text`) | Each role and what it does |
| `location_note` | The note about not publishing the address |

### Members (`content/members/*.md`)

| Field | Used for |
| --- | --- |
| `title` | **First name only** |
| `member_type` | `student` or `mentor`. Mentors are listed separately |
| `role` | E.g. "Programming lead" |
| `subteams` (list) | Shown under the name, and used by the filter buttons |
| `grade`, `joined` | Shown under the subteams |
| `bio` | One short line |
| `photo` | Path to a photo |
| `photo_consent` | **The photo only shows when this is `true`** |
| `weight` | Sort order |

The section's `_index.md` has `subteam_order` (the order of the filter buttons) and `join` (the "Want to join?" box).

### Robot seasons (`content/robot/*.md`)

| Field | Used for |
| --- | --- |
| `title`, `date` | Page title, and the season start (for sorting) |
| `season`, `game`, `robot_name` | E.g. "2026–27", the game name, and what you call the robot |
| `current` | `true` for the season shown first. If none is `true`, the newest is used |
| `summary` | One or two sentences |
| `image`, `image_alt` | Robot photo and its description |
| `specs` (list of `label`, `value`) | The specs table |
| `versions` (list, **oldest first**) | Each has `version`, `title`, `date`, `summary`, `changes` (list) and optional `journal` (a link). The newest is shown at the top and marked current |
| `results` (list of `event`, `date`, `result`, `award`) | Competition results table |
| `links` (list of `label`, `url`) | Code and CAD links |
| Body | Strategy and notes |

### Engineering portfolio (`content/portfolio/*.md`)

| Field | Used for |
| --- | --- |
| `title`, `date`, `season` | |
| `subsystem` | E.g. Drivetrain, Intake, Programming. Becomes a filter button |
| `authors` (list of first names) | "By Priya and Mateo" |
| `summary` | Shown in the list |
| `cover` | Optional image at the top |
| Body | The entry: Goal, What we tried, Results, Decision, Next steps |

The section's `_index.md` has `portfolio_pdf` (a link to the PDF for judges) and `pdf_text`.

### Outreach (`content/outreach/*.md`)

| Field | Used for |
| --- | --- |
| `title`, `date`, `location`, `summary`, `cover` | |
| `hours` | Volunteer hours for the whole team. Added up at the top of the list |
| `people_reached` | Added up at the top of the list |
| `partners` (list) | Organizations you worked with |

### Events (`content/events/*.md`)

| Field | Used for |
| --- | --- |
| `title` | Event name |
| `date` | When it was posted (not when it happens) |
| `start`, `end` | When it happens. Include the time zone, e.g. `2026-12-05T08:00:00-07:00` (Edmonton is `-06:00` in summer and `-07:00` in winter) |
| `event_type` | Qualifier, Championship, Scrimmage, League meet, Outreach or Team event. Sets the coloured label |
| `location` | Venue and city |
| `address` | Street address, **for public venues only** |
| `link` | The official event page |
| `result` | How we did, shown in gold |
| `album` | Link to the photos, e.g. `/gallery/2026-season-kickoff/` |
| `summary`, body | Description |

Events move from "Coming up" to "Past events" by themselves, the day after they end.

### Gallery albums (`content/gallery/<album>/index.md`)

| Field | Used for |
| --- | --- |
| `title`, `date`, `event`, `summary` | |
| `cover` | File name of the cover photo. If empty, the first photo is used |
| `photos` (list of `image`, `caption`) | The photos in order, with captions. If this list is empty, every image in the folder is shown |
| `videos` (list of `title`, `youtube`) | YouTube links or 11-character video IDs |

### Sponsors (`content/sponsors/*.md`)

| Field | Used for |
| --- | --- |
| `title` | Sponsor name |
| `tier` | Must match a tier `name` in `data/sponsorship.yaml` exactly, e.g. `Gold` |
| `logo` | Path to the logo. If empty, the name is shown instead |
| `website` | Makes the logo a link |
| `message` | What their support made possible |
| `active` | `false` moves them to the "past sponsors" line |
| `weight` | Order within the tier |

### Blog and announcements

| Field | Used for |
| --- | --- |
| `title`, `date`, `summary` | |
| `author` (blog) | First name |
| `cover`, `cover_alt` (blog) | Image and its description |
| `tags` (blog, list) | Creates tag pages like `/tags/robot/` |
| `pinned` (announcements) | `true` keeps it at the top, and on the home page |

## Try it

1. Create `content/blog/my-test-post.md` with a title, today's date and a paragraph. Watch it appear at `/blog/`. Then add `draft: true` and watch it disappear.
2. Change your post's date to next year. Where did it go? Why?
3. Add a second version to the robot season (`version: v3`) with today's date. Check the home page.
4. Delete your test post when you're done.

## Check your understanding

1. What's the difference between front matter and the body?
2. Why is `title: Kickoff: reading the manual` a problem, and how do you fix it?
3. Why do events use `start` instead of `date`?
4. You add `favourite_tool: soldering iron` to a member file. Will it appear on the site?

<details>
<summary>Answers</summary>

1. Front matter (YAML, between the `---` lines) holds facts about the page that templates use. The body (Markdown) is the page's main text.
2. The second colon followed by a space makes YAML think there's a nested key. Put the value in quotes: `title: "Kickoff: reading the manual"`.
3. Hugo hides pages whose `date` is in the future, and events are usually in the future. `start` is our own field, so Hugo doesn't hide anything based on it.
4. No. A field only appears if a template uses it. You'd need to edit `member-card.html` to show it ([chapter 7](07-follow-a-field.md)).

</details>

Next: [5. How Hugo builds a page](05-how-hugo-builds-a-page.md)
