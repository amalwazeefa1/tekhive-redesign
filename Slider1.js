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

    const wrapper = document.getElementById("wrapper");
    const slides = gsap.utils.toArray(".slide");
    const navItems = gsap.utils.toArray(".nav-item");
    const textEl = document.getElementById("text");
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
            if (!isAnimating) gotoSlide(1);
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

    /* ------------------------
       UPDATE NAV
    ------------------------ */
    function updateNav(index) {
        navItems.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });

        const activeItem = navItems[index];
        if (activeItem && nav) {
            if (window.innerWidth < 768) {
                // Calculate statically to avoid layout transition delay issues
                const navWidth = nav.offsetWidth;
                const itemOffset = 24 + index * 48; // px-6 (24px) + index * (w-10 (40px) + gap-2 (8px))
                const itemWidth = 250; // group-[.active]:w-[250px]
                const scrollTarget = itemOffset - (navWidth / 2) + (itemWidth / 2);

                nav.scrollTo({
                    left: scrollTarget,
                    behavior: "smooth"
                });
            }
        }
    }

    /* ------------------------
       GO TO SLIDE
    ------------------------ */
    function gotoSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        let nextIndex = currentIndex + direction;
        if (nextIndex >= slides.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = slides.length - 1;

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
    //     if (diff < -50) gotoSlide(1);
    //     if (diff > 50) gotoSlide(-1);
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
            const direction = index > currentIndex ? 1 : -1;
            if (index !== currentIndex && !isAnimating) gotoSlide(direction);
            startAutoSlide();
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            stopAutoSlide();
            gotoSlide(1);
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
