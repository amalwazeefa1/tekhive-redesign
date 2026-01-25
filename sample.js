gsap.registerPlugin(ScrollTrigger);
//////////////////////////////////////////////////////////////////////////////for optimized scroll performance4
ScrollTrigger.config({
    ignoreMobileResize: true,
});
ScrollTrigger.normalizeScroll(true);
ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
});

  gsap.to(".left-shape", {
    x: 500, // move rightwards
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".container",
      start: "top 80%",   // when container enters viewport
      toggleActions: "play none none reverse",
    }
  });

  gsap.to(".right-shape", {
    x: -500, // move leftwards
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".container",
      start: "top 80%",
      toggleActions: "play none none reverse",
    }
  });
