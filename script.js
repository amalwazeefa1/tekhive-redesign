// Initialize Lenis only when the CDN has loaded successfully.
const lenis = typeof Lenis !== "undefined"
    ? new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false,
    })
    : null;

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
if (lenis && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
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
const siteHeader = document.getElementById("site-header");
const sliderNav = document.getElementById("nav");
const popUpBtn = document.getElementById("pop-up");

if (menu) {
    menu.setAttribute("data-lenis-prevent", "");
    menu.classList.add("overscroll-contain");
}
let card2Revealed = false;

function checkCard2Reveal() {
    if (card2Revealed || !menu) return;

    const cards = menu.querySelectorAll(".card");
    if (cards.length > 1 && typeof gsap !== "undefined") {
        const card2 = cards[1];
        const textContainer = card2.querySelector("span.line");
        if (!textContainer) return;

        const rect = textContainer.getBoundingClientRect();

        // Triggers as soon as the text tag enters the viewport
        if (rect.top < window.innerHeight) {
            card2Revealed = true;
            const card2Masks = card2.querySelectorAll(".text-mask1-mobile-menu-card-text");
            if (card2Masks.length > 0) {
                gsap.to(card2Masks, {
                    xPercent: 100,
                    duration: 1.0,
                    ease: "power4.inOut",
                    stagger: 0.15,
                    delay: 0.2 // delay animation for breathing room
                });
            }
        }
    }
}

if (openMenu && closeMenu && menu) {
    openMenu.addEventListener("click", () => {
        // enable smooth fade-in
        menu.classList.add("transition-opacity", "duration-300", "ease-in-out");
        menu.classList.remove("opacity-0", "pointer-events-none");
        document.body.classList.add("overflow-hidden");

        // Hide main site header and slider navigation to prevent rubber-band exposure overlap
        if (siteHeader) siteHeader.classList.add("opacity-0", "pointer-events-none");
        if (sliderNav) sliderNav.classList.add("opacity-0", "pointer-events-none");
        if (popUpBtn) popUpBtn.classList.add("opacity-0", "pointer-events-none");

        // Split reveal animations for mobile menu cards
        if (typeof gsap !== "undefined") {
            const cards = menu.querySelectorAll(".card");
            if (cards.length > 0) {
                card2Revealed = false;

                // Card 1: Reset and reveal immediately when menu opens
                const card1Masks = cards[0].querySelectorAll(".text-mask1-mobile-menu-card-text");
                if (card1Masks.length > 0) {
                    gsap.set(card1Masks, { xPercent: 0 });
                    gsap.to(card1Masks, {
                        xPercent: 100,
                        duration: 1.0,
                        ease: "power4.inOut",
                        stagger: 0.15,
                        delay: 0.35 // wait for menu fade-in transition (300ms)
                    });
                }

                // Card 2: Reset to covered state
                if (cards.length > 1) {
                    const card2Masks = cards[1].querySelectorAll(".text-mask1-mobile-menu-card-text");
                    if (card2Masks.length > 0) {
                        gsap.set(card2Masks, { xPercent: 0 });
                    }
                }

                // Check visibility after menu opens in case Card 2 is already visible
                setTimeout(checkCard2Reveal, 400);
            }
        }
    });

    closeMenu.addEventListener("click", closeMenuFn);

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenuFn);
    });

    // Add scroll event listener to menu container
    menu.addEventListener("scroll", checkCard2Reveal);
}

function closeMenuFn() {
    if (!menu) return;

    // disable transition ? instant close
    menu.classList.remove("transition-opacity", "duration-300", "ease-in-out");
    menu.classList.add("opacity-0", "pointer-events-none");
    document.body.classList.remove("overflow-hidden");

    // Restore visibility of header and slider navigation
    if (siteHeader) siteHeader.classList.remove("opacity-0", "pointer-events-none");
    if (sliderNav) sliderNav.classList.remove("opacity-0", "pointer-events-none");
    if (popUpBtn) popUpBtn.classList.remove("opacity-0", "pointer-events-none");
}



/////////////////////////////////////////////////////////////////////////////////////split text animation
if (typeof document.fonts !== "undefined" && typeof gsap !== "undefined" && typeof SplitText !== "undefined") {
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
                    .to({}, { duration: 0.3 })
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

        const splitTriggerButton = document.querySelector("button");
        if (splitTriggerButton && split) {
            splitTriggerButton.addEventListener("click", () => {
                split.timeScale(1).play(0);
            });
        }
    });
}



