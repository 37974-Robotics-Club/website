# 8. CSS: how the site looks

**You'll learn:** how our stylesheet is organized, what design tokens are, how the layout adapts from phones to big screens, how the signature pieces (the version stamp and gold triangles) are made, and how to change the look safely.

All of the site's styles are in one file: `themes/ver37974/assets/css/main.css`. Open it now and scroll through. It's long, but it's organized into labelled sections, like `/* ---------- Members ---------- */`, in roughly the order things appear on the page.

## A CSS rule, piece by piece

```css
.member__role { color: var(--wheat); font-weight: 700; }
```

| Part | Name | Meaning |
| --- | --- | --- |
| `.member__role` | Selector | Which elements this applies to: anything with `class="member__role"` |
| `color` | Property | What to change |
| `var(--wheat)` | Value | What to change it to |
| `{ ... }` | Declaration block | Everything between the braces applies to the selector |

## Design tokens: the colours and sizes in one place

The top of the file defines **custom properties**, also called **design tokens**: named values the rest of the file uses.

<!-- source: themes/ver37974/assets/css/main.css -->
```css
  /* Logo colours */
  --navy: #002147;        /* logo background */
  --navy-deep: #00152e;   /* footer and inset bands */
  --navy-raised: #0b2d58; /* panels that sit on the page */
  --navy-line: #1d4377;   /* hairlines on navy */
  --gold: #b1892a;        /* logo triangle: structure, rules, markers */
  --wheat: #d8c495;       /* logo crown and arrows: links, accents */
```

Anywhere else in the file, `var(--gold)` means `#b1892a`. **To change a colour across the whole site, change it once here.** That's the point of tokens: without them, the same gold would be typed out dozens of times, and changing it would mean finding every one.

These colours weren't picked by eye. They were sampled from the pixels of the logo file: navy is the logo's background, gold is the triangle, and wheat is the crown and arrows.

### How each colour is used

| Token | Used for | Contrast against navy |
| --- | --- | --- |
| `--white` | Headings | 16.0 : 1 |
| `--text` | Body text | 14.7 : 1 |
| `--wheat` | Links, accents, the main buttons | 9.4 : 1 |
| `--muted` | Less important text (dates, captions) | 9.3 : 1 |
| `--gold` | Lines, borders, triangle markers, the current version | 5.0 : 1 |

**Contrast** is how different two colours are in brightness. The accessibility guideline (WCAG AA) asks for at least **4.5 : 1** for normal text, so people with low vision can read it. All our text colours pass. If you change a colour, check it with a contrast checker (search "WebAIM contrast checker") before committing.

### Type and spacing tokens

| Token | What it is |
| --- | --- |
| `--font-display` | Big Shoulders Display: a tall, narrow face for headings, like a team jersey |
| `--font-body` | Atkinson Hyperlegible Next: designed by the Braille Institute so letters are hard to confuse (like `l`, `1` and `I`) |
| `--step--1` to `--step-5` | Text sizes, from small print to the biggest headline. Each step is about 1.33 times the one before |
| `--gutter` | Space between the content and the edge of the screen |
| `--section` | Space between big sections of a page |
| `--wide` | The widest the content gets (76rem, about 1216 pixels) |
| `--measure` | The widest a block of reading text gets (40rem). Long lines are hard to read |

### `rem`, `em`, `vw` and `clamp()`

- `rem` is relative to the browser's base text size (usually 16 pixels). `2rem` = 32 pixels. Using `rem` means everything scales if someone sets bigger text in their browser.
- `em` is relative to the current element's text size. `0.5em` padding grows with the text.
- `vw` is a percentage of the screen width. `5vw` on a 1000-pixel screen is 50 pixels.
- `clamp(min, preferred, max)` picks the preferred value, but never smaller than min or bigger than max:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
  --step-5: clamp(3.2rem, 9vw, 6.75rem);
