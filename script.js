// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    infinite: false,
});

if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// GSAP Plugins Registration
gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin);

ScrollTrigger.config({
    ignoreMobileResize: true,
});
ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
});

// FEATURE: Menu Toggle
{
    const openMenu = document.getElementById("openMenu");
    const closeMenu = document.getElementById("closeMenu");
    const menu = document.getElementById("fullscreenMenu");

    if (openMenu && closeMenu && menu) {
        const closeMenuFn = () => {
            menu.classList.remove("transition-opacity", "duration-300", "ease-in-out");
            menu.classList.add("opacity-0", "pointer-events-none");
            document.body.classList.remove("overflow-hidden");
        };

        openMenu.addEventListener("click", () => {
            menu.classList.add("transition-opacity", "duration-300", "ease-in-out");
            menu.classList.remove("opacity-0", "pointer-events-none");
            document.body.classList.add("overflow-hidden");
        });

        closeMenu.addEventListener("click", closeMenuFn);

        menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenuFn);
        });
    }
}

// FEATURE: SplitText Hero Animation
{
    document.fonts.ready.then(() => {
        const splitEl = document.querySelector(".split");
        if (splitEl) {
            gsap.set(splitEl, { opacity: 1 });
            SplitText.create(splitEl, {
                type: "words,lines",
                linesClass: "line",
                autoSplit: true,
                mask: "lines",
                onSplit: (self) => {
                    const splitTimeline = gsap.timeline({ paused: true })
                        .to({}, { duration: 0.3 })
                        .from(self.lines, {
                            duration: 2,
                            yPercent: 100,
                            opacity: 0,
                            stagger: 0.1,
                            ease: "expo.out",
                        });

                    const btn = document.querySelector("button");
                    if (btn) {
                        btn.addEventListener("click", () => {
                            splitTimeline.timeScale(1).play(0);
                        });
                    }
                    return splitTimeline;
                }
            });
        }
    });
}

// FEATURE: Services Slider (Home Page Exclusive)
if (document.body.classList.contains('home-page')) {
    const track = document.getElementById("services-track");
    const cards = track?.querySelectorAll(".card");
    const prevBtn = document.getElementById("previous-btn");
    const nextBtn = document.getElementById("next-btn");

    if (track && cards && cards.length > 0) {
        // Drag logic
        {
            let isDown = false;
            let startX, scrollLeft;

            track.addEventListener("mousedown", (e) => {
                isDown = true;
                track.classList.add("cursor-grabbing");
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
            });

            const stopDrag = () => {
                isDown = false;
                track.classList.remove("cursor-grabbing");
            };

            track.addEventListener("mouseleave", stopDrag);
            track.addEventListener("mouseup", stopDrag);

            track.addEventListener("mousemove", (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 1.4;
                track.scrollLeft = scrollLeft - walk;
            });

            track.addEventListener("touchstart", (e) => {
                startX = e.touches[0].pageX;
                scrollLeft = track.scrollLeft;
            }, { passive: true });

            track.addEventListener("touchmove", (e) => {
                const x = e.touches[0].pageX;
                const walk = (x - startX) * 1.4;
                track.scrollLeft = scrollLeft - walk;
            }, { passive: true });
        }

        // Auto-slide and Buttons
        {
            let index = 0;
            let interval = null;
            const delay = 2000;
            let isPaused = false;

            const scrollToIndex = (i) => {
                index = (i + cards.length) % cards.length;
                track.scrollTo({ left: cards[index].offsetLeft, behavior: "smooth" });
            };

            const slideNext = () => scrollToIndex(index + 1);
            const slidePrev = () => scrollToIndex(index - 1);

            const startAutoSlide = () => {
                if (interval || isPaused) return;
                interval = setInterval(slideNext, delay);
            };

            const stopAutoSlide = () => {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            };

            const pauseAutoSlide = () => { isPaused = true; stopAutoSlide(); };
            const resumeAutoSlide = () => { isPaused = false; startAutoSlide(); };

            nextBtn?.addEventListener("click", () => { stopAutoSlide(); slideNext(); startAutoSlide(); });
            prevBtn?.addEventListener("click", () => { stopAutoSlide(); slidePrev(); startAutoSlide(); });

            [track, prevBtn, nextBtn].forEach(el => {
                if (!el) return;
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
                onEnter: () => { if (!isPaused) startAutoSlide(); },
                onEnterBack: () => { if (!isPaused) startAutoSlide(); },
                onLeave: stopAutoSlide,
                onLeaveBack: stopAutoSlide
            });
        }
    }
}

// FEATURE: Fade-Up Global Animations
{
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
                toggleActions: "play none none reset",
            },
            delay: isFadeUp2 ? 0 : (isFadeUp ? i * 0.3 : 0)
        });
    });
}