////////////////////////////////////////////////////////////////////////////////////card drag and slide
if (document.body.classList.contains('home-page')) {
    const slider = document.getElementById("services-track");
    if (slider) {
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
}



/////////////////////////////////////////////////////////////////////////// MANUAL CARD SLIDER ACTIONS

document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) return;

    const track = document.getElementById("services-track");
    if (!track) return;

    const cards = Array.from(track.children).filter(child => child.classList.contains("card"));
    const prevBtns = document.querySelectorAll(".previous-btn, #previous-btn");
    const nextBtns = document.querySelectorAll(".next-btn, #next-btn");

    let index = 0;

    function supportsNativeSmoothScroll() {
        return "scrollBehavior" in document.documentElement.style;
    }

    function animateScrollLeft(element, targetLeft, duration = 450) {
        const startLeft = element.scrollLeft;
        const distance = targetLeft - startLeft;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.scrollLeft = startLeft + (distance * eased);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    function scrollToIndex(i) {
        if (!cards.length) return;

        index = (i + cards.length) % cards.length;
        const targetLeft = cards[index].offsetLeft;

        if (supportsNativeSmoothScroll()) {
            track.scrollTo({
                left: targetLeft,
                behavior: "smooth",
            });
            return;
        }

        animateScrollLeft(track, targetLeft);
    }

    function slideNext() {
        scrollToIndex(index + 1);
    }

    // Buttons manual trigger for all instances
    nextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            slideNext();
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            scrollToIndex(index - 1);
        });
    });
});


///////////////////////////////////////////////////////////////////////// GSAP SCROLL TRIGGER (START / STOP ON VIEW)





///////////////////////////////////////////////////////////////////////////////fade in gsap animation
gsap.utils.toArray(".fade-up, .fade-up2").filter((el) => !el.closest("#testimonials")).forEach((el, i) => {
    const isFadeUp2 = el.classList.contains("fade-up2");
    const isFadeUp = el.classList.contains("fade-up");
    const isCardElement = el.classList.contains("card");
    const triggerElement = isCardElement ? el : (el.closest("section") || el);
    const startValue = isCardElement
        ? "top 88%"
        : (isFadeUp2 ? "top 70%" : "top 80%");

    gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
            trigger: triggerElement,
            start: startValue,
            toggleActions: "play none none reverse",
        },
        delay: isFadeUp2
            ? 0          // fade-up2 starts immediately
            : isFadeUp
                ? i * 0.3  // fade-up staggers by index
                : 0
    })
})

///////////////////////////////////////////////////////////////////////////////testimonial scroll trigger animation
const testimonialSection = document.getElementById("testimonials");

if (testimonialSection && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const testimonialCards = [
        "#testimonial-card-1",
        "#testimonial-card-2",
        "#testimonial-card-3",
        "#testimonial-card-4",
    ]
        .map((selector) => document.querySelector(selector))
        .filter(Boolean);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    gsap.set(testimonialCards, {
        transformPerspective: 1000,
        transformOrigin: "center bottom",
    });

    mm.add(
        {
            isMobile: "(max-width: 767px)",
            isDesktop: "(min-width: 768px)",
        },
        (context) => {
            const start = context.conditions.isMobile ? "top 90%" : "top 85%";
            testimonialCards.forEach((card, index) => {
                const quote = card.querySelector("p");
                const badge = card.querySelector(".small-card");
                const avatar = card.querySelector(".avatar");
                const stars = card.querySelectorAll(".small-card .fade-up");

                if (prefersReducedMotion) {
                    gsap.set([card, quote, badge, avatar, stars], {
                        clearProps: "all",
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        rotateX: 0,
                    });
                    return;
                }

                gsap.set(card, {
                    opacity: 0,
                    y: 80,
                    rotateX: context.conditions.isMobile ? 0 : -10,
                    scale: 0.96,
                });

                gsap.set(quote, {
                    opacity: 0,
                    y: 28,
                });

                gsap.set(badge, {
                    opacity: 0,
                    y: 24,
                    x: context.conditions.isMobile ? 0 : -16,
                    scale: 0.94,
                });

                gsap.set(avatar, {
                    opacity: 0,
                    scale: 0.75,
                });

                gsap.set(stars, {
                    opacity: 0,
                    y: 5,
                    scale: 0.6,
                    transformOrigin: "center center",
                });

                const tl = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    },
                    scrollTrigger: {
                        trigger: card,
                        start,
                        toggleActions: "restart none restart reverse",
                    }
                });

                tl.to(card, {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    duration: 0.9,
                    delay: index * 0.12,
                })
                    .to(quote, {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                    }, "-=0.52")
                    .to(badge, {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        duration: 0.5,
                    }, "-=0.28")
                    .to(avatar, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.35,
                        ease: "back.out(1.8)",
                    }, "-=0.25")
                    .to(stars, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.28,
                        stagger: 0.06,
                        ease: "back.out(1.7)",
                    }, "-=0.18");

                if (badge) {
                    gsap.to(badge, {
                        yPercent: -6,
                        duration: 2.4 + index * 0.2,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                    });
                }
            });
        }
    );
}

