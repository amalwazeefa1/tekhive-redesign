gsap.registerPlugin(ScrollTrigger);

  gsap.to(".left-shape", {
    x: 100, // move rightwards
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".container",
      start: "top 80%",   // when container enters viewport
      toggleActions: "play none none reverse",
      markers: true
    }
  });

  gsap.to(".right-shape", {
    x: -100, // move leftwards
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".container",
      start: "top 80%",
      toggleActions: "play none none reverse",
    }
  });
