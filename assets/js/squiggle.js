// Workshop Bay 01: draw a path, a small robot follows it with pure pursuit.
(function () {
  var canvas = document.getElementById('squiggle');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var hint = document.getElementById('squiggle-hint');
  var C;
  function readColors() {
    var css = getComputedStyle(document.documentElement);
    var color = function (name, fallback) { return css.getPropertyValue(name).trim() || fallback; };
    C = {
      accent: color('--color-accent', '#ec3013'),
      warm: color('--color-warm', '#f0b45a'),
      text: color('--color-text', '#f5efe6')
    };
  }
  readColors();
  document.addEventListener('themechange', function () { readColors(); draw(); });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LOOKAHEAD = 34;   // px ahead on the path to steer toward
  var MAX_SPEED = 220;  // px/s
  var MAX_TURN = 5;     // rad/s
  var MIN_STEP = 4;     // px between recorded path points

  var w = 0, h = 0;
  var path = [], trail = [], target = null, idx = 0;
  var drawing = false, running = false;
  var robot = { x: 0, y: 0, th: 0 };
  var last = 0;

  function resize() {
    var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    var first = !w;
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (first) { robot.x = 48; robot.y = h / 2; robot.th = 0; }
    robot.x = Math.min(robot.x, w); robot.y = Math.min(robot.y, h);
    draw();
  }

  function point(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  canvas.addEventListener('pointerdown', function (e) {
    canvas.setPointerCapture(e.pointerId);
    drawing = true; running = false;
    path = [point(e)]; trail = []; idx = 0; target = null;
    hint.hidden = true;
    draw();
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drawing) return;
    var p = point(e), q = path[path.length - 1];
    if (Math.hypot(p.x - q.x, p.y - q.y) >= MIN_STEP) { path.push(p); draw(); }
  });
  function finish() {
    if (!drawing) return;
    drawing = false;
    if (path.length < 2) { path = []; draw(); return; }
    trail = [{ x: robot.x, y: robot.y }];
    start();
  }
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);

  document.getElementById('squiggle-clear').addEventListener('click', function () {
    path = []; trail = []; target = null; running = false; hint.hidden = false; draw();
  });

  function start() {
    running = true; last = performance.now();
    requestAnimationFrame(step);
  }

  function step(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    // Reduced motion: jump along the path instead of animating.
    if (reduceMotion) dt = 1;

    // Advance the lookahead index along the path.
    while (idx < path.length - 1 && Math.hypot(path[idx].x - robot.x, path[idx].y - robot.y) < LOOKAHEAD) idx++;
    target = path[idx];
    var dx = target.x - robot.x, dy = target.y - robot.y, dist = Math.hypot(dx, dy);
    if (idx === path.length - 1 && dist < 3) { running = false; target = null; draw(); return; }

    var err = Math.atan2(dy, dx) - robot.th;
    err = Math.atan2(Math.sin(err), Math.cos(err));
    var turn = Math.max(-MAX_TURN * dt, Math.min(MAX_TURN * dt, err));
    if (reduceMotion) turn = err;
    robot.th += turn;
    var v = MAX_SPEED * (1 - 0.6 * Math.min(1, Math.abs(err)));
    var move = Math.min(dist, v * dt);
    if (reduceMotion) move = dist;
    robot.x += Math.cos(robot.th) * move;
    robot.y += Math.sin(robot.th) * move;
    trail.push({ x: robot.x, y: robot.y });

    draw();
    requestAnimationFrame(step);
  }

  function line(pts, style, width, dash) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = style; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke(); ctx.restore();
  }

  function drawRobot() {
    ctx.save();
    ctx.translate(robot.x, robot.y); ctx.rotate(robot.th);
    ctx.fillStyle = '#201e1d'; // wheels
    ctx.fillRect(-9, -10, 7, 4); ctx.fillRect(4, -10, 7, 4);
    ctx.fillRect(-9, 6, 7, 4); ctx.fillRect(4, 6, 7, 4);
    ctx.fillStyle = C.accent; ctx.fillRect(-11, -7, 22, 14); // body
    ctx.fillStyle = '#f5efe6'; ctx.fillRect(5, -3, 4, 6); // nose
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    line(path, 'color-mix(in srgb, ' + C.text + ' 35%, transparent)', 2, [6, 6]);
    line(trail, C.warm, 3);
    if (target && running) {
      ctx.save();
      ctx.strokeStyle = 'color-mix(in srgb, ' + C.warm + ' 60%, transparent)'; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(robot.x, robot.y); ctx.lineTo(target.x, target.y); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = C.warm; ctx.beginPath(); ctx.arc(target.x, target.y, 3, 0, Math.PI * 2); ctx.fill();
    }
    drawRobot();
  }

  new ResizeObserver(resize).observe(canvas);
})();