////////////////////////////////////////////////////////////////////////////////progress bar animation
if (document.body.classList.contains("home-page")) {

    const progress1 = document.getElementById("progress-fill1");
    const progress2 = document.getElementById("progress-fill2");

    if (progress1 && progress2) {

        const mm = gsap.matchMedia();
        const createProgressAnimation = (start) => {
            gsap.fromTo(
                progress1,
                { scaleX: 0, transformOrigin: "left center" },
                {
                    scaleX: 0.98,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: progress1,
                        start,
                        toggleActions: "play none none reset"
                    }
                }
            );

            gsap.fromTo(
                progress2,
                { scaleX: 0, transformOrigin: "left center" },
                {
                    scaleX: 0.95,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: progress1,
                        start,
                        toggleActions: "play none none reset"
                    }
                }
            );
        };

        // Trigger animation when the progress bars reach the viewport
        mm.add("(max-width: 767px)", () => {
            createProgressAnimation("top 90%");
        });

        mm.add("(min-width: 768px)", () => {
            createProgressAnimation("top 85%");
        });
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
            trigger: "#progress-fill1",
            start: "top 90%",
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
        value: 95,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
            trigger: "#progress-fill1",
            start: "top 90%",
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
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector("#pop-up");
    if (!popup || typeof gsap === "undefined") return;

    // Disable the parent <a> link too so it's not clickable when hidden
    const popupLink = popup.closest('a');

    // Check if we are on the homepage to decide if we hide at the top (hero section)
    const isHomePage = document.body.classList.contains("home-page");
    const heroHeight = window.innerHeight;
    const threshold = isHomePage ? (heroHeight - 100) : 100;

    // Always start hidden on page load
    gsap.set(popup, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        pointerEvents: "none"
    });
    if (popupLink) popupLink.style.pointerEvents = 'none';

    let lastScrollY = window.scrollY;
    let isHidden = true;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // Keep completely hidden if near the top of the page / hero section
        if (currentScrollY < threshold) {
            if (!isHidden) {
                gsap.to(popup, {
                    y: 100,
                    opacity: 0,
                    scale: 0.8,
                    pointerEvents: "none",
                    duration: 0.35,
                    ease: "power2.inOut",
                    overwrite: true
                });
                if (popupLink) popupLink.style.pointerEvents = 'none';
                isHidden = true;
            }
            lastScrollY = currentScrollY;
            return;
        }

        const scrollDelta = currentScrollY - lastScrollY;
        const isScrollingDown = scrollDelta > 8;

        if (isScrollingDown && !isHidden) {
            // Hide on scroll down
            gsap.to(popup, {
                y: 100,
                opacity: 0,
                scale: 0.8,
                pointerEvents: "none",
                duration: 0.35,
                ease: "power2.inOut",
                overwrite: true
            });
            if (popupLink) popupLink.style.pointerEvents = 'none';
            isHidden = true;
        } else if (!isScrollingDown && isHidden && scrollDelta < -8) {
            // Show immediately on scroll up
            gsap.to(popup, {
                y: 0,
                opacity: 1,
                scale: 1,
                pointerEvents: "auto",
                duration: 0.4,
                ease: "back.out(1.7)",
                overwrite: true
            });
            if (popupLink) popupLink.style.pointerEvents = 'auto';
            isHidden = false;
        }

        lastScrollY = currentScrollY;
    });
});



