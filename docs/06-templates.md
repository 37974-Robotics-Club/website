# 6. Templates

**You'll learn:** how to read and write Hugo templates, using real code from our theme. By the end you'll be able to read any file in `layouts/` and know what it does.

Hugo templates are HTML files with instructions inside `{{ }}`. The instructions are written in Go's template language (Hugo is written in a programming language called Go). Everything outside `{{ }}` is copied to the page exactly as written.

## Printing a value

```go-html-template
<h1>{{ .Title }}</h1>
```

`{{ .Title }}` prints the current page's title. Hugo **escapes** what it prints: if a title contains `<`, it prints `&lt;` so it shows as text instead of breaking the HTML. That protects the page from broken or harmful content.

## The dot: "the thing I'm working with right now"

The single most important idea in Hugo templates is **the dot**, written `.`. It means *the current context*: whatever the template is working with at this moment.

In a page template, the dot is **the page**. So:

| You write | You get |
| --- | --- |
| `.Title` | The page's title |
| `.Content` | The page's Markdown body, converted to HTML |
| `.Date` | The page's date |
| `.RelPermalink` | The page's address, like `/blog/welcome/` |
| `.Params.author` | The `author` field from the front matter. **Your own fields are always under `.Params`** |
| `.Pages` | On a section page, the pages in that section |
| `.Section` | Which section the page is in, like `blog` |

Some things aren't about any one page. Those come from `site`:

| You write | You get |
| --- | --- |
| `site.Params.email` | `email` from `[params]` in `hugo.toml` |
| `site.Menus.main` | The main menu from `hugo.toml` |
| `site.RegularPages` | Every single page on the site |
| `site.Data.sponsorship.tiers` | The `tiers` list from `data/sponsorship.yaml` |

The dot *changes* inside `with` and `range` blocks (explained below). When you need to get back to the page you started with, use `$`. **`$` always means the context the template started with.**

## Variables

```go-html-template
{{ $name := .Title }}          {{/* create a variable */}}
{{ $name = "Someone else" }}   {{/* change it later (no colon) */}}
<h3>{{ $name }}</h3>
```

Variable names start with `$`. Use `:=` the first time and `=` to change it.

## Comments

```go-html-template
{{/* This is a comment. It never appears on the page. */}}
```

## Functions, and why they come first

Hugo has hundreds of functions. You call a function by writing its name followed by its inputs, separated by spaces:

```go-html-template
{{ upper "hello" }}            → HELLO
{{ add 2 3 }}                  → 5
{{ printf "Photo of %s" $name }} → Photo of Avery
```

Comparisons are functions too, so **the comparison comes first**. This feels backwards at first:

| In most languages | In Hugo templates |
| --- | --- |
| `a == b` | `eq a b` |
| `a != b` | `ne a b` |
| `a > b` | `gt a b` |
| `a >= b` | `ge a b` |
| `a and b` | `and a b` |
| `not a` | `not a` |

When an input is itself the result of a function, wrap it in parentheses:

```go-html-template
{{ if gt (len $teams) 1 }}  {{/* "if the length of $teams is greater than 1" */}}
```

## Pipes: passing a value along

The `|` symbol (a **pipe**) takes the value on the left and passes it as the *last* input to the function on the right. These two lines do the same thing:

```go-html-template
{{ upper (substr $name 0 1) }}
{{ substr $name 0 1 | upper }}
```

Both take the first letter of the name and make it uppercase. That's exactly how a member's initial is made in `member-card.html`. Pipes read left to right, like a recipe: "take the first letter, then make it uppercase".

A very common pipe is `default`, which supplies a fallback:

```go-html-template
{{ .Params.robot_name | default .Title }}
```

"Use the robot name. If there isn't one, use the page title."

## `if`: do this only sometimes