```

The biggest headings are 9% of the screen width, but at least 3.2rem on a phone and at most 6.75rem on a big monitor. That's **fluid type**: it shrinks smoothly instead of jumping at set sizes.

## How class names are chosen

Classes follow a pattern called **BEM** (block, element, modifier):

| Pattern | Example | Meaning |
| --- | --- | --- |
| `block` | `.member` | A self-contained component |
| `block__element` | `.member__role` | A part of that component |
| `block--modifier` | `.ver--current` | A variation of the component |

So when you see `.member__photo`, you know it's the photo *inside* a member card, and you can find its rule by searching for `member__`. When you add a component, follow the same pattern.

## Layout

### The container

<!-- source: themes/ver37974/assets/css/main.css -->
```css
.wrap { width: min(100% - 2 * var(--gutter), var(--wide)); margin-inline: auto; }
```

`.wrap` is the column that holds the content. Its width is whichever is smaller: the full screen minus a gutter on each side, or `--wide`. `margin-inline: auto` centres it.

### Grid

Most layouts use **CSS Grid**, which arranges things in rows and columns. The member cards use a clever version:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
.member-grid { display: grid; gap: 2rem 1.5rem; grid-template-columns: repeat(auto-fill, minmax(min(9.5rem, 45%), 1fr)); list-style: none; margin: 0; padding: 0; }
```

`repeat(auto-fill, minmax(min(9.5rem, 45%), 1fr))` means: "make as many columns as fit, each at least 9.5rem wide (or 45% of the row, if that's smaller), and share any leftover space equally." On a phone you get two columns; on a laptop, six. No media query needed.

### Media queries: changing the layout by screen size

When the layout needs to change at a certain width, we use a **media query**. We design for phones first, then add rules for bigger screens:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
@media (min-width: 48rem) { .pillars { grid-template-columns: repeat(3, 1fr); } }
```

"On screens at least 48rem (768 pixels) wide, put the Build / Document / Share columns side by side." Below that, they stack. This is called **mobile-first**: the rules outside media queries are for phones, and media queries add to them.

The one exception is the header menu, which uses `max-width: 62rem`: "on screens *narrower* than 62rem, hide the menu behind the Menu button". It was easier to write the desktop menu first and change it for small screens.

**Try it:** open the site, then your browser's developer tools (**F12**, or right-click > **Inspect**). Click the phone-and-tablet icon to switch to device mode, and drag the width. Watch the layout change at each breakpoint.

## The signature pieces

### The version stamp

The logo says "Ver.", so the site shows robot versions like stamps:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
.ver {
  display: inline-flex; align-items: baseline; gap: 0.15em;
  font-family: var(--font-display); font-weight: 800; font-size: 1.15rem; line-height: 1;
  color: var(--wheat); border: 2px solid var(--gold); padding: 0.25em 0.5em 0.2em;
  border-radius: var(--radius); white-space: nowrap;
}
```

```css
.ver--current { background: var(--gold); color: var(--navy); }
.ver--lg { font-size: clamp(2rem, 4vw, 2.75rem); padding: 0.18em 0.4em 0.12em; gap: 0.3em; }
```

