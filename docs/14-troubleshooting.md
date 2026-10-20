# 14. Troubleshooting

**You'll learn:** how to read Hugo's error messages, and how to fix the problems you're most likely to run into.

Every error message below is real: we made each mistake on purpose and copied what Hugo said.

## How to read a Hugo error

Hugo errors are long, but they always follow the same pattern. Here's one:

```text
Error: error building site: render: failed to render pages: render of "content/members/_index.md" failed:
"themes/ver37974/layouts/members/list.html:20:30": execute of template failed: ...
error calling partial: partial "member_card.html" not found
```

Read it in three passes:

1. **The end tells you what went wrong:** `partial "member_card.html" not found`.
2. **The file and numbers tell you where:** `members/list.html:20:30` means line 20, column (character) 30.
3. **The beginning tells you what Hugo was doing:** rendering the page from `content/members/_index.md`.

In VS Code, press **Ctrl+G** (**Cmd+G** on a Mac) and type the line number to jump there.

When an error mentions two template files, the **last** one is usually where the mistake is. The first is just the template that called it.

## Errors in content and front matter

### `mapping key "title" already defined`

```text
"content/_index.md:6:1": [5:1] mapping key "title" already defined at [1:1]
```

**Cause:** the same key appears twice at the same level. Usually it's an indentation mistake: a line that should be indented under a group (like `hero:`) isn't, so YAML thinks it belongs to the page itself.

**Fix:** check the indentation of the line named in the error.

### `mapping value is not allowed in this context`

```text
"content/portfolio/kickoff-strategy.md:2:8": [1:8] mapping value is not allowed in this context
```

**Cause:** a value contains a colon followed by a space, like `title: Kickoff: reading the manual`. YAML thinks the second colon starts a new key.

**Fix:** put the value in quotes: `title: "Kickoff: reading the manual"`.

### `found character that cannot start any token`

```text
"content/_index.md:4:1": [3:1] found character '	' that cannot start any token
```

**Cause:** a **tab** was used for indentation. YAML only allows spaces. (The `'	'` in the message is the tab character.)

**Fix:** replace the tab with spaces. In VS Code, the status bar at the bottom shows "Spaces: 2" or "Tab Size"; click it and choose **Indent Using Spaces**, then **Convert Indentation to Spaces** from the command palette (**Ctrl+Shift+P**).

### `unknown kind "..." in front matter`

```text
"content/events/build-day.md:1:1": unknown kind "Team event" in front matter
```

**Cause:** you used one of Hugo's own field names, here `kind`, for something else. See [chapter 4](04-content.md#hugos-built-in-fields) for the list.

**Fix:** rename the field (we use `event_type`), in the content files, the templates and `config.yml`.

## Errors in templates

### `unexpected EOF`

```text
"themes/ver37974/layouts/_partials/member-card.html:17:1": parse of template failed: template: _partials/member-card.html:17: unexpected EOF
```

**Cause:** "EOF" means *end of file*. Hugo reached the end of the file while still expecting something, almost always a missing `{{ end }}`. Every `if`, `with`, `range` and `define` needs one.

**Fix:** count them. Starting from the top, every `{{ if`, `{{ with`, `{{ range` and `{{ define` should have a matching `{{ end }}`. VS Code's bracket highlighting helps.

### `partial "..." not found`

```text
error calling partial: partial "member_card.html" not found
```

**Cause:** a typo in the partial's name (here, an underscore instead of a hyphen), or the file is in the wrong folder. Partials must be in `layouts/_partials/`.

**Fix:** compare the name in the error with the file name exactly.

### `can't evaluate field Title in type string`

```text
"themes/ver37974/layouts/_partials/member-card.html:12:52": ... at <.Title>: can't evaluate field Title in type string
```

**Cause:** the most common template mistake there is. You used `.Title` where the dot isn't a page. Here it was inside `{{ with .Params.role }}`, where the dot is the role, which is a piece of text (a "string"), and text doesn't have a title.

