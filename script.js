/* Imperial Studios Barbershop — open status, today row, count-up */
(function () {
  "use strict";

  var hours = {
    0: [8, 16],
    1: [8, 20],
    2: [8, 20],
    3: [8, 20],
    4: [8, 20],
    5: [8, 20],
    6: [7, 20]
  };

  function fmt(h) {
    var period = h >= 12 ? "PM" : "AM";
    var hr = h % 12;
    if (hr === 0) hr = 12;
    return hr + ":00 " + period;
  }

  var now = new Date();
  var day = now.getDay();
  var hourNow = now.getHours() + now.getMinutes() / 60;
  var today = hours[day];
  var open = hourNow >= today[0] && hourNow < today[1];
  var statusEl = document.getElementById("openStatus");
  var lineEl = document.getElementById("openLine");

  if (statusEl) {
    if (open) {
      statusEl.textContent = "Open now until " + fmt(today[1]);
    } else {
      var next = day;
      if (hourNow < today[0]) {
        next = day;
      } else {
        next = (day + 1) % 7;
      }
      statusEl.textContent = "Closed, opens " + fmt(hours[next][0]) + (next !== day ? " " + ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][next] : " tomorrow");
      statusEl.classList.add("closed");
    }
  }
  if (lineEl && open) {
    lineEl.textContent = "Open right now, until " + fmt(today[1]) + ". Walk in or book ahead.";
  }

  var todayRow = document.querySelector('.hours [data-day="' + day + '"]');
  if (todayRow) todayRow.classList.add("today");

  /* Count-up on the review stat, respecting reduced motion */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stat = document.querySelector(".stat-num");
  if (stat && !reduce) {
    var target = 430;
    var t0 = null;
    var dur = 1600;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      stat.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    stat.textContent = "0";
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(stat);
  }
})();
