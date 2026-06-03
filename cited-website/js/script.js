/* =============================================================
   script.js — CITED website main JavaScript
   - Navbar scroll behavior
   - Mobile hamburger menu
   - Scroll reveal animations
   - Animated counters
   - Gallery lightbox
   - Volunteer form -> Firebase Firestore
   ============================================================= */

import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------- 1. NAVBAR scroll + mobile menu ---------- */
const navbar = document.querySelector(".navbar");
const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll);
onScroll();

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
        a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
}

/* ---------- 2. SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add("visible"));
}

/* ---------- 3. ANIMATED COUNTERS ---------- */
const counters = document.querySelectorAll("[data-counter]");
const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};
if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                cio.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
}

/* ---------- 4. GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
if (lightbox && lightboxImg) {
    document.querySelectorAll(".masonry-item img").forEach(img => {
        img.addEventListener("click", () => {
            lightboxImg.src = img.src;
            lightbox.classList.add("open");
        });
    });
    const close = () => lightbox.classList.remove("open");
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("close")) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ---------- 5. CURRENT YEAR in footer ---------- */
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* ---------- 6. JOIN / VOLUNTEER FORM -> FIRESTORE ---------- */
const joinForm = document.getElementById("join-form");
if (joinForm) {
    const submitBtn = joinForm.querySelector("button[type=submit]");
    const formCard = document.getElementById("form-card");
    const successBox = document.getElementById("form-success");

    // Helper: show/clear an error on a field
    const setError = (name, message) => {
        const field = joinForm.querySelector(`[data-field="${name}"]`);
        if (!field) return;
        const msg = field.querySelector(".error-msg");
        if (message) { field.classList.add("error"); if (msg) msg.textContent = message; } else { field.classList.remove("error"); if (msg) msg.textContent = ""; }
    };

    const validate = (data) => {
        let ok = true;
        if (!data.fullName || data.fullName.length < 2) {
            setError("fullName", "Please enter your full name.");
            ok = false;
        } else setError("fullName", "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setError("email", "Please enter a valid email.");
            ok = false;
        } else setError("email", "");
        if (!data.phone || data.phone.length < 6) {
            setError("phone", "Please enter a valid phone number.");
            ok = false;
        } else setError("phone", "");
        if (!data.skills || data.skills.length < 2) {
            setError("skills", "Tell us about your skills or interests.");
            ok = false;
        } else setError("skills", "");
        if (!data.reason || data.reason.length < 10) {
            setError("reason", "Share a little more (10+ characters).");
            ok = false;
        } else setError("reason", "");
        return ok;
    };

    joinForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const data = {
            fullName: joinForm.fullName.value.trim(),
            email: joinForm.email.value.trim(),
            phone: joinForm.phone.value.trim(),
            skills: joinForm.skills.value.trim(),
            reason: joinForm.reason.value.trim(),
        };
        if (!validate(data)) return;

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";

        try {
            // Save to Firestore — collection "members"
            await addDoc(collection(db, "members"), {
                ...data,
                createdAt: serverTimestamp(),
            });

            // Success: clear form and switch to success message
            joinForm.reset();
            if (formCard && successBox) {
                formCard.style.display = "none";
                successBox.style.display = "block";
                successBox.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        } catch (err) {
            console.error("Firestore error:", err);
            alert("Sorry, we couldn't save your registration. Please check your Firebase setup in js/firebase-config.js and try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // "Send another response" button
    const againBtn = document.getElementById("submit-again");
    if (againBtn) {
        againBtn.addEventListener("click", () => {
            successBox.style.display = "none";
            formCard.style.display = "block";
            formCard.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }
}

/* ---------- 7. CONTACT FORM -> EmailJS (sends to owner inbox) ---------- */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    // Initialise EmailJS once the SDK + config are loaded
    if (window.emailjs && window.EMAILJS_PUBLIC_KEY) {
        try { emailjs.init({ publicKey: window.EMAILJS_PUBLIC_KEY }); } catch (e) {}
    }

    const cStatus = document.getElementById("contact-status");
    const cSuccess = document.getElementById("contact-success");
    const cBtn = contactForm.querySelector("button[type=submit]");

    const setStatus = (msg, isError = false) => {
        if (!cStatus) return;
        cStatus.textContent = msg || "";
        cStatus.style.color = isError ? "#dc2626" : "var(--muted)";
    };

    contactForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const name = document.getElementById("cname").value.trim();
        const email = document.getElementById("cemail").value.trim();
        const message = document.getElementById("cmessage").value.trim();

        if (name.length < 2) { setStatus("Please enter your name.", true); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("Please enter a valid email.", true); return; }
        if (message.length < 10) { setStatus("Please write at least 10 characters.", true); return; }

        if (!window.emailjs || window.EMAILJS_PUBLIC_KEY === "REPLACE_ME_PUBLIC_KEY") {
            setStatus("Email service not configured yet. See js/emailjs-config.js.", true);
            return;
        }

        const originalText = cBtn.textContent;
        cBtn.disabled = true;
        cBtn.textContent = "Sending...";
        setStatus("Sending your message...");

        try {
            await emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                message: message,
                reply_to: email,
            });
            contactForm.reset();
            setStatus("");
            if (cSuccess) {
                cSuccess.style.display = "block";
                cSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => { cSuccess.style.display = "none"; }, 6000);
            }
        } catch (err) {
            console.error("EmailJS error:", err);
            setStatus("Sorry — couldn't send right now. Please try again or email us directly.", true);
        } finally {
            cBtn.disabled = false;
            cBtn.textContent = originalText;
        }
    });
}

/* ---------- 8. NEWSLETTER SUBSCRIBE -> Firestore ---------- */
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
    const nStatus = document.getElementById("newsletter-status");
    const nSuccess = document.getElementById("newsletter-success");
    const nInput = document.getElementById("newsletter-email");
    const nBtn = newsletterForm.querySelector("button[type=submit]");

    const setNStatus = (msg, isError = false) => {
        if (!nStatus) return;
        nStatus.textContent = msg || "";
        nStatus.style.color = isError ? "#fecaca" : "rgba(255,255,255,0.75)";
    };

    newsletterForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const email = (nInput.value || "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setNStatus("Please enter a valid email.", true);
            return;
        }

        const originalText = nBtn.textContent;
        nBtn.disabled = true;
        nBtn.textContent = "Subscribing...";
        setNStatus("");

        try {
            await addDoc(collection(db, "subscribers"), {
                email,
                source: "newsletter",
                createdAt: serverTimestamp(),
            });
            newsletterForm.reset();
            newsletterForm.style.display = "none";
            if (nSuccess) nSuccess.style.display = "block";
        } catch (err) {
            console.error("Firestore subscribe error:", err);
            setNStatus("Couldn't subscribe right now. Please try again.", true);
            nBtn.disabled = false;
            nBtn.textContent = originalText;
        }
    });
}