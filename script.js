// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    infinite: false,
});

// GSAP Plugin Registration
if (typeof gsap !== "undefined") {
    const plugins = [];
    if (typeof ScrollTrigger !== "undefined") plugins.push(ScrollTrigger);
    if (typeof SplitText !== "undefined") plugins.push(SplitText);
    if (typeof MorphSVGPlugin !== "undefined") plugins.push(MorphSVGPlugin);

    if (plugins.length > 0) {
        gsap.registerPlugin(...plugins);
    }
}

// ScrollTrigger Global Config
if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.config({
        ignoreMobileResize: true,
    });
    // normalizeScroll can conflict with Lenis, use with caution
    // ScrollTrigger.normalizeScroll({ allowNestedScroll: true }); 
}

// Sync Lenis with GSAP ScrollTrigger
if (typeof lenis !== "undefined" && typeof ScrollTrigger !== "undefined") {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}


//////////////////////////////////////////////////////////////////////////////hero section animation







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



////////////////////////////////////////////////////////////////////////////////////card drag and slide
if (document.body.classList.contains('home-page')) {
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
}



///////////////////////////////////////////////////////////////////////// AUTO CARD SLIDE + GSAP SCROLL TRIGGER

document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) return;

    const track = document.getElementById("services-track");
    if (!track) return;

    const cards = track.querySelectorAll(".card");
    const prevBtn = document.getElementById("previous-btn");
    const nextBtn = document.getElementById("next-btn");

    let index = 0;
    let interval = null;
    const delay = 2000;

    function scrollToIndex(i) {
        index = (i + cards.length) % cards.length;
        track.scrollTo({
            left: cards[index].offsetLeft,
            behavior: "smooth",
        });
    }

    function slideNext() {
        scrollToIndex(index + 1);
    }

    function slidePrev() {
        scrollToIndex(index - 1);
    }


    let isPaused = false;

    function startAutoSlide() {
        if (interval || isPaused) return; // Don't start if paused
        interval = setInterval(slideNext, delay);
    }

    function stopAutoSlide() {
        if (!interval) return;
        clearInterval(interval);
        interval = null;
    }

    function resumeAutoSlide() {
        isPaused = false;
        startAutoSlide();
    }

    function pauseAutoSlide() {
        isPaused = true;
        stopAutoSlide();
    }


    // Buttons
    nextBtn?.addEventListener("click", () => {
        stopAutoSlide();
        slideNext();
        startAutoSlide();
    });

    prevBtn?.addEventListener("click", () => {
        stopAutoSlide();
        slidePrev();
        startAutoSlide();
    });

    // 🔥 PAUSE ON HOVER / TOUCH (single system)
    [track, prevBtn, nextBtn].forEach(el => {
        if (!el) return;

        // Use pauseAutoSlide/resumeAutoSlide for manual interaction
        el.addEventListener("mouseenter", pauseAutoSlide);
        el.addEventListener("mouseleave", resumeAutoSlide);

        el.addEventListener("touchstart", pauseAutoSlide, { passive: true });
        el.addEventListener("touchend", resumeAutoSlide);
    });

    startAutoSlide();

    ScrollTrigger.create({
        trigger: "#services-slider",
        start: "top",
        end: "bottom 30%",

        onEnter: () => {
            // resumeAutoSlide(); // Ensure it runs when in view
            if (!isPaused) startAutoSlide();
        },

        onEnterBack: () => {
            if (!isPaused) startAutoSlide();
        },

        onLeave: () => {
            stopAutoSlide(); // Fully stop when out of view
        },

        onLeaveBack: () => {
            stopAutoSlide();
        }
    });

});


///////////////////////////////////////////////////////////////////////// GSAP SCROLL TRIGGER (START / STOP ON VIEW)





