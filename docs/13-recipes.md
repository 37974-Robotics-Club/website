# 13. Recipes: guided projects

**You'll learn:** how to make real changes to the site, from small to large. Each recipe says which chapters it builds on, lists every file you'll touch, and ends with a way to check it worked.

Do each recipe **on a branch** ([chapter 2](02-setting-up-your-computer.md#branches-and-pull-requests-for-anything-bigger-than-a-typo)), with `hugo server` running so you see each step as you go. When you've finished practising, you can either open a pull request (if the team wants the change) or delete the branch.

| Recipe | Difficulty | Files |
| --- | --- | --- |
| [1. Change a colour](#recipe-1-change-a-colour) | Starter | 1 |
| [2. Add a menu item](#recipe-2-add-a-menu-item) | Starter | 1 |
| [3. Add a new field to members](#recipe-3-add-a-new-field-to-members) | Intermediate | 5 |
| [4. Add a new page](#recipe-4-add-a-new-page) | Intermediate | 3 |
| [5. Make a shortcode](#recipe-5-make-a-shortcode) | Intermediate | 3 |
| [6. Add a whole new section](#recipe-6-add-a-whole-new-section) | Advanced | 5 |
| [7. Override a theme file without editing the theme](#recipe-7-override-a-theme-file-without-editing-the-theme) | Advanced | 1 |
| [8. Add a sponsorship tier](#recipe-8-add-a-sponsorship-tier) | Intermediate | 3 |

---

## Recipe 1: Change a colour

*Builds on: [chapter 8](08-css.md).*

**Goal:** make the gold slightly brighter across the whole site, without editing the theme.

1. Create the file `assets/css/custom.css`. That's in the project's `assets/` folder, **not** the theme's. You'll need to make the `css` folder first: in VS Code, right-click `assets` > **New Folder**.
2. Add:

   ```css
   :root { --gold: #c99a2e; }
   ```

3. Save and look at the site. Every gold line, triangle and button border has changed.

**Why it works:** `head.html` loads `custom.css` after `main.css` when it exists. Your `--gold` replaces the theme's, and every rule that says `var(--gold)` uses the new value.

**Check:** use a contrast checker to confirm your new gold is still at least 4.5 : 1 against `#002147`.

---

## Recipe 2: Add a menu item

*Builds on: [chapter 3](03-project-tour.md).*

**Goal:** add a "Match results" link to the **Our work** drop-down, pointing to our team's page on FTCScout.

1. Open `hugo.toml` and find the `Outreach` menu item (it has `parent = "work"`).
2. Below it, add:

   ```toml
     [[menus.main]]
       parent = "work"
       name = "Match results"
       url = "https://ftcscout.org/teams/37974"
       weight = 4
   ```

3. Save. Open the **Our work** drop-down.

**Why it works:** `header.html` loops through `site.Menus.main`. Items with a `parent` are shown in that parent's drop-down, sorted by `weight`.

**Check:** the new link is last in the drop-down and opens FTCScout.

---

## Recipe 3: Add a new field to members

*Builds on: [chapters 6](06-templates.md), [7](07-follow-a-field.md), [8](08-css.md) and [11](11-site-editor.md).*

**Goal:** let each member share their favourite part of robotics, editable in the site editor and shown on their card.

This touches every place a field lives. Use the table from [chapter 7](07-follow-a-field.md#the-lesson-a-field-lives-in-up-to-five-places) as your checklist.

### 1. The content

Open `content/members/avery.md` and add a line to the front matter:

```yaml
favourite_part: Driving in matches
```

Save. Nothing appears on the site yet. Do you know why? (No template uses the field.)

### 2. The template

Open `themes/ver37974/layouts/_partials/member-card.html`. After the `bio` line, add:

```go-html-template
  {{ with .Params.favourite_part }}<p class="member__fav">Favourite part: {{ . }}</p>{{ end }}
```

Save. "Favourite part: Driving in matches" appears on Avery's card, and only Avery's. That's `with` at work: members without the field don't get an empty paragraph.

### 3. The styles

In `themes/ver37974/assets/css/main.css`, find the `Members` section and add:

```css
.member__fav { color: var(--muted); font-size: var(--step--1); font-style: italic; margin: 0.35rem 0 0; }
```

### 4. The editor

In `static/admin/config.yml`, find the members collection's `bio` field and add this line after it:

```yaml
      - { name: favourite_part, label: Favourite part of robotics, hint: "e.g. CAD, driving, soldering", widget: string, required: false }
```

Check that `name: favourite_part` is spelled exactly like `.Params.favourite_part` in the template.

### 5. The starter file

In `archetypes/members.md`, add `favourite_part: ""` before `photo:`, so `hugo new content members/someone.md` includes it.

### 6. The guide

Add a row for `favourite_part` to the Members table in [chapter 4](04-content.md#members-contentmembersmd).

**Check:** use the editor's local workflow ([chapter 11](11-site-editor.md#testing-editor-changes-on-your-own-computer)) to open a different member. The new box is there. Fill it in, save, and check the card.

---

## Recipe 4: Add a new page

*Builds on: [chapters 4](04-content.md) and [5](05-how-hugo-builds-a-page.md).*

**Goal:** add a "Frequently asked questions" page for families.

### 1. The content

Create `content/faq.md`:

```markdown
---
title: Frequently asked questions
summary: Answers for families thinking about joining the team.
---

## Who can join?

Students aged 12 to 18. No experience needed.

## How much time does it take?

Two build sessions a week during the season, plus competitions.

## Does it cost anything?

Write the real answer here.
```

Go to http://localhost:1313/faq/. The page works already.

**Which template rendered it?** It's a `page` in no section, so Hugo used the general `single.html` ([chapter 5](05-how-hugo-builds-a-page.md#which-template-renders-which-page)). `single.html` only shows a date for pages that are in a section, so the FAQ doesn't get one, and its `summary` became the intro.

### 2. The menu

In `hugo.toml`, add it to the **Team** drop-down:

```toml
  [[menus.main]]
    parent = "team"
    name = "FAQ"
    url = "/faq/"
    weight = 4
```

### 3. The editor

In `static/admin/config.yml`, find the `pages` collection's `files:` list and add an entry after `about`:

```yaml
      - name: faq
        label: FAQ
        file: content/faq.md
        format: yaml-frontmatter
        fields:
          - { name: title, label: Title, widget: string }
          - { name: summary, label: Intro, widget: text }
          - { name: body, label: Questions and answers, widget: markdown }
```

Indentation matters: the dash in `- name: faq` must line up with the dash in `- name: about`.

**Check:** the FAQ is in the Team drop-down, and in the editor under **Pages**.

---

## Recipe 5: Make a shortcode

*Builds on: [chapter 6](06-templates.md).*

A **shortcode** is a mini-template you can use inside Markdown. Markdown can't make a highlighted box, but a shortcode can.

**Goal:** a "callout" box for journal entries, like a "Lesson learned" note.

### 1. The shortcode

Create `layouts/_shortcodes/callout.html` (in the project):

```go-html-template
{{/* A highlighted box for journal entries.
     Usage: {{< callout "Lesson learned" >}}Some **Markdown** text.{{< /callout >}} */}}
<aside class="callout">
  {{ with .Get 0 }}<p class="callout__title">{{ . }}</p>{{ end }}
  {{ .Page.RenderString (dict "display" "block") .Inner }}
</aside>
```

| Code | Meaning |
| --- | --- |
| `.Get 0` | The first value after the shortcode's name: `"Lesson learned"` |
| `.Inner` | Everything between the opening and closing shortcode |
| `.Page.RenderString (dict "display" "block") .Inner` | Convert that inner text from Markdown to HTML, as full paragraphs |

### 2. The styles

Add to `assets/css/custom.css` (create it if Recipe 1 didn't):

```css
.callout { border-left: 3px solid var(--gold); background: var(--navy-raised); padding: 1rem 1.25rem; margin: 1.5rem 0; }
.callout__title { font-weight: 700; color: var(--wheat); margin: 0 0 0.35rem; }
.callout > :last-child { margin-bottom: 0; }
```

### 3. Use it

In `content/portfolio/intake-v1-to-v2.md`, add before `## Decision`:

```markdown
{{< callout "Lesson learned" >}}
Test **three** options before committing to one. The best design was the one we almost didn't try.
{{< /callout >}}
```

**Check:** the journal entry shows a gold-edged box with the title in wheat and the text in bold where you used `**`.

In the site editor, you type a shortcode into the Markdown box as plain text, exactly as above.

---

## Recipe 6: Add a whole new section

*Builds on: everything up to [chapter 11](11-site-editor.md).*

**Goal:** an **Awards** page listing every award the team has won, managed in the site editor.

### 1. The content

Create `content/awards/_index.md`:

```markdown
---
title: Awards
lead: Recognition from judges at FIRST Tech Challenge events.
---
```

And one award, `content/awards/2026-sample-award.md`:

```markdown
---
title: Think Award (sample)
date: 2026-10-11
event: Sample event
season: "2026–27"
---

Judges recognized our engineering portfolio.
```

Visit http://localhost:1313/awards/. It works, using the general `list.html`, which shows cards meant for blog posts. Not quite right.

> **If your award doesn't appear,** check its `date`. Hugo hides pages dated in the future ([chapter 4](04-content.md#hugos-built-in-fields)). We found this out writing this recipe: the first sample award was dated for an upcoming qualifier, and the list stayed empty.

### 2. A template for the section

Create `layouts/awards/list.html` **in the project**:

```go-html-template
{{ define "main" }}
{{ partial "page-head.html" (dict "page" .) }}
<div class="wrap section" style="padding-top:0">
  <ul class="row-list">
    {{ range .Pages.ByDate.Reverse }}
    <li>
      <div class="row">
        <div class="row__when">{{ partial "date.html" .Date }}</div>
        <div>
          <h3>{{ .Title }}</h3>
          <p>{{ .Params.event }}{{ with .Params.season }}, {{ . }} season{{ end }}</p>
          {{ with .Content }}<div class="prose" style="margin-top:.5rem">{{ . }}</div>{{ end }}
        </div>
      </div>
    </li>
    {{ else }}
    <li class="empty">No awards yet. Go win one.</li>
    {{ end }}
  </ul>
</div>
{{ end }}
```

Look at what it reuses: `page-head.html`, `date.html`, and the `row-list` and `row` CSS classes from the announcements list. Reusing existing pieces keeps the site consistent and means you write almost no new CSS.

### 3. No separate page for each award

Each award is shown in full on the list, so it doesn't need its own page. In `hugo.toml`, add `/awards/**` to the cascade's `path`:

```toml
    path = "{/members/**,/sponsors/**,/awards/**}"
```

### 4. The menu

```toml
  [[menus.main]]
    parent = "work"
    name = "Awards"
    url = "/awards/"
    weight = 4
```

### 5. The editor

Add a new collection to `static/admin/config.yml`, before the `pages` collection:

```yaml
  - name: awards
    label: Awards
    label_singular: Award
    folder: content/awards
    create: true
    format: yaml-frontmatter
    slug: "{{year}}-{{slug}}"
    summary: "{{title}} ({{date}})"
    fields:
      - { name: title, label: Award, widget: string }
      - { name: date, label: Date, widget: datetime, time_format: false }
      - { name: event, label: Event, widget: string }
      - { name: season, label: Season, widget: string, default: "2026–27" }
      - { name: body, label: What the judges said, widget: markdown, required: false }
```

**Check:** `/awards/` lists the award with its date, event and text. `/awards/2026-sample-award/` gives "page not found". The editor has an **Awards** collection.

**Going further:** show the latest award on the home page. You'll need `where site.RegularPages "Section" "awards"` in `home.html` (look at how the home page finds blog posts).

---

## Recipe 7: Override a theme file without editing the theme

*Builds on: [chapter 3](03-project-tour.md#the-one-rule-your-project-beats-the-theme).*

**Goal:** add a line to the footer, while leaving the theme's files untouched.

1. Copy `themes/ver37974/layouts/_partials/footer.html` to `layouts/_partials/footer.html` (create the folders). The path after `layouts/` must be identical.
2. In your copy, just before `</footer>`, add:

   ```html
     <p class="wrap small muted" style="margin-top:1rem">Built by the students of team 37974 with Hugo.</p>
   ```

3. Save. The new line is on every page.

**Why it works:** Hugo looks for `layouts/_partials/footer.html` in the project first, and only uses the theme's if the project doesn't have one.

**The catch:** your copy doesn't get future changes made to the theme's footer. If someone fixes a bug in the theme's version, you'd have to copy the fix over. So override only when you really need to, and note it in the commit message.

**Check:** delete your copy. The line disappears and the theme's footer is back.

---

## Recipe 8: Add a sponsorship tier

*Builds on: [chapters 4](04-content.md) and [11](11-site-editor.md).*

**Goal:** add a Platinum tier above Gold.

1. In `data/sponsorship.yaml`, add a new item at the **top** of `tiers:` (the order there is the order everywhere):

   ```yaml
     - name: Platinum
       amount: "$5,000+"
       benefits:
         - Everything in Gold
         - Name the robot for the season
   ```

2. In `static/admin/config.yml`, find the sponsors collection's `tier` field and add `Platinum` to its options: `options: [Platinum, Gold, Silver, Bronze, Supporter]`.
3. Change `content/sponsors/sample-co.md` to `tier: Platinum`.

**Check:** the Become a sponsor page shows five tier cards. The sponsors page shows Platinum first, with the biggest logo.

**Why the biggest logo?** In `sponsors/list.html`, each tier gets a class from its position: `logo-wall--1` for the first tier, up to `logo-wall--4`. The CSS makes `--1` the widest. Find both pieces.

---

## Challenges

No step-by-step instructions for these. Use everything you've learned, and plan before you code: which files, which fields, which templates?

- **Countdown:** show "12 days until the qualifier" on the home page, using `upcoming-events.html` and Hugo's time functions.
- **Events calendar file:** create an `.ics` file so families can add our events to their phone calendars. (Look up Hugo "output formats".)
- **Season stats:** on the robot season page, show the total number of journal entries for that season.
- **French:** Canada has two official languages. Look up Hugo's "multilingual mode" and plan what a French version of the home page would need.
- **Works without JavaScript:** right now, the drop-down menus need JavaScript to open. Make them usable without it. (Hint: the HTML `<details>` element.)
- **Search:** add a search box for the engineering portfolio. (Look up "Pagefind".)

When you finish one, write it up in a pull request, and update the chapter of this guide that explains that part of the site.

Next: [14. Troubleshooting](14-troubleshooting.md)
