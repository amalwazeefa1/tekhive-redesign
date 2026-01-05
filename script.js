gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".fade-section").forEach((section) => {
    gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});