///////////////////////////////////////////////////////////////////////////////fade in gsap animation
gsap.utils.toArray(".fade-up, .fade-up2").forEach((el, i) => {
    const isFadeUp2 = el.classList.contains("fade-up2");
    const isFadeUp = el.classList.contains("fade-up");

    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: "#about",
            start: isFadeUp2 ? "top 70%" : "top 80%",
            // toggleActions: isFadeUp2 ? "play reverse play reverse" : "play reverse play reverse",
            toggleActions: "play none none reset",
        },
        delay: isFadeUp2
            ? 0          // fade-up2 starts immediately
            : isFadeUp
                ? i * 0.3  // fade-up staggers by index
                : 0
    })
})

////////////////////////////////////////////////////////////////////////////////progress bar animation
if (document.body.classList.contains("home-page")) {

    const aboutSection = document.getElementById("about-us");
    const progress1 = document.getElementById("progress-fill1");
    const progress2 = document.getElementById("progress-fill2");

    if (aboutSection && progress1 && progress2) {

        gsap.fromTo(
            progress1,
            { scaleX: 0, transformOrigin: "left center" },
            {
                scaleX: 0.98,
                duration: 3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top center",
                    toggleActions: "play none none reset"
                }
            }
        );

        gsap.fromTo(
            progress2,
            { scaleX: 0, transformOrigin: "left center" },
            {
                scaleX: 0.85,
                duration: 3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: aboutSection,
                    start: "top center",
                    toggleActions: "play none none reset"
                }
            }
        );

    }
}


////////////////////////////////////////////////////////////////////////////////////counter animation
//first counter

if (document.body.classList.contains("home-page")) {

    // first counter
    let counter1 = { value: 0 };
    gsap.to(counter1, {
        value: 98,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
            trigger: "#about-us",
            start: "top center",
            toggleActions: "play none none reset"
        },
        onUpdate: () => {
            const el1 = document.getElementById("progress-count1");
            if (el1) {
                el1.textContent = Math.floor(counter1.value) + "%";
            }
        }
    });

    // second counter
    let counter2 = { value: 0 };
    gsap.to(counter2, {
        value: 85,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
            trigger: "#about-us",
            start: "top center",
            toggleActions: "play none none reset"
        },
        onUpdate: () => {
            const el2 = document.getElementById("progress-count2");
            if (el2) {
                el2.textContent = Math.floor(counter2.value) + "%";
            }
        }
    });

}


/////////////////////////////////////////////////////////////////morph svg animation
// gsap.to("#grow-morph-1", {
//     morphSVG: "#grow-morph-2",
//     duration: 1.5,
//     ease: "expo.inOut",
//     repeat: -1,
//     yoyo: true
// })

const morphPairs = [
    { from: "#grow-morph-1", to: "#grow-morph-2" },
    { from: "#cost-morph-1", to: "#cost-morph-2" },
    { from: "#boost-morph-1", to: "#boost-morph-2" }
];

// Check if elements exist before creating animation
if (document.querySelector("#grow-morph-1")) {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    morphPairs.forEach(pair => {
        // Double check existence
        if (document.querySelector(pair.from) && document.querySelector(pair.to)) {
            tl.to(pair.from, {
                morphSVG: pair.to,
                duration: 0.8,
                ease: "expo.inOut"
            })
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////morph svg on button hover


////////////////////////////////////////////////////////////////////////////lottie animation
// lottie.loadAnimation({
//   container: document.getElementById("lottie"),
//   renderer: "svg",
//   loop: true,
//   autoplay: true,
//   path: "/assets/business-strategy.json",
//   rendererSettings: {
//     preserveAspectRatio: "xMidYMid meet"
//   }
// });






///////////////////////////////////////////////////////////////////////////////popup button gsap animation - sticky button
window.addEventListener("load", () => {
    gsap.from("#pop-up", {
        scale: 0.6,
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "back.out(1.7",
        delay: 0.5
    })
})

window.addEventListener("load", () => {
    const button = document.querySelector("#pop-up")
    const text = button.querySelector(".popup-text")
    const icon = button.querySelector(".popup-icon")

    // calculate final width (icon + padding)
    const iconWidth = icon.offsetWidth
    const finalWidth = iconWidth + 16 // little breathing space

    const tl = gsap.timeline({ delay: 0.3 })

    // 1️⃣ Pop-in animation
    tl.from(button, {
        scale: 0.6,
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrub: true,
        ease: "back.out(1.7)"
    })

    // 2️⃣ Fade + slide text out
    tl.to(text, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        scrub: true,
        ease: "power2.out"
    }, "+=0.6")

    // 3️⃣ Shrink button to icon size
    tl.to(button, {
        width: finalWidth,
        paddingLeft: 0,
        paddingRight: 0,
        duration: 0.5,
        scrub: true,
        ease: "power3.inOut"
    })
})



////////////////////////////////////////////////////////////////////////////cursor icon when hover gsap animation
document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) return;

    const target = document.getElementById("services-track");
    const cursor = document.getElementById("cursor-icon");

    if (!target || !cursor) return;

    // Smooth follow
    window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX - 24,
            y: e.clientY - 24,
            duration: 0.5,
            ease: "power3.out",
        });
    });

    // Show cursor
    target.addEventListener("mouseenter", () => {
        gsap.to(cursor, {
            scale: 1,
            opacity: 1,
            duration: 0.25,
            ease: "power3.out",
        });
    });

    // Hide cursor
    target.addEventListener("mouseleave", () => {
        gsap.to(cursor, {
            scale: 0.5,
            opacity: 0,
            duration: 0.2,
            ease: "power3.in",
        });
    });
});



