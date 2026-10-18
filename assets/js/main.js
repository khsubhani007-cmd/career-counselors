/* Career Counselors — interactions & animations */
(function () {
  "use strict";
  var WA_NUMBER = "923249499994";
  var root = document.documentElement;
  root.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    var payload = Object.assign({ event: event }, data || {});
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", event, data || {});
  }

  /* header state + scroll progress */
  var header = document.querySelector(".header");
  var bar = document.querySelector(".progress");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  var burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* split headline words */
  document.querySelectorAll(".split-words").forEach(function (el) {
    var html = el.innerHTML;
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var out = "";
    var i = 0;
    tmp.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { out += " "; return; }
          out += '<span class="w"><span style="transition-delay:' + (i++ * 0.06) + 's">' + part + "</span></span>";
        });
      } else {
        out += '<span class="w"><span style="transition-delay:' + (i++ * 0.06) + 's">' + node.outerHTML + "</span></span>";
      }
    });
    el.innerHTML = out;
  });

  /* reveal on scroll */
  var targets = document.querySelectorAll(".reveal, .split-words");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* counters */
  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduce) { el.textContent = prefix + end + suffix; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else counters.forEach(countUp);

  /* rotating word */
  document.querySelectorAll(".rotator").forEach(function (r) {
    var items = r.querySelectorAll("span");
    if (items.length < 2 || reduce) return;
    var idx = 0;
    setInterval(function () {
      items[idx].classList.remove("on");
      idx = (idx + 1) % items.length;
      items[idx].classList.add("on");
    }, 2200);
  });

  /* pointer effects (desktop only) */
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (fine && !reduce) {
    var glow = document.querySelector(".cursor-glow");
    if (glow) {
      window.addEventListener("pointermove", function (e) {
        glow.style.opacity = "1";
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }, { passive: true });
    }
    document.querySelectorAll(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--bx", (e.clientX - r.left - r.width / 2) * 0.25 + "px");
        b.style.setProperty("--by", (e.clientY - r.top - r.height / 2) * 0.35 + "px");
      });
      b.addEventListener("pointerleave", function () {
        b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px");
      });
    });
    document.querySelectorAll(".tilt").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = "perspective(900px) rotateY(" + x * 8 + "deg) rotateX(" + -y * 8 + "deg) translateY(-4px)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  /* WhatsApp click tracking */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.addEventListener("click", function () {
      track("whatsapp_click", { location: a.getAttribute("data-loc") || "link", page: location.pathname });
    });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () { track("phone_click", { page: location.pathname }); });
  });

  /* lead form -> WhatsApp */
  document.querySelectorAll("form.lead").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = new FormData(form);
      var name = (f.get("name") || "").toString().trim();
      var phone = (f.get("phone") || "").toString().trim();
      var errEl = form.querySelector(".err");
      if (name.length < 2) { errEl.textContent = "Please enter your full name."; form.querySelector('[name="name"]').focus(); return; }
      if (!/^[+\d][\d\s-]{9,15}$/.test(phone)) { errEl.textContent = "Please enter a valid phone / WhatsApp number."; form.querySelector('[name="phone"]').focus(); return; }
      errEl.textContent = "";
      var lines = [
        "Assalam o Alaikum Career Counselors,",
        "I want a free study abroad assessment.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "City: " + (f.get("city") || "-"),
        "Country: " + (f.get("country") || "-"),
        "Last qualification: " + (f.get("qualification") || "-"),
        "IELTS: " + (f.get("ielts") || "-"),
        "Intake: " + (f.get("intake") || "-")
      ];
      track("generate_lead", { country: f.get("country") || "", page: location.pathname });
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
      form.reset();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var old = btn.innerHTML;
        btn.innerHTML = "Opening WhatsApp…";
        setTimeout(function () { btn.innerHTML = old; }, 2600);
      }
    });
  });

  /* year */
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();

/* article category filter */
(function () {
  var chips = document.querySelectorAll(".chip[data-filter]");
  if (!chips.length) return;
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.classList.remove("on"); });
      c.classList.add("on");
      var f = c.getAttribute("data-filter");
      document.querySelectorAll(".art-grid .upd").forEach(function (card) {
        card.hidden = !(f === "all" || card.getAttribute("data-cat") === f);
      });
    });
  });
})();

/* articles: search + filter, reading progress, TOC scrollspy, copy link */
(function () {
  var grid = document.getElementById("art-grid");
  if (grid) {
    var input = document.getElementById("art-search"), noRes = document.getElementById("no-res");
    var chips = document.querySelectorAll(".chip[data-filter]"), cat = "all";
    function apply() {
      var q = (input && input.value || "").trim().toLowerCase(), shown = 0;
      grid.querySelectorAll(".acard").forEach(function (c) {
        var ok = (cat === "all" || c.getAttribute("data-cat") === cat) && (!q || c.getAttribute("data-text").indexOf(q) > -1);
        c.hidden = !ok; if (ok) { shown++; c.classList.add("in"); }
      });
      if (noRes) noRes.hidden = shown > 0;
    }
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("on"); }); ch.classList.add("on");
        cat = ch.getAttribute("data-filter"); apply();
      });
    });
    if (input) input.addEventListener("input", function () {
      apply();
      if (input.value && window.scrollY < 200) document.getElementById("all").scrollIntoView({ behavior: "smooth" });
    });
  }
  var bar = document.querySelector(".read-progress"), body = document.querySelector(".prose-a");
  if (bar && body) {
    window.addEventListener("scroll", function () {
      var r = body.getBoundingClientRect(), total = r.height - window.innerHeight * 0.5;
      var p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      bar.style.width = (p * 100) + "%";
    }, { passive: true });
  }
  var links = document.querySelectorAll(".toc-d a");
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var l = map[en.target.id]; if (l) l.classList.add("active");
        }
      });
    }, { rootMargin: "-90px 0px -65% 0px" });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }
  document.querySelectorAll(".copy-link").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = b.getAttribute("data-url");
      function done() { b.classList.add("copied"); setTimeout(function () { b.classList.remove("copied"); }, 1600); }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
    });
  });
})();
