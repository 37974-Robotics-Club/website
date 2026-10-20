# 15. Glossary

Every technical word used in this guide, in alphabetical order. The chapter where it's explained in most detail is in brackets.

### Alt text
A written description of an image, read aloud by screen readers and shown if the image can't load. Set with `alt="..."` in HTML, or the `[ ]` in Markdown. [10]

### API
"Application programming interface": a way for one program to talk to another. The site editor uses GitHub's API to read and save files. [11]

### Archetype
A starter file in `archetypes/` used by `hugo new content`. [3]

### Assets
Files in an `assets/` folder. Hugo only publishes them if a template uses them, and can process them first (resize, minify). Compare *static*. [10]

### `baseURL`
The site's full address, set in `hugo.toml` and overridden by the deploy workflow. [12]

### BEM
"Block, element, modifier": our pattern for CSS class names, like `.member`, `.member__role`, `.ver--current`. [8]

### Block
A named hole in `baseof.html` (`{{ block "main" . }}`) that page templates fill with `{{ define "main" }}`. [5]

### Branch
A separate line of work in Git. `main` is the live site; you make a branch to work on a change safely. [2]

### Build
Running Hugo to turn content and templates into the finished site. [1]

### Cache
A saved copy kept to avoid redoing work. Browsers cache files; Hugo caches resized images in `resources/`. [10]

### Cascade
Settings that apply to many pages at once, set in `hugo.toml` or front matter. [4]

### CDN
"Content delivery network": a service that hosts files on fast servers around the world. The editor's code comes from the `unpkg.com` CDN. [11]

### Clone
Download a copy of a Git repository, with its full history. [2]

### CMS
"Content management system": a tool for editing a site's content without editing code. Ours is Sveltia CMS. [11]

### Collection
In the site editor, one kind of content, like Blog or Members. Defined in `config.yml`. [11]

### Commit
A saved snapshot of changes in Git, with a message describing it. [2]

### Context, or "the dot"
`.` in a template: whatever the template is working with right now. Usually a page, but it changes inside `with` and `range`. [6]

### Contrast ratio
How different two colours are in brightness, like 4.5 : 1. Text needs enough contrast to be readable. [8]

### Cron
A way of writing a schedule, like `"17 9 * * *"` for 9:17 every day. [12]

### CSS
"Cascading Style Sheets": the language that controls how a page looks. [8]

### Custom property
A named value in CSS, like `--gold`, used with `var(--gold)`. Also called a *design token*. [8]

### Data attribute
A custom HTML attribute starting with `data-`, like `data-tags`, used to pass information to JavaScript. [9]

### Deploy
Publish a new version of the site. [12]

### Design token
See *custom property*.

### `dict`
A template function that bundles named values together, often to pass several things to a partial. [6]

### Draft
A page with `draft: true`, which isn't published. [4]

### Escaping
Converting characters like `<` into a safe form so they show as text instead of being treated as HTML. Hugo escapes everything it prints by default. [6]

### Event listener
JavaScript that waits for something to happen (a click, a key press) and then runs. [9]

### Fingerprint
A code added to a file name based on its contents, so browsers fetch a new copy when it changes. [10]

### Front matter
The YAML block between `---` lines at the top of a content file. [4]

### Git
The tool that records the history of every file. [2]

### GitHub
A website that hosts Git repositories so a team can share them. [1]

### GitHub Actions
GitHub's system for running workflows automatically, like building our site. [12]

### GitHub Pages
GitHub's free website hosting. [12]

### Goldmark
The part of Hugo that converts Markdown to HTML. [5]

### Hash
A short code calculated from a file's exact contents. Any change gives a different hash. Used for fingerprints and integrity checks. [10]

### HTML
"HyperText Markup Language": the language web pages are written in. [1]

### Hugo
The static site generator that builds our site. [1]

### Hugo Pipes
Hugo's way of processing files from `assets/` through functions like `minify` and `fingerprint`. [10]

### JavaScript
The programming language that runs in the browser and makes pages interactive. [9]

### Kind
Which of the five types a page is: `home`, `section`, `page`, `taxonomy` or `term`. [5]

### Lazy loading
Waiting to download an image until the visitor scrolls near it. [10]

### List page
A page that lists other pages, like `/blog/`. Made from a section's `_index.md`. [4]

### Live reload
`hugo server` refreshing your browser automatically when you save a file. [2]

### `localhost`
Your own computer, as a website address. `http://localhost:1313` is the site running on your computer. [2]

### Markdown
A simple way to write formatted text with symbols like `**bold**` and `## Heading`. [4]

### Media query
A CSS rule that only applies at certain screen sizes, like `@media (min-width: 48rem)`. [8]

### Merge
Combine the changes from one branch into another. [2]

### Minify
Remove spaces, line breaks and comments from code to make it smaller. [10]

### Mobile-first
Writing CSS for phones first, then adding rules for bigger screens. [8]

### OAuth
A system for letting an app access your account after you approve it, without giving it your password. [11]

### Page bundle
A folder containing an `index.md` and the page's own files, like a gallery album with its photos. [4]

### Params
Custom settings and fields. Site params are in `hugo.toml` (`site.Params`); page params are in front matter (`.Params`). [4]

### Partial
A reusable piece of template in `layouts/_partials/`, included with `{{ partial "name.html" . }}`. [5]

### Personal access token
A password-like code you create on GitHub to give one tool limited access to your account. [11]

### Pipe
`|` in a template: passes the value on its left as the last input to the function on its right. [6]

### Pull
Get the latest commits from GitHub onto your computer. [2]

### Pull request
A request to merge a branch into `main`, where others can review it first. [2]

### Push
Send your commits from your computer to GitHub. [2]

### `relURL`
A template function that turns a path into a link that works even if the site is in a sub-folder. [12]

### Render hook
A template that changes how Hugo turns part of Markdown (like images or links) into HTML. [5]

### Repository (repo)
A folder tracked by Git, with its full history. Ours is on GitHub. [1]

### Resource
Hugo's word for a file it can work with, like an image to resize. [10]

### Section
A top-level folder in `content/`, like `blog` or `events`. [4]

### Server
A computer that sends web pages to browsers. [1]

### Shortcode
A mini-template you can use inside Markdown, like `{{< callout >}}`. [13]

### Slug
The part of an address made from a page's name, like `intake-v1-to-v2`. [4]

### `srcset`
An HTML attribute that lists several sizes of the same image, so the browser can pick the best one. [10]

### Static (folder)
Files in a `static/` folder, copied to the site exactly as they are. Compare *assets*. [10]

### Static site
A website made of pre-built files, with no program running on the server. [1]

### Template
An HTML file with `{{ }}` instructions that Hugo fills in to make pages. [6]

### Theme
A package of templates, styles and scripts that controls how a site looks. Ours is `ver37974`. [1]

### TOML
"Tom's Obvious Minimal Language": a settings file format using `key = value` and `[sections]`. Used by `hugo.toml`. [4]

### Variable
A named value in a template, like `$name`. [6]

### WCAG
"Web Content Accessibility Guidelines": the international standard for making websites usable by everyone. [8]

### WebP
An image format that's usually smaller than JPEG at the same quality. [10]

### Widget
In the site editor, the kind of input a field uses: a text box, a switch, a date picker. [11]

### Workflow
A file in `.github/workflows/` that tells GitHub Actions what to do and when. [12]

### YAML
"YAML Ain't Markup Language": a data format using `key: value` and indentation. Used for front matter and `config.yml`. [4]