// FEATURE: Progress Bars and Counters (Home Page)
if (document.body.classList.contains("home-page")) {
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
        // Progress bars
        {
            const progress1 = document.getElementById("progress-fill1");
            const progress2 = document.getElementById("progress-fill2");

            if (progress1) {
                gsap.fromTo(progress1,
                    { scaleX: 0, transformOrigin: "left center" },
                    {
                        scaleX: 0.98,
                        duration: 3,
                        scrollTrigger: { trigger: aboutSection, start: "top center", toggleActions: "play none none reset" }
                    }
                );
            }
            if (progress2) {
                gsap.fromTo(progress2,
                    { scaleX: 0, transformOrigin: "left center" },
                    {
                        scaleX: 0.85,
                        duration: 3,
                        scrollTrigger: { trigger: aboutSection, start: "top center", toggleActions: "play none none reset" }
                    }
                );
            }
        }

        // Counters
        {
            const el1 = document.getElementById("progress-count1");
            const el2 = document.getElementById("progress-count2");

            if (el1) {
                let counter1 = { value: 0 };
                gsap.to(counter1, {
                    value: 98, duration: 2, ease: "power1.out",
                    scrollTrigger: { trigger: aboutSection, start: "top center", toggleActions: "play none none reset" },
                    onUpdate: () => { el1.textContent = Math.floor(counter1.value) + "%"; }
                });
            }
            if (el2) {
                let counter2 = { value: 0 };
                gsap.to(counter2, {
                    value: 85, duration: 2, ease: "power1.out",
                    scrollTrigger: { trigger: aboutSection, start: "top center", toggleActions: "play none none reset" },
                    onUpdate: () => { el2.textContent = Math.floor(counter2.value) + "%"; }
                });
            }
        }
    }
}

// FEATURE: Morph SVG
{
    const morphPairs = [
        { from: "#grow-morph-1", to: "#grow-morph-2" },
        { from: "#cost-morph-1", to: "#cost-morph-2" },
        { from: "#boost-morph-1", to: "#boost-morph-2" }
    ];

    if (document.querySelector("#grow-morph-1")) {
        const morphTimeline = gsap.timeline({ repeat: -1, yoyo: true });
        morphPairs.forEach(pair => {
            if (document.querySelector(pair.from) && document.querySelector(pair.to)) {
                morphTimeline.to(pair.from, { morphSVG: pair.to, duration: 0.8, ease: "expo.inOut" });
            }
        });
    }
}

// FEATURE: Lottie Preview in Dropdown
{
    const navItems = document.querySelectorAll(".dropdown-link");
    const lottieContainer = document.getElementById("lottiePreview");
    let currentAnimation = null;

    if (lottieContainer) {
        navItems.forEach(item => {
            item.addEventListener("mouseenter", () => {
                const path = item.dataset.lottie;
                if (!path) return;
                if (currentAnimation) currentAnimation.destroy();
                currentAnimation = lottie.loadAnimation({
                    container: lottieContainer,
                    renderer: "svg", loop: true, autoplay: true, path: path
                });
            });
            item.addEventListener("mouseleave", () => {
                if (currentAnimation) currentAnimation.stop();
            });
        });
    }
}

// FEATURE: Sticky Popup and Cursor Follow
{
    window.addEventListener("load", () => {
        const button = document.querySelector("#pop-up");
        const text = button?.querySelector(".popup-text");
        const icon = button?.querySelector(".popup-icon");

        if (button && text && icon) {
            const finalWidth = icon.offsetWidth + 16;
            const popupTl = gsap.timeline({ delay: 0.3 });

            popupTl.from(button, { scale: 0.6, opacity: 0, y: 40, duration: 0.8, ease: "back.out(1.7)" })
                .to(text, { opacity: 0, x: -20, duration: 0.3, ease: "power2.out" }, "+=0.6")
                .to(button, { width: finalWidth, paddingLeft: 0, paddingRight: 0, duration: 0.5, ease: "power3.inOut" });
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        if (!document.body.classList.contains("home-page")) return;
        const target = document.getElementById("services-track");
        const cursor = document.getElementById("cursor-icon");

        if (target && cursor) {
            window.addEventListener("mousemove", (e) => {
                gsap.to(cursor, { x: e.clientX - 24, y: e.clientY - 24, duration: 0.5, ease: "power3.out" });
            });
            target.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.25, ease: "power3.out" }));
            target.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.2, ease: "power3.in" }));
        }
    });
}