////////////////////////////////////////////////////////////////////////////cursor icon when hover gsap animation
document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.classList.contains("home-page")) return;
    if (typeof gsap === "undefined") return;

    const target = document.getElementById("services-track");
    const cursor = document.getElementById("cursor-icon");

    if (!target || !cursor) return;

    let isOverInteractive = false;

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
        if (!isOverInteractive) {
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.25,
                ease: "power3.out",
            });
        }
    });

    // Hide cursor
    target.addEventListener("mouseleave", () => {
        isOverInteractive = false;
        gsap.to(cursor, {
            scale: 0.5,
            opacity: 0,
            duration: 0.2,
            ease: "power3.in",
        });
    });

    // Hide cursor when hovering interactive elements (Learn More links, green buttons)
    target.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            isOverInteractive = true;
            gsap.to(cursor, {
                scale: 0,
                opacity: 0,
                duration: 0.2,
                ease: "power3.in",
            });
        });
        el.addEventListener("mouseleave", () => {
            isOverInteractive = false;
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.25,
                ease: "power3.out",
            });
        });
    });
});



const header = document.getElementById("site-header");
const navLinks = document.querySelectorAll('.nav-link');
const whatsappIcon = document.querySelector(".whatsapp-icon-white");
const phoneIcon = document.querySelector(".phone-icon-white");
const menuIcon = document.querySelector(".menu");

const servicePages = new Set([
    "services.html",
    "website-development.html",
    "e-commerce.html",
    "mobile-app-development.html",
    "cms-development.html",
    "digital-marketing.html",
    "domain-and-web-hosting.html",
    "sap-business-one.html",
    "business-intelligence-tool.html",
    "third-party-app-integration.html",
    "crm.html",
    "business-process-automation.html",
    "it-support.html",
    "it-consulting.html",
    "back-office-support.html",
]);

function normalizeNavHref(href) {
    if (!href || href === "#") return href;
    return href.split("/").pop().split("#")[0];
}

function getActiveNavHref() {
    const currentFile = window.location.pathname.split("/").pop() || "index.html";

    if (currentFile === "index.html") return "index.html";
    if (currentFile === "about.html") return "about.html";
    if (currentFile === "contact.html") return "contact.html";
    if (servicePages.has(currentFile)) return "services.html";

    return "";
}

function setActiveNavLink(activeHref = getActiveNavHref()) {
    navLinks.forEach((link) => {
        const href = normalizeNavHref(link.getAttribute("href"));
        const isCurrent = href && href === activeHref;

        link.dataset.active = isCurrent ? "true" : "false";
        link.classList.toggle("font-bold", isCurrent);
        link.style.color = isCurrent ? "#09aeb8" : "";
    });
}

const isHomePage = document.body.classList.contains("home-page");

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

        if (link.dataset.active === "true") {
            link.style.color = "#09aeb8";
        }
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

setActiveNavLink();

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const href = normalizeNavHref(link.getAttribute("href"));
        if (href && href !== "#") {
            setActiveNavLink(href);
        }
    });
});

const trigger = ScrollTrigger.create({
    trigger: isHomePage ? "#wrapper" : "body",
    start: isHomePage ? "bottom top" : "top+=10 top",
    end: 99999,
    onToggle: (self) => {
        isScrolled = self.isActive;
        updateHeaderUI();
    }
});

