//////////////////////////////////////////////////////////////////////////////for optimized scroll performance
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


//////////////////////////////////////////////////////////////////////////////hero section animation
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



////////////////////////////////////////////////////////////////////////////////////card drag and slide
const slider = document.getElementById("services-track");

  let isDown = false;
  let startX;
  let scrollLeft;

  /* -------- Mouse Events -------- */
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("cursor-grabbing");

    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("cursor-grabbing");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("cursor-grabbing");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.4; // speed
    slider.scrollLeft = scrollLeft - walk;
  });

  /* -------- Touch Events -------- */
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.4;
    slider.scrollLeft = scrollLeft - walk;
  });