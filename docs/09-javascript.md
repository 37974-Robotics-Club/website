# 9. JavaScript: the interactive parts

**You'll learn:** what each part of `main.js` does, line by line, and the ideas behind it: finding elements, listening for clicks, and keeping things accessible to keyboard and screen reader users.

HTML is the content, CSS is the look, and **JavaScript** is behaviour: what happens when you click or press a key. Our site uses very little JavaScript, on purpose. Everything important, like text, images and links, works without it. JavaScript only adds conveniences.

All of it is in `themes/ver37974/assets/js/main.js`, which has five parts:

| Part | What it does | Where you see it |
| --- | --- | --- |
| Mobile menu | Opens and closes the menu on small screens | The **Menu** button on a phone |
| Drop-downs | Opens the Team, Our work, News and Sponsors menus | The header |
| Filters | Shows only matching items when you click a button | Members, Engineering portfolio |
| Lightbox | Shows a photo large, with next and previous | Gallery albums |
| Click-to-load video | Loads a YouTube player only when you press play | Gallery albums with videos |

## How the script is loaded

At the bottom of `baseof.html`:

<!-- source: themes/ver37974/layouts/baseof.html -->
```go-html-template
  {{ $js := resources.Get "js/main.js" | minify | fingerprint }}
  <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

`defer` tells the browser: "download this while you build the page, but don't run it until the page is ready." That matters, because the script looks for elements on the page. If it ran before they existed, it would find nothing.

## The wrapper

<!-- source: themes/ver37974/assets/js/main.js -->
```js
(function () {
  "use strict";
```

The whole file is wrapped in `(function () { ... })();`, a function that runs immediately. Variables made inside it, like `toggle` and `nav`, stay inside it, so they can't clash with any other script on the page. `"use strict"` turns on stricter rules that catch common mistakes, like using a variable you forgot to create.

## Part 1: the mobile menu

<!-- source: themes/ver37974/assets/js/main.js -->
```js
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }
```

| Line | What it does |
| --- | --- |
| `document.querySelector(".nav-toggle")` | Find the first element with class `nav-toggle`: the Menu button. It uses the same selectors as CSS |
| `document.getElementById("site-nav")` | Find the element with `id="site-nav"`: the menu |
| `if (toggle && nav)` | Only continue if both were found. Without this check, a page missing either would crash the whole script |
| `addEventListener("click", function () { ... })` | "When this is clicked, run this function." This is called an **event listener** |
| `nav.classList.toggle("is-open")` | Add the class `is-open` if it isn't there, remove it if it is. Returns `true` if it's now there |
| `setAttribute("aria-expanded", ...)` | Tell screen readers whether the menu is open |
| `toggle.textContent = open ? "Close" : "Menu"` | Change the button's text. `a ? b : c` means "if a, then b, otherwise c" |

The JavaScript doesn't show or hide anything itself. It just adds or removes a class. The **CSS** decides what that class means:

<!-- source: themes/ver37974/assets/css/main.css -->
```css
  .nav.is-open { display: flex; }
```

This is a good habit: **JavaScript changes state, CSS decides how state looks.** If you want the menu to slide in instead of appearing, you only change CSS.

## Part 2: the drop-down menus

The header template makes each drop-down button like this (from `header.html`):

```html
<button class="nav__link" type="button" data-sub aria-expanded="false" aria-controls="sub-0">Team ...</button>
<ul class="nav__sub" id="sub-0"> ...links... </ul>
```

`aria-controls="sub-0"` says which list the button opens. The script uses that same attribute to find the list:

<!-- source: themes/ver37974/assets/js/main.js -->
```js
  subButtons.forEach(function (btn) {
    var sub = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.getAttribute("aria-expanded") !== "true";
      closeAll(btn);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      sub.classList.toggle("is-open", open);
    });
  });
```

When you click a button, it works out whether it should now be open, closes every *other* drop-down (`closeAll(btn)`), and opens or closes its own.

Two more listeners finish the job:

- **Clicking anywhere else closes all drop-downs.** `e.target.closest(".nav__item")` checks whether the click was inside a menu item. If not, `closeAll()`.
- **Pressing Escape closes them** and puts the keyboard focus back on the button that was open, so keyboard users don't lose their place.

Why is `e.stopPropagation()` there? A click on the button would otherwise also "bubble up" to the document, where the "click anywhere else" listener would see it. `stopPropagation` stops it at the button.

## Part 3: filters

The filter buttons and the items they filter are connected by **data attributes**: custom attributes starting with `data-`, which the templates write and the script reads.

```html
<div class="filters" data-filter-group="journal">
  <button class="filter" data-value="all" aria-pressed="true">All entries</button>
  <button class="filter" data-value="Intake" aria-pressed="false">Intake</button>