// Initialize header state immediately on page load/refresh
isScrolled = trigger.isActive;
updateHeaderUI();

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
    const pinTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".pinned-section",
            start: "top 80%",
            end: "bottom center",
            pin: false,
            scrub: false,
            toggleActions: "play none none reverse",
        }
    });

    // Animate ambient glows
    pinTl.from(".pinned-section .glow-1", {
        scale: 0.4,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    }, 0)
        .from(".s-section .glow-2", {
            scale: 0.4,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        }, 0.2)
        .from(".pinned-section .tekhive-icon", {
            opacity: 0,
            scale: 0.5,
            rotation: -45,
            duration: 1,
            ease: "back.out(1.7)"
        }, 0.3)
        .from(".logo-part", {
            opacity: 0,
            y: 40,
            scale: 0.8,
            rotate: 15,
            filter: "blur(10px)",
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.05
        }, "-=0.6")
        .from(".animated-divider", {
            scaleY: 0,
            transformOrigin: "center",
            duration: 1,
            ease: "power3.inOut"
        }, "-=0.8");

    if (document.getElementById("tektext")) {
        if (typeof SplitType !== "undefined") {
            const split = new SplitType("#tektext", { types: "lines" });
            split.lines.forEach(line => {
                const wrapper = document.createElement("div");
                wrapper.style.overflow = "hidden";
                wrapper.style.display = "block";
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });
            pinTl.from(split.lines, {
                yPercent: 110,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out"
            }, "-=0.5");
        } else if (typeof SplitText !== "undefined") {
            const split = SplitText.create("#tektext", {
                type: "lines",
                linesClass: "line",
                mask: "lines",
            });

            pinTl.from(split.lines, {
                duration: 1.2,
                yPercent: 100,
                opacity: 0,
                stagger: 0.1,
                ease: "expo.out",
            }, "-=0.5");
        } else {
            pinTl.from("#tektext", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5");
        }
    }

    // Mouse hover parallax effect on ambient glows
    const pinnedSec = document.querySelector(".pinned-section");
    if (pinnedSec) {
        pinnedSec.addEventListener("mousemove", (e) => {
            const rect = pinnedSec.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            gsap.to(".pinned-section .glow-1", {
                x: (x - rect.width / 2) * 0.12,
                y: (y - rect.height / 2) * 0.12,
                duration: 2.5,
                ease: "power2.out"
            });
            gsap.to(".pinned-section .glow-2", {
                x: -(x - rect.width / 2) * 0.12,
                y: -(y - rect.height / 2) * 0.12,
                duration: 2.5,
                ease: "power2.out"
            });
        });
        pinnedSec.addEventListener("mouseleave", () => {
            gsap.to(".pinned-section .glow-1, .pinned-section .glow-2", {
                x: 0,
                y: 0,
                duration: 2,
                ease: "power2.out"
            });
        });
    }
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
        const maxX = rect.width - ball.offsetWidth;
        const maxY = rect.height - ball.offsetHeight;
        const x = gsap.utils.clamp(0, maxX, e.clientX - rect.left - ball.offsetWidth / 2);
        const y = gsap.utils.clamp(0, maxY, e.clientY - rect.top - ball.offsetHeight / 2);

        setX(x);
        setY(y);
    });
}

///////////////////////////////////////////////////////mask animation - text reveal
const maskTargets = [".text-mask-banner", ".text-mask-section-about", ".text-mask1-section-home", ".text-mask2-section-home", ".text-mask-section-services", ".text-mask-testimonials", ".text-mask-approach", ".text-mask-contact", ".text-mask-about-label", ".text-mask-agile", ".text-mask-website-development"];