A plain `.ver` is a gold outline. Add `ver--current` and it's filled in. Add `ver--lg` and it's big (that's the one on the home page). Modifiers combine: `class="ver ver--current ver--lg"`.

On the season page, `.verlog` draws the line connecting the stamps. Look at `.verlog::before`: it's an empty element, 2 pixels wide, stretched from top to bottom, positioned exactly behind the centre of the stamps.

### The gold triangles

Bulleted lists use small gold triangles instead of dots, echoing the logo:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
.tri-list li::before, .prose ul > li::before {
  content: ""; position: absolute; left: 0; top: 0.55em; width: 0.62rem; height: 0.55rem;
  background: var(--gold); clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

- `::before` creates an extra, invisible element at the start of each list item
- `content: ""` makes it exist, even though it has no text
- `position: absolute; left: 0` places it at the left of the item
- `background: var(--gold)` fills it with gold
- `clip-path: polygon(50% 0, 100% 100%, 0 100%)` cuts it into a triangle: top middle, bottom right, bottom left

The member initials use the same `clip-path` trick, just bigger (`.member__mono`).

## Accessibility built into the CSS

| Rule | Why |
| --- | --- |
| `:focus-visible { outline: var(--focus); ... }` | People using a keyboard see a wheat outline on whatever is selected. Never remove focus outlines |
| `.skip-link` | A hidden "Skip to content" link that appears when you press Tab, so keyboard users can skip the menu |
| `.visually-hidden` | Hides text on screen but keeps it for screen readers |
| `@media (prefers-reduced-motion: reduce)` | Turns off animation for people who've asked their device for less motion (motion can cause nausea) |
| `@media print` | When printing, hides the header and footer and uses black text on white |

## How the CSS reaches the browser

You never link to `main.css` directly. In `head.html`, Hugo processes it first:

<!-- source: themes/ver37974/layouts/_partials/head.html -->
```go-html-template
{{ $css := resources.Get "css/main.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

That shrinks the file and gives it a unique name like `main.min.3f9a....css`. [Chapter 10](10-images-and-assets.md#hugo-pipes-processing-css-and-javascript) explains why.

## Changing the look safely: `custom.css`

You *can* edit `main.css` directly. But if you only want to adjust a few things, there's a cleaner way: create `assets/css/custom.css` **in the project** (not the theme). `head.html` loads it after `main.css` if it exists:

<!-- source: themes/ver37974/layouts/_partials/head.html -->
```go-html-template
{{ with resources.Get "css/custom.css" }}{{ $c := . | minify | fingerprint }}<link rel="stylesheet" href="{{ $c.RelPermalink }}">{{ end }}
```

Because it loads second, its rules win when they conflict. For example:

```css
/* assets/css/custom.css */
:root { --gold: #c99a2e; }          /* a slightly brighter gold, everywhere */
.member__photo { border-radius: 50%; }  /* round member photos */
```

Your changes stay separate from the theme, so they're easy to see and easy to undo.

### When a rule doesn't seem to work

Two rules can target the same element. The browser decides which wins by **specificity** (more specific selectors win: `.member .member__role` beats `.member__role`) and then **order** (later wins). If your change isn't showing:

1. Right-click the element and choose **Inspect**.
2. In the **Styles** panel, find your rule. If it's crossed out, another rule is winning. The panel shows which one.
3. Make your selector match the winning one's specificity, or put your rule in `custom.css` so it comes later.

Avoid `!important`. It wins over everything, which feels great until you need to override it.

## Try it

1. Create `assets/css/custom.css` and change `--navy` to a different colour. Watch the whole site change. Then delete the file.
2. Use the developer tools to find which rule makes the footer background darker than the page.
3. Change `.tri-list li::before`'s `clip-path` to `circle(50%)`. What happens? Change it back.
4. Find the media query that puts the events list's date beside the event, instead of above it.

## Check your understanding

1. Why use `var(--gold)` instead of typing `#b1892a`?
2. What does `.ver--current` mean, according to the naming pattern?
3. On a phone, are the Build / Document / Share columns side by side? Which rule decides?
4. Why put changes in `custom.css` instead of `main.css`?
5. Your new text colour has a contrast of 3.2 : 1 against navy. Is that OK?

<details>
<summary>Answers</summary>

1. So the colour is defined once. Changing it in one place changes it everywhere, and the name says what it's for.
2. It's a modifier (`--current`) of the `ver` block: the current version's stamp.
3. No, they stack. The rule `.pillars { grid-template-columns: repeat(3, 1fr); }` only applies inside `@media (min-width: 48rem)`, which phones are narrower than.
4. It keeps your changes separate from the theme, so they're easy to find and undo, and they'll survive if the theme file is replaced with a new version.
5. No. Normal text needs at least 4.5 : 1 to meet WCAG AA.

**Try it, question 4:** `@media (min-width: 44rem) { .row { grid-template-columns: 10rem 1fr; } }`

</details>

Next: [9. JavaScript: the interactive parts](09-javascript.md)
