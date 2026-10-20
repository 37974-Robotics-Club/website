// ver37974 theme scripts: navigation, filters, gallery lightbox, click-to-load video.
(function () {
  "use strict";

  // ---- Mobile menu ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // ---- Drop-downs ----
  var subButtons = document.querySelectorAll("[data-sub]");
  function closeAll(except) {
    subButtons.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      var s = document.getElementById(b.getAttribute("aria-controls"));
      if (s) s.classList.remove("is-open");
    });
  }
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
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav__item")) closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var openBtn = document.querySelector('[data-sub][aria-expanded="true"]');
      closeAll();
      if (openBtn) openBtn.focus();
    }
  });

  // ---- Filters (portfolio subsystems, member subteams, etc.) ----
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var target = document.getElementById(group.getAttribute("data-filter-group"));
    if (!target) return;
    var items = target.querySelectorAll("[data-tags]");
    group.querySelectorAll(".filter").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-value");
        group.querySelectorAll(".filter").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        items.forEach(function (item) {
          var tags = item.getAttribute("data-tags").split("|");
          item.hidden = value !== "all" && tags.indexOf(value) === -1;
        });
      });
    });
  });

  // ---- Gallery lightbox ----
  var box = document.querySelector(".lightbox");
  if (box && typeof box.showModal === "function") {
    var photos = Array.prototype.slice.call(document.querySelectorAll("[data-full]"));
    var img = box.querySelector("img");
    var cap = box.querySelector(".lightbox__caption");
    var index = 0;
    function show(i) {
      index = (i + photos.length) % photos.length;
      var p = photos[index];
      img.src = p.getAttribute("data-full");
      img.alt = p.querySelector("img").alt;
      cap.textContent = p.getAttribute("data-caption") || "";
    }
    photos.forEach(function (p, i) {
      p.addEventListener("click", function () { show(i); box.showModal(); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", function () { box.close(); });
    box.querySelector(".lightbox__prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox__inner")) box.close();
    });
  }

  // ---- Click-to-load YouTube (no tracking until someone presses play) ----
  document.querySelectorAll(".video__play").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-id");
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      frame.title = btn.getAttribute("data-title") || "Video";
      frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      btn.parentNode.replaceChild(frame, btn);
    });
  });
})();