maskTargets.forEach(selector => {
    const elements = gsap.utils.toArray(selector);
    if (!elements.length) return;

    gsap.set(elements, { xPercent: 0 });

    gsap.timeline({
        scrollTrigger: {
            trigger: elements[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
        }
    })
        .to(elements, {
            xPercent: 100,
            duration: 1,
            ease: "power4.inOut",
            stagger: 0.15
        });
});


/////////////////////////////////////////////////////////////parallax image effect
const parallaxContainer = document.querySelector("#parallax-container");
if (parallaxContainer) {
    const image = parallaxContainer.querySelector(".parallax-img");

    if (image) {
        gsap.fromTo(
            image, {
            yPercent: -10,
        },
            {
                yPercent: 10,
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

gsap.fromTo(".image-banner .parallax-img", { yPercent: -20 },
    {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".image-banner",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    })

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

///////////////////////////////////////////////////////////////////////////////////////active lottie animation on mega navbar - common for all pages
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////scroll triggered text swap + parallax image - common for all pages [services section]
const paras = gsap.utils.toArray(".para");

const whatWeDoSec = document.querySelector("#what-we-do");
if (whatWeDoSec) {
    whatWeDoSec.style.display = "block";
    whatWeDoSec.classList.add("py-12");

    // CSS Grid overlay solution: makes the parent fit the tallest paragraph
    const style = document.createElement("style");
    style.textContent = `
        #what-we-do .relative > div {
            display: grid !important;
        }
        #what-we-do .para {
            grid-area: 1 / 1 / 2 / 2 !important;
            position: relative !important;
            top: auto !important;
            left: auto !important;
        }
    `;
    document.head.appendChild(style);
}

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#what-we-do",
        pin: "#what-we-do > div",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pinSpacing: true,
        anticipatePin: 1,
    }
});

// first paragraph fade out
tl.to(paras[0], {
    opacity: 0,
    y: -20,
    duration: 0.5,
})
    // second paragraph fade in
    .to(paras[1], {
        opacity: 1,
        y: 0,
        duration: 0.5
    }, ">");

if (paras[2]) {
    tl.to(paras[1], {
        opacity: 0,
        y: -20,
        duration: 0.5,
    })
        .to(paras[2], {
            opacity: 1,
            y: 0,
            duration: 0.5,
        }, ">");
}

//parallax image movement for service-page banners only
const serviceBannerImages = gsap.utils.toArray(".image-banner .parallax-img");
serviceBannerImages.forEach((image) => {
    gsap.fromTo(
        image,
        { yPercent: -20 },
        {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: image.closest(".image-banner"),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            }
        }
    );
});


////////////////////////////////////////////////////////////////////////faq section toggle animation
document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector(".faq-toggle");
    const content = item.querySelector(".faq-content");
    const icon = item.querySelector(".faq-icon");

    button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        if (!isOpen) {
            // Close all other faq-items
            document.querySelectorAll(".faq-item").forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove("is-open");
                    const otherContent = otherItem.querySelector(".faq-content");
                    const otherIcon = otherItem.querySelector(".faq-icon");

                    gsap.to(otherContent, {
                        height: 0,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });

                    gsap.to(otherIcon, {
                        rotate: 0,
                        duration: 0.3,
                        color: "#d1d1d1"
                    });
                }
            });

            // Open this item
            item.classList.add("is-open");
            gsap.to(content, {
                height: content.scrollHeight,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });

            gsap.to(icon, {
                rotate: 45,
                duration: 0.3,
                color: "#000"
            });

        } else {
            // Close this item
            item.classList.remove("is-open");
            gsap.to(content, {
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: "power2.inOut"
            });

            gsap.to(icon, {
                rotate: 0,
                duration: 0.3,
                color: "#d1d1d1"
            });
        }
    });
});


/////////////////////////////////////////////////// morph svg animation on button hover - common for all pages (services section)
const morphWrappers = document.querySelectorAll('[id="morph-button-blue"]');

morphWrappers.forEach((wrapper) => {
    const bigMorphBtn = wrapper.querySelector('[id="shape1"]');
    const hoverShape = wrapper.querySelector('[id="shape2"]');
    const smallMorphBtn = wrapper.querySelector('[id="small-shape1"]');
    const smallHoverShape = wrapper.querySelector('[id="small-shape2"]');

    if (!bigMorphBtn || !hoverShape || !smallMorphBtn || !smallHoverShape) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(bigMorphBtn, {
        duration: 0.5,
        morphSVG: hoverShape,
        ease: "power2.out"
    });

    tl.to(smallMorphBtn, {
        duration: 0.5,
        morphSVG: smallHoverShape,
        ease: "power2.out"
    }, 0);

    wrapper.addEventListener("mouseenter", () => {
        tl.play();
    });

    wrapper.addEventListener("mouseleave", () => {
        tl.reverse();
    });
});



//////////////////////// contact us submit button animation - morph svg on hover
const submitMorphWrapper = document.getElementById("submit-morph-button");

if (
    submitMorphWrapper &&
    typeof gsap !== "undefined" &&
    typeof MorphSVGPlugin !== "undefined"
) {
    const submitShape = submitMorphWrapper.querySelector("#submit-small-shape1");
    const submitHoverShape = submitMorphWrapper.querySelector("#submit-small-shape2");

    if (submitShape && submitHoverShape) {
        const submitMorphTl = gsap.timeline({ paused: true });

        submitMorphTl.to(submitShape, {
            duration: 0.45,
            morphSVG: submitHoverShape,
            ease: "power2.out"
        });

        submitMorphWrapper.addEventListener("mouseenter", () => {
            submitMorphTl.play();
        });

        submitMorphWrapper.addEventListener("mouseleave", () => {
            submitMorphTl.reverse();
        });
    }
}


