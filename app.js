/* =======================================================
   QUESPER AI — PREMIUM INTERACTION ENGINE (WEB 2.0 REDESIGN)
======================================================= */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

/* =========================
   LENIS SMOOTH SCROLL
========================= */
let lenis;
try {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease out quint
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical'
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
} catch (e) {
    console.warn("Lenis initialization skipped, reverting to native scroll:", e);
}

/* =========================
   NAVBAR ANIMATION
========================= */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

/* =========================
   HERO INTRO ANIMATION
========================= */
const heroTl = gsap.timeline();
heroTl.from(".hero-badge", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
})
.from(".hero-title", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
}, "-=0.5")
.from(".hero-subtitle", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
}, "-=0.6")
.from(".hero-actions", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
}, "-=0.5")
.from(".hero-phone-wrapper", {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
}, "-=0.8");

/* =========================
   HERO 3D TILT EFFECT
========================= */
const heroPhoneWrapper = document.querySelector(".hero-phone-wrapper");
const heroPhone = document.querySelector(".hero-phone");

if (heroPhoneWrapper && heroPhone) {
    heroPhoneWrapper.addEventListener("mousemove", (e) => {
        const rect = heroPhoneWrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to wrapper center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Apply 3D rotation and translation
        gsap.to(heroPhone, {
            rotateY: x * 30,  // up to 15 deg left/right
            rotateX: y * -30, // up to 15 deg up/down
            x: x * 15,
            y: y * 15,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });

    heroPhoneWrapper.addEventListener("mouseleave", () => {
        // Return back to neutral rest position smoothly
        gsap.to(heroPhone, {
            rotateX: 0,
            rotateY: 0,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
}

/* =========================
   FLOATING MATH ANIMATIONS
========================= */
const floaters = [
    { selector: ".math-1", y: -25, r: 10, d: 3 },
    { selector: ".math-2", y: -20, r: -8, d: 3.5 },
    { selector: ".math-3", y: -30, r: 15, d: 4.2 },
    { selector: ".math-4", y: -18, r: -12, d: 2.8 },
    { selector: ".math-5", y: -28, r: 6, d: 3.8 }
];

floaters.forEach(f => {
    gsap.to(f.selector, {
        y: f.y,
        rotation: f.r,
        repeat: -1,
        yoyo: true,
        duration: f.d,
        ease: "sine.inOut"
    });
});

/* =========================
   STATISTICS COUNTERS
========================= */
document.querySelectorAll(".stat-number").forEach(counter => {
    const target = parseInt(counter.dataset.target);
    gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power3.out",
        scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

/* =========================
   TRUST LOGOS MARQUEE
========================= */
const marqueeLogos = document.querySelector(".trust-logos");
if (marqueeLogos) {
    gsap.to(marqueeLogos, {
        xPercent: -50,
        ease: "none",
        duration: 18,
        repeat: -1
    });
}

/* =========================
   STICKY SHOWCASE (Option C)
========================= */
const showcaseImg = document.getElementById("showcase-image");
const showcaseSteps = document.querySelectorAll(".showcase-step");

showcaseSteps.forEach((step, index) => {
    // Change images as user scrolls through each step
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        onEnter: () => updateShowcase(step),
        onEnterBack: () => updateShowcase(step)
    });
});

function updateShowcase(activeStep) {
    // Highlight step text on scroll
    showcaseSteps.forEach(step => step.classList.remove("active"));
    activeStep.classList.add("active");

    const newImageSrc = activeStep.dataset.image;

    // Fade out mockup image, switch sources, and fade back in
    gsap.to(showcaseImg, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        onComplete: () => {
            showcaseImg.src = newImageSrc;
            gsap.to(showcaseImg, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: "power2.out"
            });
        }
    });
}

// Pin the phone container during scroll storytelling
// Initialize GSAP matchMedia
let mm = gsap.matchMedia();

// Pin the phone container during scroll storytelling only on desktop
mm.add("(min-width: 992px)", () => {
    ScrollTrigger.create({
        trigger: ".showcase-section",
        start: "top top",
        end: "bottom bottom",
        pin: ".sticky-phone",
        pinSpacing: false
    });
});

/* =======================================================
   INTERACTIVE OCR PIPELINE SIMULATION
======================================================= */
const ocrResultsList = document.getElementById("ocr-results-list");
const resultsCountText = document.getElementById("results-count-text");
const laser = document.querySelector(".scan-laser");
const cropBox = document.querySelector(".crop-box");

const extractedQuestions = [
    {
        id: "q13",
        number: "Page 27 • 13",
        marks: "1 Mark",
        html: `
            <div class="question-card" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
                <div class="q-card-header">
                    <span class="q-tag">Page 27 • 13</span>
                    <span class="q-marks">1 Mark</span>
                </div>
                <div class="q-card-body">
                    <p class="q-text">
                        If <span class="math-expr">F(x) = </span>
                    </p>
                    <div class="matrix-container">
                        <span class="matrix-bracket left">[</span>
                        <div class="matrix-grid col-3">
                            <div class="matrix-cell">cos x</div>
                            <div class="matrix-cell">-sin x</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">sin x</div>
                            <div class="matrix-cell">cos x</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">1</div>
                        </div>
                        <span class="matrix-bracket right">]</span>
                    </div>
                    <p class="q-text" style="margin-top: 10px;">
                        show that <span class="math-expr">F(x) F(y) = F(x + y)</span>.
                    </p>
                </div>
                <div class="q-card-footer">
                    <button class="btn-add-section" onclick="toggleAddBtn(this)">
                        <span class="plus-icon">+</span> Add to Section
                    </button>
                </div>
            </div>
        `,
        crop: { top: "34%", left: "10%", width: "80%", height: "4.5%" }
    },
    {
        id: "q15",
        number: "Page 27 • 15",
        marks: "1 Mark",
        html: `
            <div class="question-card" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
                <div class="q-card-header">
                    <span class="q-tag">Page 27 • 15</span>
                    <span class="q-marks">1 Mark</span>
                </div>
                <div class="q-card-body">
                    <p class="q-text">
                        Find <span class="math-expr">A<sup>2</sup> - 5A + 6I</span>, if 
                        <span class="math-expr">A = </span>
                    </p>
                    <div class="matrix-container">
                        <span class="matrix-bracket left">[</span>
                        <div class="matrix-grid col-3">
                            <div class="matrix-cell">2</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">1</div>
                            <div class="matrix-cell">2</div>
                            <div class="matrix-cell">1</div>
                            <div class="matrix-cell">3</div>
                            <div class="matrix-cell">1</div>
                            <div class="matrix-cell">-1</div>
                            <div class="matrix-cell">0</div>
                        </div>
                        <span class="matrix-bracket right">]</span>
                    </div>
                </div>
                <div class="q-card-footer">
                    <button class="btn-add-section" onclick="toggleAddBtn(this)">
                        <span class="plus-icon">+</span> Add to Section
                    </button>
                </div>
            </div>
        `,
        crop: { top: "50%", left: "10%", width: "80%", height: "4.5%" }
    },
    {
        id: "q16",
        number: "Page 27 • 16",
        marks: "1 Mark",
        html: `
            <div class="question-card" style="opacity: 0; transform: translateY(20px); transition: all 0.5s ease;">
                <div class="q-card-header">
                    <span class="q-tag">Page 27 • 16</span>
                    <span class="q-marks">1 Mark</span>
                </div>
                <div class="q-card-body">
                    <p class="q-text">
                        If <span class="math-expr">A = </span>
                    </p>
                    <div class="matrix-container">
                        <span class="matrix-bracket left">[</span>
                        <div class="matrix-grid col-3">
                            <div class="matrix-cell">1</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">2</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">2</div>
                            <div class="matrix-cell">1</div>
                            <div class="matrix-cell">2</div>
                            <div class="matrix-cell">0</div>
                            <div class="matrix-cell">3</div>
                        </div>
                        <span class="matrix-bracket right">]</span>
                    </div>
                    <p class="q-text" style="margin-top: 10px;">
                        prove that <span class="math-expr">A<sup>3</sup> - 6A<sup>2</sup> + 7A + 2I = O</span>.
                    </p>
                </div>
                <div class="q-card-footer">
                    <button class="btn-add-section" onclick="toggleAddBtn(this)">
                        <span class="plus-icon">+</span> Add to Section
                    </button>
                </div>
            </div>
        `,
        crop: { top: "55%", left: "10%", width: "80%", height: "4.5%" }
    }
];

// Helper to make button interactive
window.toggleAddBtn = function(btn) {
    if (btn.classList.contains("added")) {
        btn.classList.remove("added");
        btn.innerHTML = `<span class="plus-icon">+</span> Add to Section`;
    } else {
        btn.classList.add("added");
        btn.innerHTML = `✓ Added`;
    }
};

let ocrSimulationStarted = false;

// Trigger OCR Simulation when section is in view
ScrollTrigger.create({
    trigger: ".ocr-story-wrapper",
    start: "top 70%",
    onEnter: () => {
        if (!ocrSimulationStarted) {
            ocrSimulationStarted = true;
            runOcrSimulation();
        }
    }
});

async function runOcrSimulation() {
    // 1. Reset steps
    const step1 = document.getElementById("ocr-step-1");
    const step2 = document.getElementById("ocr-step-2");
    const step3 = document.getElementById("ocr-step-3");
    const step4 = document.getElementById("ocr-step-4");
    const steps = [step1, step2, step3, step4];
    const lines = document.querySelectorAll(".ocr-line-v");
    
    steps.forEach(s => s.classList.remove("active"));
    lines.forEach(l => l.classList.remove("active"));
    cropBox.style.opacity = 0;
    
    // 2. Start Scanning (Step 1)
    step1.classList.add("active");
    resultsCountText.textContent = "Scanning...";
    ocrResultsList.innerHTML = `
        <div class="ocr-empty-state" id="ocr-empty-state">
            <div class="spinner-ring"></div>
            <p>Scanning textbook page...</p>
        </div>
    `;
    
    // Activate laser sweep
    laser.style.display = "block";
    gsap.killTweensOf(laser);
    gsap.fromTo(laser, { top: "0%" }, {
        top: "95%",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Start Detecting (Step 2)
    step2.classList.add("active");
    lines[0].classList.add("active");
    const emptyStateText = document.querySelector("#ocr-empty-state p");
    if (emptyStateText) emptyStateText.textContent = "Detecting math equations...";
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear empty state
    ocrResultsList.innerHTML = "";
    resultsCountText.textContent = "Extracting...";
    
    // 4. Render and Scan individual questions (Step 3)
    step3.classList.add("active");
    lines[1].classList.add("active");
    
    // Change laser to a slower, localized scanning line or keep it subtle
    gsap.killTweensOf(laser);
    laser.style.display = "none"; // Hide laser, cropBox will take over
    
    for (let i = 0; i < extractedQuestions.length; i++) {
        const q = extractedQuestions[i];
        
        // Show cropbox over question
        cropBox.style.top = q.crop.top;
        cropBox.style.left = q.crop.left;
        cropBox.style.width = q.crop.width;
        cropBox.style.height = q.crop.height;
        cropBox.style.borderColor = "var(--accent-primary)";
        cropBox.style.backgroundColor = "rgba(255, 107, 53, 0.08)";
        gsap.to(cropBox, { opacity: 1, scale: 1, duration: 0.3 });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Append question card
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = q.html;
        const cardNode = tempDiv.firstElementChild;
        ocrResultsList.appendChild(cardNode);
        
        // Trigger reflow & fade in card
        setTimeout(() => {
            cardNode.style.opacity = "1";
            cardNode.style.transform = "translateY(0)";
            ocrResultsList.scrollTop = ocrResultsList.scrollHeight;
        }, 50);
        
        resultsCountText.textContent = `${i + 1} Question${i > 0 ? 's' : ''} parsed`;
        
        await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    // 5. Complete / Compile (Step 4)
    step4.classList.add("active");
    lines[2].classList.add("active");
    resultsCountText.textContent = "3 Questions Extracted";
    
    // Pulse cropbox to green success outline
    cropBox.style.top = "33%";
    cropBox.style.height = "28%"; // Cover all 3 scanned questions
    gsap.to(cropBox, {
        borderColor: "#00FF66",
        backgroundColor: "rgba(0, 255, 102, 0.03)",
        duration: 0.5
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fade out crop box slowly
    gsap.to(cropBox, { opacity: 0, duration: 0.8 });
}

/* =======================================================
   3D CARD DECK PARALLAX TILT (Product Gallery)
======================================================= */
const galleryCards = document.querySelectorAll(".gallery-card");

galleryCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate pointer coordinates inside card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Map dimensions to tilt degree rotation limits (-15 to 15)
        const rotateY = ((x / rect.width) - 0.5) * 30;
        const rotateX = ((y / rect.height) - 0.5) * -30;

        gsap.to(card, {
            rotateY: rotateY,
            rotateX: rotateX,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });

    card.addEventListener("mouseleave", () => {
        // Return card to fanned wave position state on mouse leave
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out"
        });
    });
});

/* =========================
   SCROLL REVEALS
========================= */
// Bento features stagger fade-in
gsap.from(".bento-card", {
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".bento-grid",
        start: "top 80%"
    }
});

// Architecture Nodes stagger fade-in
gsap.from(".arch-node-card", {
    scale: 0.9,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: "back.out(1.5)",
    scrollTrigger: {
        trigger: ".arch-nodes-grid",
        start: "top 80%"
    }
});

// Testimonials staggers
gsap.from(".testimonial-card", {
    y: 60,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".testimonial-grid",
        start: "top 85%"
    }
});

// Pricing cards slide-up staggers
gsap.from(".pricing-card", {
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".pricing-grid",
        start: "top 80%"
    }
});

// Founder Card scale up on viewport arrival
gsap.from(".founder-card", {
    scale: 0.95,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".founder-card",
        start: "top 85%"
    }
});

// Parallax scroll on hero gradient glow
gsap.to(".hero-gradient", {
    y: 120,
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Gallery Tabs Toggle Logic
const tabButtons = document.querySelectorAll(".gallery-tab-btn");
const tabContents = document.querySelectorAll(".gallery-tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;

        // Toggle active button class
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Toggle active content display with fade animation
        tabContents.forEach(content => {
            if (content.id === `tab-${targetTab}`) {
                content.style.display = "block";
                gsap.fromTo(content, {
                    opacity: 0,
                    y: 20
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        ScrollTrigger.refresh(); // Recalculate ScrollTrigger offsets as layout shifted
                    }
                });
            } else {
                content.style.display = "none";
            }
        });
    });
});

// Refresh ScrollTrigger positions after page loading is fully done
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});
