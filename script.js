// =========================================================
// script.js
// Plain vanilla JavaScript -- no libraries, no build step.
// Loaded with <script src="js/script.js" defer></script> so it runs
// after the HTML has been parsed, without blocking page rendering.
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. Mobile navigation toggle
     Opens/closes the off-canvas menu on small screens.
  --------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navClose  = document.querySelector(".nav-close");
  var navLinks  = document.querySelector(".nav-links");

  function openNav() { navLinks.classList.add("open"); }
  function closeNav() { navLinks.classList.remove("open"); }

  if (navToggle) navToggle.addEventListener("click", openNav);
  if (navClose) navClose.addEventListener("click", closeNav);

  // Close the mobile menu whenever a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* ---------------------------------------------------------
     2. Sticky header background on scroll
     Adds a solid background + shadow once the user scrolls
     past the hero, so nav text stays readable.
  --------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll();

  /* ---------------------------------------------------------
     3. Back-to-top button
     Shown after scrolling one viewport height, scrolls
     smoothly back to the top on click.
  --------------------------------------------------------- */
  var backToTop = document.querySelector(".back-to-top");
  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > window.innerHeight) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", handleBackToTop);
  handleBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     4. Testimonial slider
     A tiny carousel: one slide is "active" (visible) at a
     time, cycling on a timer or on next/prev/dot clicks.
  --------------------------------------------------------- */
  var slides = document.querySelectorAll(".slide");
  var dots   = document.querySelectorAll(".slider-dots span");
  var current = 0;
  var sliderTimer;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAutoplay() {
    sliderTimer = setInterval(nextSlide, 6000);
  }
  function resetAutoplay() {
    clearInterval(sliderTimer);
    startAutoplay();
  }

  if (slides.length) {
    showSlide(0);
    startAutoplay();

    var nextBtn = document.querySelector(".slider-next");
    var prevBtn = document.querySelector(".slider-prev");
    if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); resetAutoplay(); });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { showSlide(i); resetAutoplay(); });
    });
  }

  /* ---------------------------------------------------------
     5. Contact form validation
     Simple client-side checks (required fields + email
     pattern). Prevents submission and shows inline errors
     instead of sending anywhere (there's no backend here).
  --------------------------------------------------------- */
  var form = document.querySelector(".contact-form");
  if (form) {
    var status = form.querySelector(".form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var value = input.value.trim();
        var ok = value.length > 0;

        if (input.type === "email" && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (field) field.classList.toggle("error", !ok);
        if (!ok) valid = false;
      });

      if (!status) return;

      if (valid) {
        status.textContent = "Thanks! Your message has been received -- we'll be in touch shortly.";
        status.classList.add("show", "success");
        form.reset();
      } else {
        status.textContent = "Please fill in the highlighted fields correctly.";
        status.classList.remove("success");
        status.classList.add("show");
      }
    });
  }

  /* ---------------------------------------------------------
     6. Reveal-on-scroll animation (progressive enhancement)
     In the CSS, ".reveal" elements are visible by default --
     that way the page is correct even without JavaScript.
     Here, ONLY IF IntersectionObserver is supported, we opt
     each element into the fade/slide-in effect by adding
     "js-anim", then reveal it ("in-view") once it's already
     on screen or scrolls into view. Elements already inside
     the viewport at load time are marked in-view immediately
     instead of being hidden and re-animated.
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      el.classList.add("js-anim");
      if (alreadyVisible) {
        el.classList.add("in-view");
      } else {
        observer.observe(el);
      }
    });
  }
  // No "else" branch needed: without IntersectionObserver support,
  // elements simply keep the CSS default of being fully visible.

  /* ---------------------------------------------------------
     7. Footer year
     Keeps the copyright year correct without editing HTML
     every January.
  --------------------------------------------------------- */
  var yearEl = document.querySelector(".current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
