//////////////////////////////////////////////////////////////////////////////for optimized scroll performance4
gsap.registerPlugin(ScrollTrigger, SplitText, MorphSVGPlugin, ScrollTrigger);
ScrollTrigger.config({
    ignoreMobileResize: true,
});
ScrollTrigger.normalizeScroll(true);
ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
});


//////////////////////////////////////////////////////////////////////////////hero section animation
window.addEventListener("DOMContentLoaded", () => {
    gsap.set("#hero", { maxWidth: "88%", borderRadius: "30px" });

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




///////////////////////////////////////////////////////////////////////
// AUTO CARD SLIDE + GSAP SCROLL TRIGGER
///////////////////////////////////////////////////////////////////////

// Elements
const track = document.getElementById("services-track");
const cards = track.querySelectorAll(".card");

const prevBtn = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");

// GSAP
gsap.registerPlugin(ScrollTrigger);

// State
let index = 0;
let interval = null;
const delay = 2500;
let isPaused = false;

///////////////////////////////////////////////////////////////////////
// SLIDE LOGIC
///////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////
// PAUSE ON HOVER / TOUCH
///////////////////////////////////////////////////////////////////////

// Buttons hover (desktop)
prevBtn.addEventListener("mouseenter", stopAutoSlide);
nextButton.addEventListener("mouseenter", stopAutoSlide);
prevBtn.addEventListener("mouseleave", resumeAutoSlide);
nextButton.addEventListener("mouseleave", resumeAutoSlide);

// Buttons touch (mobile)
prevBtn.addEventListener("touchstart", stopAutoSlide, { passive: true });
nextButton.addEventListener("touchstart", stopAutoSlide, { passive: true });
prevBtn.addEventListener("touchend", resumeAutoSlide);
nextButton.addEventListener("touchend", resumeAutoSlide);

// Track hover
track.addEventListener("mouseenter", stopAutoSlide);
track.addEventListener("mouseleave", resumeAutoSlide);

// Track touch (mobile)
track.addEventListener("touchstart", stopAutoSlide, { passive: true });
track.addEventListener("touchend", resumeAutoSlide);

///////////////////////////////////////////////////////////////////////
// GSAP SCROLL TRIGGER (START / STOP ON VIEW)
///////////////////////////////////////////////////////////////////////
ScrollTrigger.create({
    trigger: "#services-section",
    start: "top 70%",
    end: "bottom 30%",

    onEnter: () => {
        resumeAutoSlide();
    },

    onEnterBack: () => {
        resumeAutoSlide();
    },

    onLeave: () => {
        stopAutoSlide();
    },

    onLeaveBack: () => {
        stopAutoSlide();
    }
});





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
            trigger: el,
            start: isFadeUp2 ? "top 70%" : "top 80%",
            toggleActions: isFadeUp2 ? "play reverse play reverse" : "play reverse play reverse",
        },
        delay: isFadeUp2
            ? 0          // fade-up2 starts immediately
            : isFadeUp
                ? i * 0.3  // fade-up staggers by index
                : 0
    })
})

////////////////////////////////////////////////////////////////////////////////progress bar animation
gsap.fromTo(
    "#progress-fill1",
    { scaleX: 0 },
    {
        scaleX: 0.98,
        duration: 3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#about-us",
            start: "top center",
            toggleActions: "play reverse play reverse"
        }
    }
);
gsap.fromTo(
    "#progress-fill2",
    { scaleX: 0 },
    {
        scaleX: 0.85,
        duration: 3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#about-us",
            start: "top center",
            toggleActions: "play reverse play reverse"
        }
    }
);


////////////////////////////////////////////////////////////////////////////////////counter animation
//first counter
let counter1 = { value: 0 };
gsap.to(counter1, {
    value: 98,
    duration: 2,
    ease: "power1.out",
    scrollTrigger: {
        trigger: "#about-us",
        start: "top center",
        toggleActions: "play reverse play reverse"
    },
    onUpdate: () => {
        document.getElementById("progress-count1").textContent = Math.floor(counter1.value) + "%";
    }
})

//second counter
let counter2 = { value: 0 };
gsap.to(counter2, {
    value: 85,
    duration: 2,
    ease: "power1.out",
    scrollTrigger: {
        trigger: "#about-us",
        start: "top center",
        toggleActions: "play reverse play reverse"
    },
    onUpdate: () => {
        document.getElementById("progrss-count2").textContent = Math.floor(counter2.value) + "%";
    }
})

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

const tl = gsap.timeline({ repeat: -1, yoyo: true });

morphPairs.forEach(pair => {
    tl.to(pair.from, {
        morphSVG: pair.to,
        duration: 0.8,
        ease: "expo.inOut"
    })
})


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


const navItems = document.querySelectorAll(".dropdown-link");
const lottieContainer = document.getElementById("lottiePreview");

let currentAnimation = null;

navItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
        const path = item.dataset.lottie;
        if (!path) return;

        // Destroy previous animation
        if (currentAnimation) {
            currentAnimation.destroy();
        }

        // Load new animation
        currentAnimation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: path
        });
    });

    item.addEventListener("mouseleave", () => {
        if (currentAnimation) {
            currentAnimation.stop();
        }
    });
});


//////////////////////////////////////////////////////////////////////////////carousel buttons
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");
previousBtn.addEventListener("click", () => {
    index--;

    if (index < 0) {
        index = cards.length - 1;
    }
    track.scrollTo({
        left: cards[index].offsetLeft,
        behavior: "smooth",
    });
}
);

nextBtn.addEventListener("click", () => {
    index++;
    if (index >= cards.length) {
        index = 0;
    }
    track.scrollTo({
        left: cards[index].offsetLeft,
        behavior: "smooth",
    });
});


///////////////////////////////////////////////////////////////////////////////popup button gsap animation
window.addEventListener("load", () => {
    gsap.from("#pop-up", {
        scale: 0.6,
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "back.out(1.7",
        delay: 0.3
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
    ease: "back.out(1.7)"
  })

  // 2️⃣ Fade + slide text out
  tl.to(text, {
    opacity: 0,
    x: -20,
    duration: 0.3,
    ease: "power2.out"
  }, "+=0.6")

  // 3️⃣ Shrink button to icon size
  tl.to(button, {
    width: finalWidth,
    paddingLeft: 0,
    paddingRight: 0,
    duration: 0.5,
    ease: "power3.inOut"
  })
})



////////////////////////////////////////////////////////////////////////////icon when hover gsap animation
const target = document.getElementById("services-track");
  const cursor = document.getElementById("cursor-icon");

  // Smooth follow
  window.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX - 24,
      y: e.clientY - 24,
      duration: 0.3,
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
      duration: 0.25,
      ease: "power3.in",
    });
  });

  

  document.querySelectorAll('img[data-alt-src]').forEach(img => {
  img.addEventListener('click', () => {
    const current = img.src;
    img.src = img.dataset.altSrc;
    img.dataset.altSrc = current; // swap back
  });
});
