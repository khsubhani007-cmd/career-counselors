/* Career Counselors — animated dotted globe with flight arcs from Lahore */
(function () {
  "use strict";
  var canvas = document.getElementById("globe");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEG = Math.PI / 180;

  var ORIGIN = { name: "Lahore", lat: 31.52, lon: 74.36 };
  var CITIES = [
    { name: "Italy", flag: "🇮🇹", lat: 41.9, lon: 12.5, dx: -78, dy: 16 },
    { name: "UK", flag: "🇬🇧", lat: 51.5, lon: -0.13, dx: -20, dy: -40 },
    { name: "Ireland", flag: "🇮🇪", lat: 53.35, lon: -6.26, dx: -96, dy: -4 },
    { name: "Hungary", flag: "🇭🇺", lat: 47.5, lon: 19.04, dx: 14, dy: -38 },
    { name: "Cyprus", flag: "🇨🇾", lat: 35.17, lon: 33.36, dx: -30, dy: 18 }
  ];

  function vec(lat, lon) {
    var p = lat * DEG, l = lon * DEG;
    return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
  }
  // Fibonacci sphere dots
  var DOTS = [];
  var N = 1400;
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
    DOTS.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  function slerp(a, b, t) {
    var d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
    var s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  }
  var o = vec(ORIGIN.lat, ORIGIN.lon);
  var ARCS = CITIES.map(function (c, idx) {
    var b = vec(c.lat, c.lon), pts = [];
    for (var s = 0; s <= 60; s++) {
      var t = s / 60, v = slerp(o, b, t), lift = 1 + 0.3 * Math.sin(Math.PI * t);
      pts.push([v[0] * lift, v[1] * lift, v[2] * lift]);
    }
    return { city: c, end: b, pts: pts, offset: idx * 0.19, speed: 0.11 + idx * 0.012 };
  });

  var W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, H) * 0.41; cx = W / 2; cy = H / 2;
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);

  // view: centred between Pakistan and Europe
  var baseLon = 34, baseLat = 34, yaw = baseLon * DEG, pitch = baseLat * DEG;
  var px = 0, py = 0, tx = 0, ty = 0;
  canvas.parentElement.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  canvas.parentElement.addEventListener("pointerleave", function () { tx = 0; ty = 0; });

  function rot(v) {
    var cy_ = Math.cos(-yaw), sy = Math.sin(-yaw);
    var x = v[0] * cy_ + v[2] * sy, z = -v[0] * sy + v[2] * cy_, y = v[1];
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    return [x, y * cp - z * sp, y * sp + z * cp];
  }
  function proj(v) { return [cx + R * v[0], cy - R * v[1], v[2]]; }

  function frame(time) {
    var t = (time || 0) / 1000;
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    yaw = (baseLon + Math.sin(t * 0.18) * 16 + px * 12) * DEG;
    pitch = (baseLat + py * 8) * DEG;
    ctx.clearRect(0, 0, W, H);

    // halo
    var g = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.2);
    g.addColorStop(0, "rgba(22,82,240,0.18)"); g.addColorStop(1, "rgba(22,82,240,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2); ctx.fill();

    // sphere body
    var body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, "#ffffff"); body.addColorStop(0.5, "#dce7ff"); body.addColorStop(1, "#a9c3ff");
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(10,36,99,0.12)"; ctx.lineWidth = 1; ctx.stroke();

    // dots
    for (var i = 0; i < DOTS.length; i++) {
      var p = rot(DOTS[i]);
      if (p[2] < 0) continue;
      var s = proj(p), a = 0.22 + p[2] * 0.7;
      ctx.fillStyle = "rgba(10,36,99," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(s[0], s[1], 0.6 + p[2] * 1.15, 0, Math.PI * 2); ctx.fill();
    }

    // arcs
    ARCS.forEach(function (arc) {
      var prog = reduce ? 1 : ((t * arc.speed + arc.offset) % 1);
      var drawTo = Math.min(1, prog * 1.6);
      var fade = prog > 0.8 ? 1 - (prog - 0.8) / 0.2 : 1;
      var n = Math.floor(drawTo * (arc.pts.length - 1));
      ctx.lineWidth = 2; ctx.lineCap = "round";
      for (var k = 1; k <= n; k++) {
        var a1 = rot(arc.pts[k - 1]), a2 = rot(arc.pts[k]);
        if (a1[2] < -0.05 && a2[2] < -0.05) continue;
        var s1 = proj(a1), s2 = proj(a2), f = k / arc.pts.length;
        ctx.strokeStyle = "rgba(" + Math.round(22 + 223 * f) + "," + Math.round(82 + 83 * f) + "," + Math.round(240 - 204 * f) + "," + (0.9 * fade).toFixed(2) + ")";
        ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.lineTo(s2[0], s2[1]); ctx.stroke();
      }
      // travelling comet
      if (!reduce && drawTo < 1) {
        var head = proj(rot(arc.pts[n]));
        var cg = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 9);
        cg.addColorStop(0, "rgba(245,165,36,1)"); cg.addColorStop(1, "rgba(245,165,36,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(head[0], head[1], 9, 0, Math.PI * 2); ctx.fill();
      }
      // destination pulse + label
      var e = rot(arc.end);
      if (e[2] > 0.02) {
        var se = proj(e), pulse = reduce ? 0.5 : (t * 0.9 + arc.offset * 3) % 1;
        ctx.strokeStyle = "rgba(22,82,240," + (0.55 * (1 - pulse)).toFixed(2) + ")"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(se[0], se[1], 4 + pulse * 14, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#1652f0"; ctx.beginPath(); ctx.arc(se[0], se[1], 3.6, 0, Math.PI * 2); ctx.fill();
        var label = arc.city.flag + " " + arc.city.name;
        ctx.font = "600 12px Inter, system-ui, sans-serif";
        var tw = ctx.measureText(label).width + 16, lx = se[0] + arc.city.dx, ly = se[1] + arc.city.dy - 11;
        ctx.globalAlpha = Math.min(1, e[2] * 3);
        ctx.strokeStyle = "rgba(10,36,99,0.25)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(se[0], se[1]); ctx.lineTo(lx + (arc.city.dx < 0 ? tw : 0), ly + 11); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.shadowColor = "rgba(10,36,99,0.18)"; ctx.shadowBlur = 10;
        roundRect(lx, ly, tw, 22, 11); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = "#0a2463"; ctx.fillText(label, lx + 8, ly + 15);
        ctx.globalAlpha = 1;
      }
    });

    // origin: Lahore
    var oo = rot(o);
    if (oo[2] > 0) {
      var so = proj(oo), op = reduce ? 0.5 : (t * 0.7) % 1;
      ctx.fillStyle = "rgba(245,165,36," + (0.35 * (1 - op)).toFixed(2) + ")";
      ctx.beginPath(); ctx.arc(so[0], so[1], 6 + op * 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f5a524"; ctx.beginPath(); ctx.arc(so[0], so[1], 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = "700 12px Inter, system-ui, sans-serif";
      var lab = "🇵🇰 Lahore", lw = ctx.measureText(lab).width + 16;
      ctx.fillStyle = "#0a2463"; roundRect(so[0] - lw / 2, so[1] + 12, lw, 22, 11); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.fillText(lab, so[0] - lw / 2 + 8, so[1] + 27);
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  // pause when hero is off-screen
  var running = true;
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting;
      if (vis && !running) { running = true; requestAnimationFrame(frame); }
      running = vis;
    }).observe(canvas);
  }
  var _frame = frame;
  frame = function (ts) { if (running || reduce) _frame(ts); };
  requestAnimationFrame(frame);
})();