const header = document.getElementById("site-header");
const navLinks = document.querySelectorAll('.nav-link');
const whatsappIcon = document.querySelector(".whatsapp-icon-white");
const phoneIcon = document.querySelector(".phone-icon-white");
const menuIcon = document.querySelector(".menu");

let startValue = "top top";
let endValue = "99999";

if (document.body.classList.contains("home-page")) {
    startValue = "1300px top";
}
if (document.body.classList.contains("about-page")) {
    startValue = "300px top";
}

let isScrolled = false;
let isHovered = false;

function updateHeaderUI() {
    const isActive = isScrolled || isHovered;

    // Header background
    if (header) {
        header.classList.toggle("bg-white", isActive);
        header.classList.toggle("bg-gradient-to-b", !isActive);
        header.classList.toggle("from-black", !isActive);
        header.classList.toggle("to-transparent", !isActive);
    }

    // Nav link colors
    navLinks.forEach(link => {
        link.classList.toggle("text-black", isActive);
        link.classList.toggle("text-white", !isActive);
    });

    // Icon colors
    [whatsappIcon, phoneIcon, menuIcon].forEach(icon => {
        if (icon) {
            icon.classList.toggle("text-black", isActive);
            icon.classList.toggle("text-white", !isActive);
        }
    });

    // Logo and other image swaps
    document.querySelectorAll('img[data-alt-src]').forEach(img => {
        // We assume the original src is the "white/link" version
        // and data-alt-src is the "black" version.
        // To make it robust, we store the original paths if not already done.
        if (!img.dataset.originalSrc) {
            img.dataset.originalSrc = img.src;
        }

        const whiteSrc = img.dataset.originalSrc;
        const blackSrc = img.dataset.altSrc;

        img.src = isActive ? blackSrc : whiteSrc;
    });
}

ScrollTrigger.create({
    start: startValue,
    end: endValue,
    onToggle: (self) => {
        isScrolled = self.isActive;
        updateHeaderUI();
    }
});

// unified hover handlers
if (header) {
    header.addEventListener('mouseenter', () => {
        isHovered = true;
        updateHeaderUI();
    });

    header.addEventListener('mouseleave', () => {
        isHovered = false;
        updateHeaderUI();
    });
}

/////////////////////////////////////////////////////////////////////////////logo
// The previous logo-specific ScrollTrigger is now redundant and handled by updateHeaderUI



/////////////////////////////////////////////////////////////////////////////////Pinned intro aimation

// ScrollTrigger.create({
//     trigger: ".pinned-section",
//     start: "top top",
//     end: "+-100%",
//     pin: true,
//     pinSpacing: true,
// })