// FEATURE: Header Global Control (Scroll, Hover, Logo)
{
    const header = document.getElementById("site-header");
    const navLinks = document.querySelectorAll('.nav-link');
    const icons = document.querySelectorAll(".whatsapp-icon-white, .phone-icon-white, .menu");
    const logo = document.getElementById("site-logo");

    if (header) {
        let isHeaderScrolled = false;
        let startValue = "top top";

        if (document.body.classList.contains("home-page")) {
            startValue = "1300px top";
        } else if (["about-page", "service-page", "website-page"].some(cls => document.body.classList.contains(cls))) {
            startValue = "300px top";
        }

        const swapLogo = (toBlack) => {
            const whiteLogo = logo?.src;
            const blackLogo = logo?.dataset.altSrc;
            if (!logo || !whiteLogo || !blackLogo) return;
            gsap.to(logo, {
                opacity: 0, duration: 0.1, onComplete: () => {
                    logo.src = toBlack ? blackLogo : whiteLogo;
                    gsap.to(logo, { opacity: 1, duration: 0.1 });
                }
            });
        };

        const updateStyles = (isScrolled) => {
            header.classList.toggle("bg-white", isScrolled);
            header.classList.toggle("shadow-xl", isScrolled);
            header.classList.toggle("shadow-gray-300/20", isScrolled);
            header.classList.toggle("bg-gradient-to-b", !isScrolled);
            header.classList.toggle("from-black", !isScrolled);
            header.classList.toggle("to-transparent", !isScrolled);

            navLinks.forEach(link => {
                link.classList.toggle("text-black", isScrolled);
                link.classList.toggle("text-white", !isScrolled);
            });

            icons.forEach(icon => {
                if (icon) icon.style.filter = isScrolled ? "invert(1)" : "invert(0)";
            });

            swapLogo(isScrolled);
        };

        ScrollTrigger.create({
            trigger: document.body,
            start: startValue,
            onToggle: (self) => {
                isHeaderScrolled = self.isActive;
                updateStyles(self.isActive);
            }
        });

        header.addEventListener("mouseenter", () => {
            if (!isHeaderScrolled) updateStyles(true);
        });

        header.addEventListener("mouseleave", () => {
            if (!isHeaderScrolled) updateStyles(false);
        });
    }
}

// FEATURE: Pinned Intro
{
    const pinnedSection = document.querySelector(".pinned-section");
    const tekhiveIcon = pinnedSection?.querySelector(".tekhive-icon");
    const tekhiveText = pinnedSection?.querySelector(".tekhive-text");

    if (pinnedSection && tekhiveIcon) {
        gsap.from(tekhiveIcon, {
            scale: 0.6, opacity: 0, delay: 0.7, duration: 2,
            scrollTrigger: { trigger: pinnedSection, start: "top top", end: "+=200%", pin: true, toggleActions: "play reverse play reverse" }
        });

        if (tekhiveText) {
            gsap.from(".logo-part", {
                opacity: 0, y: 20, scale: 0.8, rotate: 5, filter: "blur(6px)", duration: 1.2, ease: "expo.out", delay: 1.5,
                stagger: 0.12,
                scrollTrigger: { trigger: tekhiveText, start: "top top", end: "9999999" }
            });
        }
    }
}

// FEATURE: Parallax, Mask, and Reveal
{
    // Parallax
    const parallaxContainer = document.querySelector("#parallax-container");
    const parallaxImage = parallaxContainer?.querySelector(".parallax-img");
    if (parallaxContainer && parallaxImage) {
        gsap.fromTo(parallaxImage, { yPercent: -30 }, {
            yPercent: 20, ease: "none",
            scrollTrigger: { trigger: parallaxContainer, start: "top bottom", end: "bottom top", scrub: true }
        });
    }

    // Mask animation
    gsap.set(".mask", { xPercent: 0 });
    gsap.to(".mask", { xPercent: -100, duration: 1, ease: "power4.inOut", stagger: 0.15 });

    // Reveal Animation
    const sliceSection = document.querySelector(".slice-section");
    if (sliceSection) {
        gsap.set(".sliced-box", { y: 0 });
        gsap.timeline()
            .to(".sliced-box", { y: "-100%", duration: 1.2, stagger: 0.08, ease: "power4.inOut" })
            .set(sliceSection, { display: "none" });
    }

    // Secondary SplitText (General)
    const tekText = document.getElementById("tektext");
    if (tekText && typeof SplitType !== 'undefined') {
        const split = new SplitType(tekText, { types: "lines" });
        gsap.from(split.lines, {
            scrollTrigger: { trigger: tekText, start: "top 80%", toggleActions: "play none none reset" },
            yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power4.out", delay: 1
        });
    }

    // Ball Follower (About Hero)
    const aboutHero = document.getElementById("about-hero");
    const ball = document.querySelector(".ball");
    if (aboutHero && ball) {
        let isHovering = false;
        aboutHero.addEventListener("mouseenter", () => isHovering = true);
        aboutHero.addEventListener("mouseleave", () => isHovering = false);

        const setX = gsap.quickTo(ball, "x", { duration: 1.5, ease: "power3.out" });
        const setY = gsap.quickTo(ball, "y", { duration: 1.5, ease: "power3.out" });

        aboutHero.addEventListener("mousemove", (e) => {
            if (!isHovering) return;
            const rect = aboutHero.getBoundingClientRect();
            setX(e.clientX - rect.left - ball.offsetWidth / 1);
            setY(e.clientY - rect.top - ball.offsetHeight / 3);
        });
    }
}