<!-- source: themes/ver37974/layouts/_partials/member-card.html -->
```go-html-template
    {{ if and .Params.photo .Params.photo_consent }}
      {{ partial "img.html" (dict "page" . "src" .Params.photo "fill" "320x320" "alt" (printf "Photo of %s" $name)) }}
    {{ else }}
      <span class="member__mono" aria-hidden="true">{{ substr $name 0 1 | upper }}</span>
    {{ end }}
```

"If the member has a photo **and** photo consent is true, show the photo. Otherwise, show their initial." Every `if` needs an `{{ end }}`. You can add `{{ else }}` or `{{ else if ... }}` in between.

Something counts as **false** if it's missing, empty (`""`), `false`, `0`, or an empty list. So `{{ if .Params.photo }}` means "if there's a photo".

## `with`: if it exists, use it

`with` is like `if`, but it also **sets the dot to the value** while you're inside it:

<!-- source: themes/ver37974/layouts/_partials/member-card.html -->
```go-html-template
  {{ with .Params.role }}<p class="member__role">{{ . }}</p>{{ end }}
```

"If this member has a role, print a paragraph with it." Inside the `with`, `.` is the role itself, so `{{ . }}` prints it. If the member has no role, nothing is printed, not even an empty `<p>`.

Because the dot changed, you can't write `.Title` inside that `with` to get the page title. That's what `$` is for:

<!-- source: themes/ver37974/layouts/_partials/member-card.html -->
```go-html-template
  {{ with .Params.grade }}<p class="member__team">Grade {{ . }}{{ with $.Params.joined }}, joined {{ . }}{{ end }}</p>{{ end }}
```

Inside the first `with`, `.` is the grade. To reach the member's `joined` field, it uses `$.Params.joined`: "from the page I started with".

## `range`: do this for each item

`range` loops over a list. Inside the loop, the dot is the current item:

<!-- source: themes/ver37974/layouts/members/list.html -->
```go-html-template
      {{ range .ByWeight }}{{ partial "member-card.html" . }}{{ end }}
```

`.ByWeight` is the section's pages sorted by their `weight` field. For each one, it runs `member-card.html` and passes that member's page in as the dot.

If you need a counter, name two variables:

```go-html-template
{{ range $i, $tier := site.Data.sponsorship.tiers }}
  {{ $i }}: {{ $tier.name }}      {{/* 0: Gold, 1: Silver, ... */}}
{{ end }}
```

`range` can have an `{{ else }}` that runs when the list is empty. The portfolio uses it to say "No journal entries yet."

## Lists and groups you make yourself

| Function | Makes | Example |
| --- | --- | --- |
| `slice` | A list | `{{ $teams := slice }}` (an empty list) |
| `append` | A longer list | `{{ $teams = $teams \| append "Build" }}` |
| `dict` | A group of named values | `(dict "page" . "title" "Members")` |
| `index` | One item from a list or group | `index $list 0` (the first item) |

## Finding and sorting pages

These functions do most of the heavy lifting in our templates.

<!-- source: themes/ver37974/layouts/members/list.html -->
```go-html-template
  {{ $students := where .Pages "Params.member_type" "ne" "mentor" }}
  {{ $mentors := where .Pages "Params.member_type" "mentor" }}
```

`where` filters a list. The first line keeps pages whose `member_type` is **not equal** (`ne`) to `mentor`. The second keeps pages whose `member_type` is `mentor` (no comparison word means "equals").

Other list functions you'll see:

| Function | What it does | Used in |
| --- | --- | --- |
| `sort $list "Params.start" "asc"` | Sort by a field, ascending or descending | `upcoming-events.html` |
| `first 3 $list` | The first 3 items | `home.html` (three blog posts) |
| `last 1 $list` | The last item, as a list | `home.html` (latest robot version) |
| `len $list` | How many items | `gallery/list.html` (photo count) |
| `uniq $list` | Remove duplicates | `members/list.html` (subteam buttons) |
| `in $list "Build"` | Is this item in the list? | `members/list.html` |
| `delimit $list ", "` | Join a list into text | `member-card.html` ("Build, Drive team") |

