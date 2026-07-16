document.addEventListener("DOMContentLoaded", () => {
    const slideTexts = [
        "Turning Ideas Into Powerful Digital Products", // 01 Web Development
        "Building High-Conversion E-Commerce Stores", // 02 Ecommerce Solutions
        "Crafting Seamless Mobile Experiences", // 03 Mobile App Development
        "Empowering Your Brand with Tailored CMS Tools", // 04 CMS Development
        "Helping Brands Grow with Digital Marketing", // 05 Digital Marketing
        "Connecting Systems with Seamless Integrations", // 06 Third Party App Integration
        "Centralizing Customer Data and Driving Sales", // 07 CRM
    ];

    const slideLinks = [
        "website-development.html", // 01 Web Development
        "e-commerce.html", // 02 Ecommerce Solutions
        "mobile-app-development.html", // 03 Mobile App Development
        "cms-development.html", // 04 CMS Development
        "digital-marketing.html", // 05 Digital Marketing
        "third-party-app-integration.html", // 06 Third Party App Integration
        "crm.html", // 07 CRM
    ];

    const wrapper = document.getElementById("wrapper");
    const slides = gsap.utils.toArray(".slide");
    const navItems = gsap.utils.toArray(".nav-item");
    const textEl = document.getElementById("text");
    const exploreBtn = document.getElementById("hero-explore-btn");
    const nextBtn = document.getElementById("next");
    const nav = document.getElementById("nav");

    let currentIndex = 0;
    let isAnimating = false;
    let startX = 0;
    let endX = 0;

    /* ------------------------
       AUTO SLIDE CONFIG
    ------------------------ */
    let autoSlideInterval = null;
    const AUTO_DELAY = 5000; // 5 seconds

    function startAutoSlide() {
        if (autoSlideInterval) return;
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) nextIndex = 0;
                gotoSlide(nextIndex, 1);
            }
        }, AUTO_DELAY);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    /* ------------------------
       INITIAL STATE
    ------------------------ */
    gsap.set(slides, { xPercent: 100, zIndex: 0 });
    gsap.set(slides[0], { xPercent: 0, zIndex: 2 });
    gsap.set(".slide-bg", { xPercent: 0 });
    updateNav(0);

    /* ------------------------
       UPDATE NAV
    ------------------------ */
    function updateNav(index) {
        navItems.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });

        const activeItem = navItems[index];
        if (activeItem && nav) {
            // Align the active pagination item to the left side (offset by 24px padding)
            // so that lengthy text has maximum screen width to be fully visible on the right.
            const scrollTarget = index * 48;

            gsap.to(nav, {
                scrollLeft: scrollTarget,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    }

    /* ------------------------
       GO TO SLIDE
    ------------------------ */
    function gotoSlide(nextIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];
        const currentBg = currentSlide.querySelector(".slide-bg");
        const nextBg = nextSlide.querySelector(".slide-bg");

        updateNav(nextIndex);

        const startXPercent = direction * 100;
        const endXPercent = -direction * 100;
        const startBgXPercent = -direction * 30; // parallax offset (slides opposite way)
        const endBgXPercent = direction * 30;

        // Set layout & start positions
        gsap.set(currentSlide, { zIndex: 1 });
        gsap.set(nextSlide, { xPercent: startXPercent, zIndex: 2 });
        gsap.set(nextBg, { xPercent: startBgXPercent });

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                // reset all non-active slides
                slides.forEach((slide, idx) => {
                    if (idx !== nextIndex) {
                        gsap.set(slide, { xPercent: 100, zIndex: 0 });
                    }
                });
                gsap.set(nextSlide, { zIndex: 2 });
                isAnimating = false;
                currentIndex = nextIndex;
            },
        });

        tl.to(textEl, { opacity: 0, y: -30, duration: 0.4 }, 0)
            .add(() => {
                textEl.innerHTML = slideTexts[nextIndex];
                if (exploreBtn) {
                    exploreBtn.setAttribute("href", slideLinks[nextIndex]);
                }
            })
            .to(currentSlide, { xPercent: endXPercent, duration: 1.8 }, 0)
            .to(currentBg, { xPercent: endBgXPercent, duration: 1.8 }, 0)
            .to(nextSlide, { xPercent: 0, duration: 1.8 }, 0)
            .to(nextBg, { xPercent: 0, duration: 1.8 }, 0)
            .to(textEl, { opacity: 1, y: 0, duration: 0.8 }, 1.1);
    }

    // /* ------------------------
    //    DIRECT NAV CLICK
    // ------------------------ */
    // function gotoSlideDirect(index) {
    //     if (index === currentIndex || isAnimating) return;
    //     gotoSlide(index > currentIndex ? 1 : -1);
    // }

    // /* ------------------------
    //    TOUCH & MOUSE SWIPE
    // ------------------------ */
    // function handleGesture() {
    //     const diff = endX - startX;
    //     if (diff < -50) {
    //         let nextIndex = currentIndex + 1;
    //         if (nextIndex >= slides.length) nextIndex = 0;
    //         gotoSlide(nextIndex, 1);
    //     }
    //     if (diff > 50) {
    //         let nextIndex = currentIndex - 1;
    //         if (nextIndex < 0) nextIndex = slides.length - 1;
    //         gotoSlide(nextIndex, -1);
    //     }
    // }

    // wrapper.addEventListener("touchstart", (e) => {
    //     startX = e.changedTouches[0].screenX;
    //     stopAutoSlide();
    // });

    // wrapper.addEventListener("touchend", (e) => {
    //     endX = e.changedTouches[0].screenX;
    //     handleGesture();
    //     startAutoSlide();
    // });

    // wrapper.addEventListener("mousedown", (e) => {
    //     startX = e.clientX;
    //     stopAutoSlide();
    // });

    // wrapper.addEventListener("mouseup", (e) => {
    //     endX = e.clientX;
    //     handleGesture();
    //     startAutoSlide();
    // });

    /* ------------------------
       EVENTS
    ------------------------ */
    navItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            stopAutoSlide();
            if (index !== currentIndex && !isAnimating) {
                const direction = index > currentIndex ? 1 : -1;
                gotoSlide(index, direction);
            }
            startAutoSlide();
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            stopAutoSlide();
            if (!isAnimating) {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) nextIndex = 0;
                gotoSlide(nextIndex, 1);
            }
            startAutoSlide();
        });
    }

    // /* ------------------------
    //    PAUSE ON NAV HOVER
    // ------------------------ */
    // nav.addEventListener("mouseenter", stopAutoSlide);
    // nav.addEventListener("mouseleave", startAutoSlide);

    /* ------------------------
       START AUTO SLIDE
    ------------------------ */
    startAutoSlide();
});
