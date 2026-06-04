document.addEventListener("DOMContentLoaded", () => {
  // Mobile Nav Drawer Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      // Animate hamburger lines
      const spans = menuToggle.querySelectorAll("span");
      if (mobileNav.classList.contains("open")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 6px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        const spans = menuToggle.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      });
    });
  }

  // Scroll animations using IntersectionObserver
  const sections = document.querySelectorAll(".section, .hero, .card-why, .card-service, .card-review, .menu-item-card");
  
  // Set initial opacity and transition styles in JS to avoid flash
  sections.forEach(sec => {
    sec.style.opacity = "0";
    sec.style.transform = "translateY(20px)";
    sec.style.transition = "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
  });

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // Footer Year Updater
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Lightbox Modal for Gallery Page
  const galleryCards = document.querySelectorAll(".gallery-card");
  const lightbox = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  if (galleryCards.length > 0 && lightbox && lightboxImg) {
    galleryCards.forEach(card => {
      card.addEventListener("click", () => {
        const imgSrc = card.getAttribute("data-src") || card.querySelector("img").src;
        const title = card.getAttribute("data-title") || card.querySelector(".gallery-title").textContent;
        
        lightboxImg.src = imgSrc;
        if (lightboxCaption) {
          lightboxCaption.textContent = title;
        }
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = "none";
      document.body.style.overflow = "auto";
    };

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Gallery Filtering
  const filterBtns = document.querySelectorAll(".menu-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-card");
  const menuItemCards = document.querySelectorAll(".menu-item-card");

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const filterValue = btn.getAttribute("data-filter");

        // Filter Gallery items if on gallery page
        galleryItems.forEach(item => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 50);
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.8)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });

        // Filter Menu items if on menu section
        menuItemCards.forEach(item => {
          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "flex";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // Interactive Mood Coffee Selector (Home Page feature)
  const moodBtns = document.querySelectorAll(".mood-btn");
  const moodResultCards = document.querySelectorAll(".mood-result-card");

  if (moodBtns.length > 0 && moodResultCards.length > 0) {
    moodBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        moodBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const targetMood = btn.getAttribute("data-mood");

        moodResultCards.forEach(card => {
          card.classList.remove("active");
          if (card.getAttribute("id") === `mood-${targetMood}`) {
            card.classList.add("active");
          }
        });
      });
    });
  }

  // Before/After Slider Interaction
  const baSlider = document.querySelector(".interactive-ba-slider");
  const baRangeInput = document.querySelector(".ba-range-input");
  const baBeforePanel = document.querySelector(".ba-before-panel");
  const baSliderHandle = document.querySelector(".ba-slider-handle");
  const baBeforeImg = document.querySelector(".ba-before-img");

  if (baSlider && baRangeInput && baBeforePanel && baSliderHandle) {
    const updateSlider = () => {
      const percentage = baRangeInput.value;
      baBeforePanel.style.width = `${percentage}%`;
      baSliderHandle.style.left = `${percentage}%`;
    };

    baRangeInput.addEventListener("input", updateSlider);
    
    // Resize handler to keep the before image looking realistic (100% width of container)
    const resizeBeforeImg = () => {
      if (baBeforeImg) {
        baBeforeImg.style.width = `${baSlider.offsetWidth}px`;
      }
    };
    
    resizeBeforeImg();
    window.addEventListener("resize", resizeBeforeImg);
  }
});
