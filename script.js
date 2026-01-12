//////////////////////////////////////////////////////////////////////////////for optimized scroll performance4
gsap.registerPlugin(ScrollTrigger, SplitText);
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



////////////////////////////////////////////////////////////////////////////////menu button toggle
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const menu = document.getElementById("fullscreenMenu");

openMenu.addEventListener("click", () => {
    // enable smooth fade-in
    menu.classList.add("transition-opacity", "duration-300", "ease-in-out");
    menu.classList.remove("opacity-0", "pointer-events-none");
    document.body.classList.add("overflow-hidden");
});

closeMenu.addEventListener("click", closeMenuFn);

menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenuFn);
});

function closeMenuFn() {
    // disable transition → instant close
    menu.classList.remove("transition-opacity", "duration-300", "ease-in-out");
    menu.classList.add("opacity-0", "pointer-events-none");
    document.body.classList.remove("overflow-hidden");
}



/////////////////////////////////////////////////////////////////////////////////////split text animation
document.fonts.ready.then(() => {
    gsap.set(".split", { opacity: 1 });

    let split;
    SplitText.create(".split", {
        type: "words,lines",
        linesClass: "line",
        autoSplit: true,
        mask: "lines",
        onSplit: (self) => {
            split = gsap.timeline({ paused: true })
                .to({}, { duration: 0.3 }) // 1s delay before the reveal
                .from(self.lines, {
                    duration: 2,
                    yPercent: 100,
                    opacity: 0,
                    stagger: 0.1,
                    ease: "expo.out",
                });
            return split;
        }
    });


    document.querySelector("button").addEventListener("click", (e) => {
        split.timeScale(1).play(0);
    });
});




///////////////////////////////////////////////////////////////////////auto card slide
const track = document.getElementById("services-track");
const cards = track.querySelectorAll(".card");

let index = 0;
let interval = null;
const delay = 2500;
let isPaused = false;

function slideNext() {
    if (isPaused) return;

    index++;

    if (index >= cards.length) {
        index = 0;
        track.scrollTo({ left: 0, behavior: "smooth" });
        return;
    }

    track.scrollTo({
        left: cards[index].offsetLeft,
        behavior: "smooth",
    });
}

function startAutoSlide() {
    if (interval) return; // prevent duplicates
    interval = setInterval(slideNext, delay);
}

function stopAutoSlide() {
    isPaused = true;
    clearInterval(interval);
    interval = null;
}

function resumeAutoSlide() {
    isPaused = false;
    startAutoSlide();
}

// ✅ REAL pause on hover
track.addEventListener("mouseenter", stopAutoSlide);
track.addEventListener("mouseleave", resumeAutoSlide);

// Mobile safety
track.addEventListener("touchstart", stopAutoSlide, { passive: true });
track.addEventListener("touchend", resumeAutoSlide);

// Start slider
startAutoSlide();