## Including a partial, and passing it several things

A partial gets exactly **one** value as its dot. To give it several, bundle them in a `dict`:

<!-- source: themes/ver37974/layouts/members/list.html -->
```go-html-template
{{ partial "page-head.html" (dict "page" .) }}
```

And inside `page-head.html`, each named value is read with a dot and its name:

<!-- source: themes/ver37974/layouts/_partials/page-head.html -->
```go-html-template
    <h1>{{ .title | default .page.Title }}</h1>
```

"Print the `title` I was given. If none was given, use the title of the `page` I was given."

## Partials that return a value

Most partials print HTML. Some *calculate* something and hand it back, like a function. They end with `return`. Here's the whole of `upcoming-events.html`:

<!-- source: themes/ver37974/layouts/_partials/upcoming-events.html -->
```go-html-template
{{/* Returns events whose start (or end) is today or later, soonest first. */}}
{{- $today := now.Format "2006-01-02" -}}
{{- $out := slice -}}
{{- range where site.RegularPages "Section" "events" -}}
  {{- $last := .Params.end | default .Params.start -}}
  {{- if $last -}}{{- if ge ((time.AsTime $last).Format "2006-01-02") $today -}}{{- $out = $out | append . -}}{{- end -}}{{- end -}}
{{- end -}}
{{- return (sort $out "Params.start" "asc") -}}
```

Line by line:

1. A comment saying what it does.
2. Today's date as text, like `2026-10-19`.
3. Start with an empty list.
4. Go through every page in the `events` section.
5. Use the event's end time, or its start time if it has no end.
6. If that date is today or later (`ge`: greater than or equal), add the event to the list.
7. (end of the loop)
8. Return the list, sorted by start time, soonest first.

Using it:

```go-html-template
{{ $upcoming := partial "upcoming-events.html" . }}
```

Two rules for returning partials: `return` must be the **last thing** in the file, and it can't be inside an `if` or `range`. (We found that out with an error: "wrong number of args for return". The fix was to set a variable inside the `if` and return the variable at the end, like `link.html` does.)

### Why `now` means the daily rebuild

`now` is the time **when Hugo builds the site**, not when someone visits. An event moves to "Past events" only when the site is rebuilt after it ends. That's why the deploy workflow runs once a day even if nobody changed anything ([chapter 12](12-publishing.md)).

## Dates: the strange reference date

Go formats dates using an example of one specific moment: **Monday, January 2, 2006, at 3:04:05 pm, Mountain time**. You write that moment the way you want *any* date to look:

<!-- source: themes/ver37974/layouts/_partials/date.html -->
```go-html-template
{{- time.Format "January 2, 2006" . -}}
```

| Format | Gives |
| --- | --- |
| `"January 2, 2006"` | October 19, 2026 |
| `"Jan 2006"` | Oct 2026 |
| `"2006-01-02"` | 2026-10-19 |
| `"3:04 pm"` | 1:00 pm |
| `"Monday"` | Monday |

It's odd, but easy to remember: the numbers go 1 (January), 2, 3 (pm), 4, 5, 6, 7 (Mountain time is UTC−7).

## Trimming spaces: `{{-` and `-}}`

A dash just inside the braces removes the spaces and line breaks next to it. Partials that return values, like the one above, use dashes everywhere so they don't leave stray spaces in the page. In ordinary templates you rarely need them.

## When text should be HTML: `safeHTML` and `markdownify`

Because Hugo escapes everything it prints, text containing HTML tags shows the tags as text. Two functions change that:

- `markdownify` converts Markdown text to HTML: `{{ .lead | markdownify }}` turns `*FIRST*` in an intro into italic *FIRST*.
- `safeHTML` says "trust this, it's already HTML". Only use it on HTML **we** wrote in a template, never on something a visitor could type.

