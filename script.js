// ------------------------------
// Product gallery data
// ------------------------------
const galleries = {
  // Naruto
  "product-1": [
    "images/055.png",
    "images/066.png",
    "images/1 (4).png",
    "images/1 (2) (1).png",

  ],
  // Tokyo Ghoul + AOT
  "product-2": [
    "images/04-01-01.png",
    "images/05-01-01.png",
    "images/10-01-01.png",

  ],
  // One Piece (and extras)
  "product-3": [
    "images/1 (5).png",
    "images/1 (6).png",
    "images/1 (7).png",

  ],
  "product-4": [
    "images/7 (1).png",
    "images/4 (1).png",
    "images/6.png",
    "images/1 (8).png",

  ],
  "product-5": [
    "images/044.jpg",
    "images/011.png",
    "images/022.png",
    "images/033.png",
  ],
  "product-6": [
    "images/1 (9).png",
    "images/7.jpg",
    "images/TAZAS DEMON SLAYER.jpg",
  ],
};

let activeGalleryKey = null;
let activeIndex = 0;

// Cache DOM references
const modal = document.getElementById("galleryModal");
const modalImage = document.getElementById("modalImage");
const modalCounter = document.getElementById("modalCounter");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

// ------------------------------
// Modal helpers
// ------------------------------
function updateModalImage() {
  if (!activeGalleryKey || !galleries[activeGalleryKey]) return;

  const images = galleries[activeGalleryKey];
  const clampedIndex = ((activeIndex % images.length) + images.length) % images.length;
  activeIndex = clampedIndex;

  const newSrc = images[clampedIndex];

  // Soft fade transition between images
  modalImage.classList.add("is-fading");
  setTimeout(() => {
    modalImage.src = newSrc;
    modalImage.onload = () => {
      modalImage.classList.remove("is-fading");
    };
  }, 160);

  if (modalCounter) {
    modalCounter.textContent = `${clampedIndex + 1} / ${images.length}`;
  }
}

function openModal(galleryKey) {
  const images = galleries[galleryKey];
  if (!images || !images.length) return;

  activeGalleryKey = galleryKey;
  activeIndex = 0;

  if (modal) {
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  }

  updateModalImage();

  // Prevent body scroll while modal is open
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (modal) {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
}

// ------------------------------
// Event wiring
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // View preview buttons
  const previewButtons = document.querySelectorAll(".view-preview");
  previewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const galleryKey = btn.getAttribute("data-gallery");
      openModal(galleryKey);
    });
  });

  // Modal navigation
  if (modalPrev) {
    modalPrev.addEventListener("click", () => {
      activeIndex -= 1;
      updateModalImage();
    });
  }

  if (modalNext) {
    modalNext.addEventListener("click", () => {
      activeIndex += 1;
      updateModalImage();
    });
  }

  // Close modal via backdrop or close buttons
  document.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  // Close on Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"], [data-scroll]').forEach((el) => {
    el.addEventListener("click", (event) => {
      const targetSelector =
        el.getAttribute("href")?.startsWith("#") && el.getAttribute("href").length > 1
          ? el.getAttribute("href")
          : el.getAttribute("data-scroll");

      if (!targetSelector || !targetSelector.startsWith("#")) return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Scroll-triggered animations using IntersectionObserver
  const animatedElements = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window && animatedElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2,
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show immediately if IntersectionObserver not supported
    animatedElements.forEach((el) => el.classList.add("in-view"));
  }
});