</div>
<ul id="journal">
  <li data-tags="Intake">...</li>
  <li data-tags="Programming">...</li>
</ul>
```

<!-- source: themes/ver37974/assets/js/main.js -->
```js
        items.forEach(function (item) {
          var tags = item.getAttribute("data-tags").split("|");
          item.hidden = value !== "all" && tags.indexOf(value) === -1;
        });
```

For each item, split its tags on `|` into a list (a member can be in `Build|Drive team`). Then hide it if a specific filter is chosen **and** this item's tags don't include it. `indexOf` returns `-1` when something isn't in the list.

The same code runs the member subteam filter and the portfolio subsystem filter. Any page can have a filter: add `data-filter-group="some-id"` to a group of `.filter` buttons, `id="some-id"` to the list, and `data-tags` to each item.

`aria-pressed` tells screen readers which filter button is currently selected, and the CSS uses it too: `.filter[aria-pressed="true"]` fills the selected button with wheat.

## Part 4: the photo viewer (lightbox)

The album template writes one hidden `<dialog>` element, plus a button for each photo that carries the big image's address in `data-full` and its caption in `data-caption`.

<!-- source: themes/ver37974/assets/js/main.js -->
```js
    function show(i) {
      index = (i + photos.length) % photos.length;
      var p = photos[index];
      img.src = p.getAttribute("data-full");
      img.alt = p.querySelector("img").alt;
      cap.textContent = p.getAttribute("data-caption") || "";
    }
```

`show(i)` puts photo number `i` into the dialog. The first line is a neat trick: `%` (remainder) makes the numbers **wrap around**. With 6 photos, going "next" from photo 5 gives `(6 + 6) % 6 = 0`, back to the first. Going "previous" from photo 0 gives `(-1 + 6) % 6 = 5`, the last.

`box.showModal()` opens the dialog. A `<dialog>` opened this way is built into the browser: it darkens the page behind it, traps the keyboard focus inside, and closes with Escape, without any extra code from us. The script adds the arrow keys and the close, previous and next buttons.

`if (box && typeof box.showModal === "function")` checks that the page has a lightbox *and* that the browser supports dialogs. If not, nothing breaks; clicking a photo just doesn't open the viewer.

## Part 5: click-to-load video

Embedding a YouTube player normally makes every visitor's browser contact YouTube as soon as the page opens, which sets tracking cookies, even if they never watch. For a site with young people, we'd rather not.

So the album template shows a thumbnail image and a "Play video" button instead. Only when someone clicks it does the script build the real player:

<!-- source: themes/ver37974/assets/js/main.js -->
```js
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
```

and swaps it in with `btn.parentNode.replaceChild(frame, btn)`. It also uses `youtube-nocookie.com`, YouTube's privacy-enhanced address.

> **Be precise about what this does:** the thumbnail picture is still loaded from YouTube's image server (`i.ytimg.com`) when the page opens. What waits for the click is the YouTube player itself, with its scripts and cookies.

## Debugging JavaScript

Open the developer tools (**F12**) and click the **Console** tab. Any error in the script shows up there in red, with the file and line number.

You can also try things live in the console. On the members page, type:

```js
document.querySelectorAll(".member").length
```

and press Enter. It tells you how many member cards are on the page.

To see what your own code is doing, add a line like `console.log("filter clicked", value);` and watch the console. Remove it before committing.

## Try it

1. On the members page, open the console and run `document.querySelector(".nav-toggle").click()`. Then shrink the window to phone size. What happened?
2. Change `toggle.textContent = open ? "Close" : "Menu";` so it says "Hide" instead of "Close". Check it on a phone-sized window, then change it back.
3. Add a filter to the outreach page so you can filter by `location`. You'll need to edit `outreach/list.html` (buttons, an `id` on the list, and `data-tags` on each item) but **not** `main.js`. Why not?

## Check your understanding

1. Why is the script loaded with `defer`?
2. The mobile menu is shown by the CSS rule `.nav.is-open { display: flex; }`. What is JavaScript's part?
3. What does `aria-expanded` do, and who uses it?
4. In the lightbox, there are 4 photos and you're on photo 0. You press "previous". Which photo do you see, and why?

<details>
<summary>Answers</summary>

1. So it runs after the page has been built. The script looks for elements on the page, which have to exist first.
2. It adds or removes the `is-open` class when the button is clicked, and updates `aria-expanded` and the button text.
3. It tells assistive technology, like screen readers, whether a menu or drop-down is open. The CSS also uses it to rotate the drop-down arrow.
4. Photo 3, the last one. `(0 - 1 + 4) % 4 = 3`. The remainder makes the numbering wrap around.

**Try it, question 3:** because the filter code works for any filter group on any page. It only needs the right data attributes and ids, which come from the template.

</details>

Next: [10. Images, fonts and other assets](10-images-and-assets.md)