///////////////////////////////////////////////////////////////////////////////////footer logo gsap animation

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    const footerLogo = document.querySelector("#footerLogo");

    if (footerLogo) {
        // Set initial hidden state
        gsap.set(footerLogo, { opacity: 0, filter: "blur(3px)", y: 45 });

        ScrollTrigger.create({
            trigger: "footer",
            start: "top 110%",
            onEnter: () => gsap.to(footerLogo, {
                opacity: 1,
                filter: "blur(0px)",
                y: 5,
                ease: "power2.out",
                duration: 2,        // fade IN = 2s
                overwrite: true
            }),
            onLeaveBack: () => gsap.to(footerLogo, {
                opacity: 0,
                filter: "blur(3px)",
                y: 45,
                ease: "power2.in",
                duration: 0.5,        // fade OUT = 1s
                overwrite: true
            })
        });
    }
});

// Refresh ScrollTrigger calculations after everything is fully loaded
window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});

///////////////////////////////////////////////////////////////////////////////////footer link hover animation
document.addEventListener("DOMContentLoaded", () => {
    const footerLinks = document.querySelectorAll("footer ul a");

    footerLinks.forEach((link) => {
        const listItem = link.closest("li");

        if (listItem) {
            listItem.classList.add("group", "flex", "items-center", "gap-2");
        }

        link.classList.add(
            "relative",
            "inline-block",
            "text-[#333333]",

            // base
            "after:content-['']",
            "after:absolute",
            "after:left-0",
            "after:bottom-0",
            "after:h-[1.5px]",
            "after:w-full",
            "after:bg-[#09aeb8]",
            "after:origin-right",
            "after:scale-x-0",
            "after:transition-transform",
            "after:duration-300",

            // hover in
            "hover:after:origin-left",
            "hover:after:scale-x-100"
        );
    });
});

///////////////////////////////////////////////////////////////////////////////////mega menu links hover animation
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll(".dropdown-link");

    dropdownLinks.forEach((link) => {
        link.classList.add(
            "relative",
            "w-fit",

            // base
            "after:content-['']",
            "after:absolute",
            "after:left-0",
            "after:bottom-0",
            "after:h-[1.5px]",
            "after:w-full",
            "after:bg-[#09aeb8]",
            "after:origin-right",
            "after:scale-x-0",
            "after:transition-transform",
            "after:duration-300",

            // hover in
            "hover:after:origin-left",
            "hover:after:scale-x-100"
        );
    });
});


const lines = gsap.utils.toArray(".fill-line");

lines.forEach((line, index) => {
    gsap.to(line, {
        color: "#ffffff",
        ease: "none",
        scrollTrigger: {
            trigger: line.parentElement,
            start: "top 60%",
            toggleActions: "play none none reset",
            duration: 1.5,
        },
        delay: index * 0.2, // stagger by 1.5 seconds
    })
})


//////////////////////////////////////////////////////////////////////////////////morph animation services inner pages
if (document.querySelector("#website-dev-morph-1")) {
    const websiteDevMorph = document.querySelector("#website-dev-morph-1");
    const websiteDevMorphTargets = [
        "#website-dev-morph-2",
        "#website-dev-morph-3",
        "#website-dev-morph-4",
        "#website-dev-morph-1",
    ]
        .map((selector) => document.querySelector(selector))
        .filter(Boolean);

    if (websiteDevMorph && websiteDevMorphTargets.length && typeof MorphSVGPlugin !== "undefined") {
        const websiteDevMorphTl = gsap.timeline({ repeat: -1 });

        websiteDevMorphTargets.forEach((target) => {
            websiteDevMorphTl.to(websiteDevMorph, {
                morphSVG: target,
                duration: 1.2,
                ease: "expo.inOut",
            });
        });
    }
}

// Prevent the accordion image column from stretching when items expand
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".faq-item").forEach((item) => {
        const parentFlex = item.closest(".flex");
        if (parentFlex) {
            parentFlex.classList.add("md:items-start");
        }
    });
});

// Parallax banner split text animation
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        const bannerLines = gsap.utils.toArray(".split-line-text");
        if (bannerLines.length > 0) {
            // Set initial state: translated down and hidden
            gsap.set(bannerLines, { yPercent: 110, opacity: 0 });

            gsap.to(bannerLines, {
                yPercent: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.25,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: bannerLines[0],
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }
});

