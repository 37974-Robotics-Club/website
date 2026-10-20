# The team website: a learning guide

This guide teaches you how our website works, from the first idea ("what even is a static site?") down to every file in the theme. By the end you should be able to change anything on the site yourself, and explain why it works.

It's written for team members. You don't need to know any programming to start. Each chapter builds on the one before, so read them in order the first time.

## Pick your path

Not everyone needs everything. Start with the path that matches what you want to do, then keep going when you're ready.

| I want to... | Read these | Time |
| --- | --- | --- |
| **Post announcements, blog posts, photos or journal entries** | [1](01-how-the-website-works.md), [11](11-site-editor.md) | 1 hour |
| **Change text, menus or settings in the code** | Above, plus [2](02-setting-up-your-computer.md), [3](03-project-tour.md), [4](04-content.md) | 1 afternoon |
| **Change how the site looks or add new features** | All of the above, plus [5](05-how-hugo-builds-a-page.md) to [10](10-images-and-assets.md), then [13](13-recipes.md) | A few weeks, a bit at a time |
| **Look after the whole thing** (website lead) | Everything, including [12](12-publishing.md) and [14](14-troubleshooting.md) | Ongoing |

## Chapters

1. [How the website works](01-how-the-website-works.md): static sites, Hugo, GitHub, and how a change gets from your keyboard to the internet
2. [Setting up your computer](02-setting-up-your-computer.md): install the tools, run the site locally, make your first change, and use Git
3. [A tour of the project](03-project-tour.md): every folder and file, and what each one is for
4. [Content: Markdown and front matter](04-content.md): how pages are written, and the fields each section uses
5. [How Hugo builds a page](05-how-hugo-builds-a-page.md): page kinds, which template renders which page, and how the theme fits in
6. [Templates](06-templates.md): the template language, using real code from our theme
7. [Follow one field all the way through](07-follow-a-field.md): trace a member's role from the editor to the screen
8. [CSS: how the site looks](08-css.md): design tokens, layout, components, and responsive design
9. [JavaScript: the interactive parts](09-javascript.md): the menu, filters, photo viewer and videos
10. [Images, fonts and other assets](10-images-and-assets.md): `static` vs `assets`, image processing, and Hugo Pipes
11. [The site editor (Sveltia CMS)](11-site-editor.md): how to use it, how it works, and how to change it
12. [Publishing with GitHub Actions](12-publishing.md): the automatic build and deploy
13. [Recipes: guided projects](13-recipes.md): step-by-step projects that change the site for real
14. [Troubleshooting](14-troubleshooting.md): error messages, what they mean, and how to fix them
15. [Glossary](15-glossary.md): every technical word in this guide

## How to use this guide

- **Type the examples yourself.** Copying and pasting teaches your clipboard, not you.
- **Break things on purpose.** Delete a line, save, and read the error. It's the fastest way to learn what each piece does. That's what Git is for: you can always undo.
- **Answer the "Check your understanding" questions** at the end of each chapter before opening the answers.
- **Use AI tools as a tutor, not a replacement.** It's fine to ask Claude or another assistant to explain an error or a line of code. Before you paste in what it suggests, make sure you can explain every line. If you can't, ask it to explain until you can. You're the one who has to fix it at 10 pm before a competition.

## Keep this guide up to date

This guide lives in the same repository as the website, in the `docs/` folder. When you change how the site works, update the chapter that explains it in the same commit. A guide that's wrong is worse than no guide at all.
