gsap.registerPlugin(ScrollTrigger);



// gsap.utils.toArray(".fade-section").forEach((section) => {
//     gsap.from(section, {
//         opacity: 0,
//         y: 60,
//         duration: 1,
//         ease: "power3.out",
//         scrollTrigger: {
//             trigger: section,
//             start: "top 80%",
//             toggleActions: "play none none none"
//         }
//     });
// });

window.addEventListener("DOMContentLoaded", () => {
    gsap.set("#hero", { maxWidth: "85%" });
    gsap.to("#hero", {
        duration: 0.5,
        ease: "power3.out",
        maxWidth: "100vw",
        scrollTrigger: {
            trigger: "#hero",
            start: "top",
            end: "+=500",
            scrub: 1
        }
    })
});



const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
    const target = +counter.dataset.target;
    let current = 0;
    const increment = Math.ceil(target / 150);

    const update = () => {
        if (current < target) {
            current += increment;
            counter.textContent = current;
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
        }
    };

    update();
});
