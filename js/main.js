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

  // Header Scroll Effect
  const header = document.querySelector(".header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  // FAQ Accordion Trigger
  const faqHeaders = document.querySelectorAll(".faq-header");
  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const isActive = item.classList.contains("active");

        // Close all items
        document.querySelectorAll(".faq-item").forEach(i => {
          i.classList.remove("active");
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  // Simulated 3D Virtual Tour Controller
  const tourTabs = document.querySelectorAll(".tour-tab-btn");
  const tourBgPan = document.querySelector(".tour-bg-pan");
  const tourTitle = document.querySelector(".tour-details-title");
  const tourDesc = document.querySelector(".tour-details-desc");
  const tourCap = document.querySelector("#tour-stat-capacity");
  const tourSetup = document.querySelector("#tour-stat-setup");
  const tourViewer = document.querySelector(".tour-viewer-frame");

  // Space data configuration
  const spaceData = {
    lounge: {
      image: "assets/backgrounds/bg3.png?v=2",
      title: "The Royal Banquet Hall",
      desc: "A majestic double-height hall featuring grand golden chandeliers, premium acoustic paneling, and an elegant stage setup. Perfect for royal weddings, receptions, and corporate conferences.",
      capacity: "300 Guests",
      setup: "Round Table Banquet Seating",
      hotspots: [
        { x: 50, y: 30, title: "Grand Chandeliers", desc: "Double-height ceilings with custom imported golden chandeliers." },
        { x: 20, y: 60, title: "Vows Stage", desc: "Elegant, customizable stage for couple seating or presentations." }
      ]
    },
    garden: {
      image: "assets/backgrounds/bg1.png?v=2",
      title: "The Grand Lawn",
      desc: "Ahmedabad's finest lush green party lawn, sprawling over beautiful manicured gardens under the open sky. Perfect for grand reception starlit dinners, massive buffet spreads, and large scale social gatherings.",
      capacity: "800 Guests",
      setup: "Theater / Open Lawn Seating",
      hotspots: [
        { x: 45, y: 22, title: "Fairy Lights Canopy", desc: "Premium overhead evening canopy lighting." },
        { x: 75, y: 55, title: "Wedding Mandap / Reception Stage", desc: "Spacious outdoor stage area for grand setups." }
      ]
    },
    dining: {
      image: "assets/backgrounds/bg4.png?v=2",
      title: "The Courtyard Garden",
      desc: "An intimate outdoor courtyard filled with natural flora and elegant tile paths. Ideal for sangeet nights, mehendi ceremonies, family get-togethers, or private cocktail celebrations.",
      capacity: "150 Guests",
      setup: "Cluster Seating / Standing Cocktail",
      hotspots: [
        { x: 40, y: 70, title: "Paved Walkways", desc: "Beautifully lit brick paths for guests." },
        { x: 75, y: 65, title: "Cluster Lounge Seating", desc: "Comfortable lounge sofas under open sky." }
      ]
    },
    private: {
      image: "assets/backgrounds/bg2.png?v=2",
      title: "VIP Bridal Suite",
      desc: "An exclusive, fully air-conditioned private suite designed for bridal preparation, groom styling, or VIP greenroom hosting. Includes premium mirrors, private washrooms, and luxury couch seating.",
      capacity: "Exclusive Use",
      setup: "VIP Styling Lounge",
      hotspots: [
        { x: 30, y: 45, title: "Bridal Styling Vanity", desc: "Professional high-lumen vanity mirrors." },
        { x: 70, y: 65, title: "Luxury Seating Area", desc: "Plush sofas for family and styling team." }
      ]
    }
  };

  const renderHotspots = (hotspots) => {
    // Clear existing hotspots
    if (!tourViewer) return;
    const currentHotspots = tourViewer.querySelectorAll(".tour-hotspot");
    currentHotspots.forEach(el => el.remove());

    // Spawn new ones
    hotspots.forEach(spot => {
      const spotEl = document.createElement("div");
      spotEl.className = "tour-hotspot";
      spotEl.style.left = `${spot.x}%`;
      spotEl.style.top = `${spot.y}%`;

      const tooltipEl = document.createElement("div");
      tooltipEl.className = "tour-tooltip";
      tooltipEl.innerHTML = `<h4>${spot.title}</h4><p>${spot.desc}</p>`;

      spotEl.appendChild(tooltipEl);
      tourViewer.appendChild(spotEl);
    });
  };

  if (tourTabs.length > 0 && tourBgPan) {
    tourTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        // Toggle active tabs
        tourTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const spaceKey = tab.getAttribute("data-space");
        const data = spaceData[spaceKey];

        if (data) {
          // Fade background panning image
          tourBgPan.style.opacity = "0";
          setTimeout(() => {
            tourBgPan.style.backgroundImage = `url('${data.image}')`;
            tourBgPan.style.opacity = "1";
          }, 300);

          // Update details text
          tourTitle.textContent = data.title;
          tourDesc.textContent = data.desc;
          tourCap.textContent = data.capacity;
          tourSetup.textContent = data.setup;

          // Render hotspots
          renderHotspots(data.hotspots);
        }
      });
    });

    // Initialize with first tab
    const initialKey = tourTabs[0].getAttribute("data-space");
    if (spaceData[initialKey]) {
      renderHotspots(spaceData[initialKey].hotspots);
    }
  }
});
