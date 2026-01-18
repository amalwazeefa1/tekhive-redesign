document.addEventListener("DOMContentLoaded", () => {
    const slideTexts = [
        "Turning Ideas Into Powerful Digital Products",
        "Crafting Seamless Mobile Experiences",
        "Empowering Your Brand with Tailored CMS Tools",
        "Turning Ideas into Influence",
    ];

    const wrapper = document.getElementById("wrapper");
    const slides = gsap.utils.toArray(".slide");
    const navItems = gsap.utils.toArray(".nav-item");
    const textEl = document.getElementById("text");
    const nextBtn = document.getElementById("next");

    let currentIndex = 0;
    let isAnimating = false;
    let startX = 0;
    let endX = 0;

    // ------------------------
    // Initial state
    // ------------------------
    gsap.set(slides, { xPercent: 100, zIndex: 0 });
    gsap.set(slides[0], { xPercent: 0, zIndex: 2 });

    // ------------------------
    // Update nav
    // ------------------------
    function updateNav(index) {
        navItems.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });
    }

    // ------------------------
    // Go to slide
    // ------------------------
    function gotoSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        let nextIndex = currentIndex + direction;
        if (nextIndex >= slides.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = slides.length - 1;

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[nextIndex];

        updateNav(nextIndex);

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
                gsap.set(currentSlide, { zIndex: 0 });
                isAnimating = false;
                currentIndex = nextIndex;
            },
        });

        gsap.set(nextSlide, { xPercent: 100, zIndex: 2 });

        tl.to(textEl, { opacity: 0, y: -30, duration: 0.4 }, 0)
            .add(() => {
                textEl.innerHTML = slideTexts[nextIndex];
            })
            .to(
                nextSlide,
                { xPercent: 0, duration: 1.8 },
                0
            )
            .to(
                textEl,
                { opacity: 1, y: 0, duration: 0.8 },
                1.1
            );
    }

    // ------------------------
    // Direct nav click
    // ------------------------
    function gotoSlideDirect(index) {
        if (index === currentIndex || isAnimating) return;
        gotoSlide(index > currentIndex ? 1 : -1);
    }

    // ------------------------
    // Touch & Mouse swipe
    // ------------------------
    function handleGesture() {
        const diff = endX - startX;
        if (diff < -50) gotoSlide(1);
        if (diff > 50) gotoSlide(-1);
    }

    wrapper.addEventListener("touchstart", (e) => {
        startX = e.changedTouches[0].screenX;
    });

    wrapper.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].screenX;
        handleGesture();
    });

    wrapper.addEventListener("mousedown", (e) => {
        startX = e.clientX;
    });

    wrapper.addEventListener("mouseup", (e) => {
        endX = e.clientX;
        handleGesture();
    });

    // ------------------------
    // Events
    // ------------------------
    navItems.forEach((item, index) => {
        item.addEventListener("click", () => gotoSlideDirect(index));
    });

    nextBtn.addEventListener("click", () => gotoSlide(1));
});