if (document.body.classList.contains("home-page")) {
    gsap.from(".pinned-section .tekhive-icon", {
        scale: 0.6,
        opacity: 0,
        delay: 0.7,
        duration: 2,
        scrollTrigger: {
            trigger: ".pinned-section",
            start: "top top",
            end: "+=200%",
            pin: true,
            toggleActions: "play reverse play reverse",
        }
    })


    gsap.from(".logo-part", {
        opacity: 0,
        y: 20,
        scale: 0.8,
        rotate: 5,
        filter: "blur(6px)",
        duration: 1.2,
        ease: "expo.out",
        delay: 1.5,
        stagger: {
            each: 0.12,
            from: "start"
        },
        scrollTrigger: {
            trigger: ".tekhive-text",
            start: "top top",
            end: "9999999",
            scrub: false,
        }
    });
}


////////////////////////////////////////////////////////////////////////////////split text
if (document.getElementById("tektext") && typeof SplitType !== 'undefined') {
    const split = new SplitType("#tektext", { types: "lines" });

    gsap.from(split.lines, {
        scrollTrigger: {
            trigger: "#tektext",
            start: "top 80%",
            toggleActions: "play none none reset"
        },
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power4.out",
        delay: 1
    });
}



const aboutHero = document.getElementById("about-hero");
const ball = document.querySelector(".ball");

if (aboutHero && ball) {
    let isHovering = false;

    // Track hover state
    aboutHero.addEventListener("mouseenter", () => {
        isHovering = true;
    });
    aboutHero.addEventListener("mouseleave", () => {
        isHovering = false;
    });

    // Create quick setters
    const setX = gsap.quickTo(ball, "x", { duration: 1.5, ease: "power3.out" });
    const setY = gsap.quickTo(ball, "y", { duration: 1.5, ease: "power3.out" });

    aboutHero.addEventListener("mousemove", (e) => {
        if (!isHovering) return;

        const rect = aboutHero.getBoundingClientRect();
        const x = e.clientX - rect.left - ball.offsetWidth / 1;
        const y = e.clientY - rect.top - ball.offsetHeight / 3;

        setX(x);
        setY(y);
    });
}

///////////////////////////////////////////////////////about section mask animation
if (document.body.classList.contains("about-page")) {
    gsap.set(".mask", { xPercent: 0 });

    gsap.timeline()
        .to(".mask", {
            xPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            stagger: 0.15
        });
}


/////////////////////////////////////////////////////////////parallax image effect
const parallaxContainer = document.querySelector("#parallax-container");
if (parallaxContainer) {
    const image = parallaxContainer.querySelector(".parallax-img");

    if (image) {
        gsap.fromTo(
            image, {
            yPercent: -30, //start higher
        },
            {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: parallaxContainer,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
            }
        )
    }
}


//////////////////////////////////////////////////////////////sliced boxes reveal animation
if (document.querySelector(".sliced-box")) {
    gsap.set(".sliced-box", {
        y: 0
    });

    const sliceTl = gsap.timeline();

    sliceTl.to(".sliced-box", {
        y: "-100%",
        duration: 1.2,
        stagger: {
            each: 0.08,
            from: "start"
        },
        ease: "power4.inOut"
    })
        .set(".slice-section", { display: "none" })
}

///////////////////////////////////////////////////////////////////////////////////////active lottie animation on mega navbar
document.addEventListener("DOMContentLoaded", () => {

    const preview = document.getElementById("lottiePreview");
    const links = document.querySelectorAll(".dropdown-link");
    const defaultLink = document.getElementById("defaultLottie");

    if (!preview || !defaultLink || links.length === 0 || typeof lottie === "undefined") return;

    let currentAnimation;

    function loadLottie(path) {
        if (currentAnimation) {
            currentAnimation.destroy();
        }

        currentAnimation = lottie.loadAnimation({
            container: preview,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: path
        });
    }

    loadLottie(defaultLink.dataset.lottie);

    links.forEach(link => {
        link.addEventListener("mouseenter", () => {
            loadLottie(link.dataset.lottie);
        });
    });

});