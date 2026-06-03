// Theme Initialization (runs immediately to prevent flashing)
(function() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // Mobile Hamburger Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      // Prevent scrolling when mobile nav is open
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.padding = '5px 0';
        header.style.boxShadow = '0 4px 20px var(--shadow-color)';
      } else {
        header.style.padding = '';
        header.style.boxShadow = 'var(--shadow-sm)';
      }
    });
  }

  // Active Menu Link Highlighter
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Handle home page and subfolders
      const isHome = href === 'index.html' || href === '/' || href === './';
      const isCurrentHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';
      
      if (isHome && isCurrentHome) {
        link.classList.add('active');
      } else if (!isHome && currentPath.includes(href.replace('.html', ''))) {
        link.classList.add('active');
      }
    }
  });

  // Dynamic Year in Footer
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Interactive Before/After Split Sliders (for Gallery or Homepage preview)
  const baSliders = document.querySelectorAll('.interactive-ba-slider');
  
  baSliders.forEach(slider => {
    const range = slider.querySelector('.ba-range-input');
    const beforePanel = slider.querySelector('.ba-before-panel');
    const handle = slider.querySelector('.ba-slider-handle');
    const beforeImg = slider.querySelector('.ba-before-img');

    if (range && beforePanel && handle) {
      // Sync the cropped image width to the slider container to prevent distortion
      const updateSize = () => {
        if (beforeImg) {
          beforeImg.style.width = `${slider.offsetWidth}px`;
        }
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      // Run it after brief timeout to make sure DOM is fully ready
      setTimeout(updateSize, 100);

      range.addEventListener('input', (e) => {
        const val = e.target.value;
        beforePanel.style.width = `${val}%`;
        handle.style.left = `${val}%`;
      });
    }
  });

  // FAQ Accordion Toggle
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