## Seeing what's inside something

When you're not sure what a value contains, print it:

```go-html-template
<pre>{{ debug.Dump .Params }}</pre>
```

That shows every front matter field of the current page. Or print a message in the terminal while building:

```go-html-template
{{ warnf "Building %s, member_type is %v" .Title .Params.member_type }}
```

Take these out before you commit.

## Putting it together: `member-card.html`, line by line

Here's the main part of the file. Read it now; you know enough to understand every line.

<!-- source: themes/ver37974/layouts/_partials/member-card.html -->
```go-html-template
{{ $name := .Title }}
<li class="member" data-tags="{{ delimit (.Params.subteams | default slice) "|" }}">
  <div class="member__photo">
    {{ if and .Params.photo .Params.photo_consent }}
      {{ partial "img.html" (dict "page" . "src" .Params.photo "fill" "320x320" "alt" (printf "Photo of %s" $name)) }}
    {{ else }}
      <span class="member__mono" aria-hidden="true">{{ substr $name 0 1 | upper }}</span>
    {{ end }}
  </div>
  <h3>{{ $name }}</h3>
  {{ with .Params.role }}<p class="member__role">{{ . }}</p>{{ end }}
  {{ with .Params.subteams }}<p class="member__team">{{ delimit . ", " }}</p>{{ end }}
```

| Line | What it does |
| --- | --- |
| `$name := .Title` | Save the member's name in a variable, for use below |
| `data-tags="{{ delimit ... "\|" }}"` | Write the subteams as `Build\|Drive team`. The JavaScript filter reads this ([chapter 9](09-javascript.md#part-3-filters)). `default slice` means "an empty list if there are no subteams", so `delimit` doesn't fail |
| `if and .Params.photo .Params.photo_consent` | The privacy rule: a photo needs both a photo *and* consent |
| `partial "img.html" (dict ...)` | Make a 320×320 cropped photo, with alt text "Photo of Avery" |
| `substr $name 0 1 \| upper` | Otherwise show the first letter, uppercase |
| `with .Params.role` | Only print the role paragraph if there's a role |
| `with .Params.subteams` | Same for subteams, joined with commas |

## Try it

1. In `member-card.html`, change `"Photo of %s"` to `"%s from team 37974"`. Where would you see the change? (Hint: you need a member with a photo and consent, and you need to look at the HTML, not the screen.) Change it back.
2. In `layouts/_partials/date.html`, change the format to `"Mon Jan 2"`. Look at the announcements page. Change it back.
3. Add `<pre>{{ debug.Dump .Params }}</pre>` just after `{{ define "main" }}` in `robot/single.html`. Look at the season page, then remove it.
4. On the members page, mentors are listed with `where .Pages "Params.member_type" "mentor"`. Write the line that would find only members in grade 12. (Answer below.)

## Check your understanding

1. What is the dot inside `{{ with .Params.role }} ... {{ end }}`?
2. What's the difference between `.Title` and `$.Title` inside a `range`?
3. Rewrite `{{ upper (.Params.role) }}` using a pipe.
4. Why does `upcoming-events.html` end with `return` instead of printing HTML?
5. What does `{{ .Params.cover_alt | default "" }}` do?

<details>
<summary>Answers</summary>

1. The role itself (the text). `{{ . }}` prints it.
2. Inside a `range`, `.` is the current item, so `.Title` is the item's title. `$.Title` is the title of the page the template started with.
3. `{{ .Params.role | upper }}`
4. Because its job is to work out a list of events that other templates use in different ways: the home page shows only the first one, the events page shows them all. Returning the list lets each template decide what to do with it.
5. Uses the cover image's description, or an empty string if there isn't one.

**Try it, question 4:** `{{ $seniors := where .Pages "Params.grade" 12 }}`

</details>

Next: [7. Follow one field all the way through](07-follow-a-field.md)