**Fix:** use `$.Title` to reach the page the template started with, or save it in a variable before the `with` ([chapter 6](06-templates.md#with-if-it-exists-use-it)).

### `wrong number of args for return`

```text
executing "_partials/link.html" at <return>: wrong number of args for return: want 0 got 1
```

**Cause:** `return` was used inside an `if`, `with` or `range` block.

**Fix:** set a variable inside the block, and put a single `return` as the last line of the file. See `link.html` for an example.

## Problems without an error message

These are harder, because Hugo doesn't complain. Something just doesn't appear.

### A page doesn't show up

Work through this list:

1. **Is it a draft?** Remove `draft: true`.
2. **Is its `date` in the future?** Hugo hides those. For events, use `start` for the event's date.
3. **Is it in the right folder?** A blog post must be in `content/blog/`.
4. **Is the file name right?** It must end in `.md`. In a bundle, the file is `index.md`, not `_index.md`.
5. **Is the front matter valid?** It needs `---` on the first line and another `---` to close it.
6. **Is it a member, sponsor or other section that has no single pages?** Those only appear on their list page, by design (the `[[cascade]]` in `hugo.toml`).

### A field doesn't show up

1. **Does a template use it?** Search the `layouts/` folder for `.Params.your_field`. If nothing uses it, nothing shows it ([chapter 7](07-follow-a-field.md)).
2. **Is it spelled the same everywhere?** `favourite_part` and `favorite_part` are different fields.
3. **For a member's photo:** is `photo_consent: true`? The photo is hidden without it, on purpose.

### An image works on my computer but not on the live site

**Cause:** the capitalization of the file name doesn't match. Windows and macOS usually treat `Robot.jpg` and `robot.jpg` as the same file. GitHub's computers, which run Linux, don't. So `photo: /images/uploads/robot.jpg` finds `Robot.jpg` on your laptop, and nothing on the live site.

**Fix:** use lowercase file names, always, and make the front matter match exactly. You'll see a broken image icon, but no error, so check the live site after adding images.

### My CSS change isn't showing

1. **Is `hugo server` running?** Check the terminal for errors.
2. **Is another rule winning?** Right-click > **Inspect**, and look for your rule in the Styles panel. If it's crossed out, see [chapter 8](08-css.md#when-a-rule-doesnt-seem-to-work).
3. **Did you edit the right file?** If there's an `assets/css/custom.css` in the project, it loads after the theme's `main.css` and may be overriding you.

### My change is on GitHub, but not on the live site

1. **Wait two minutes.** The build takes time.
2. **Check the Actions tab.** A red ✗ means the build failed, and the old site is still up ([chapter 12](12-publishing.md#when-a-build-fails)).
3. **Force a fresh copy:** your browser may be showing a saved copy. Press **Ctrl+Shift+R** (**Cmd+Shift+R** on a Mac).

### Old images keep showing after I replaced a photo

Delete the `resources/` folder in the project and restart `hugo server`. It holds Hugo's cache of resized images.

## Tool problems

### `hugo: command not found`

Hugo isn't installed, or your terminal can't find it.

- Close and reopen the terminal (and VS Code) after installing. Installers often only take effect in new windows.
- Run `hugo version`. If it works in a normal terminal but not in VS Code, restart VS Code.
- On Windows, if you installed Hugo by downloading it, the folder containing `hugo.exe` must be on your `PATH`. Using `winget` avoids this.

### `hugo version` doesn't say "extended"

Uninstall it and install the extended edition ([chapter 2](02-setting-up-your-computer.md#install-them)). Without it, image conversion to WebP fails.

### Port 1313 is already in use

Another `hugo server` is still running, maybe in another terminal. Stop it with **Ctrl+C**, or run this one on another port: `hugo server --port 1314`.

### `git push` is refused

```text
! [rejected]        main -> main (fetch first)
hint: Updates were rejected because the remote contains work that you do not have locally.
```

Someone (or the site editor) committed since you last pulled. Run `git pull`, then `git push` again.

### `git pull` says there's a conflict

You and someone else changed the same lines of the same file. Git marks the conflict in the file:

```text
<<<<<<< HEAD
title: Your version
=======
title: Their version
>>>>>>> origin/main
```

1. Open the file. VS Code shows buttons above the conflict: **Accept Current**, **Accept Incoming** or **Accept Both**.
2. Make the file say what it should, and delete all the `<<<<<<<`, `=======` and `>>>>>>>` lines.
3. Save, then `git add` the file and `git commit`.

If you're unsure, stop and ask. `git merge --abort` undoes the attempt and puts things back how they were.

## Site editor problems

### I can't sign in with my token

- **It may have expired.** Tokens have an expiry date. Make a new one.
- **It may not have the right access.** It needs this repository, with **Contents: Read and write** ([chapter 11](11-site-editor.md#signing-in)).
- **Check you copied all of it**, with no spaces at the start or end.

### The editor shows an error about the configuration

There's a mistake in `static/admin/config.yml`, usually indentation. The editor's message names the problem. Fix it on your computer and test with the local workflow ([chapter 11](11-site-editor.md#testing-editor-changes-on-your-own-computer)) before committing.

### I saved, but the editor says it failed

Someone may have changed the same entry at the same time. Copy your text somewhere safe, reload the editor, and make your change again.

## Still stuck?

1. Read the error again, slowly, end first.
2. Undo your last change (**Ctrl+Z**, or `git diff` to see what you changed) and check the error goes away. Then redo it one small piece at a time.
3. Search the error message (without your file names) along with "Hugo". Someone has almost always hit it before. The [Hugo forum](https://discourse.gohugo.io/) is very helpful.
4. Ask an AI assistant to *explain* the error, and make sure you understand the explanation before changing anything.
5. Ask the website lead or a mentor. Show them the full error and what you've already tried.

Next: [15. Glossary](15-glossary.md)
