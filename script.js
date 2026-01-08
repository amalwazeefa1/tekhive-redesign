gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({
  ignoreMobileResize: true,
});
ScrollTrigger.normalizeScroll(true);
ScrollTrigger.normalizeScroll({
  allowNestedScroll: true,
});


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
    gsap.set("#hero", { maxWidth: "85%", borderRadius: "30px" });

    ScrollTrigger.matchMedia({
        // For mobile screens
        "(max-width: 768px)": function () {
            gsap.to("#hero", {
                duration: 0.5,
                ease: "power3.out",
                maxWidth: "100vw",
                borderRadius: "0",
                scrollTrigger: {
                    trigger: "#hero",
                    start: "-=120", 
                    end: "+=300",
                    scrub: 1,
                }
            });
        },

        // For desktop screens
        "(min-width: 769px)": function () {
            gsap.to("#hero", {
                duration: 0.5,
                ease: "power3.out",
                maxWidth: "100vw",
                borderRadius: "0",
                scrollTrigger: {
                    trigger: "#hero",
                    start: "-=120", 
                    end: "+=400",
                    scrub: 1,
                }
            });
        }
    });
});



////////////////////////////////////////////////////////////////////////////////////auto horizontal card slide animation



///////////////////////////////////////////////////////////////////////////counter animation
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
