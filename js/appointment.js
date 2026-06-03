document.addEventListener('DOMContentLoaded', () => {
  // Appointment Form Validation
  const appointmentForm = document.getElementById('appointment-form');
  
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic input fetches
      const name = document.getElementById('app-name').value.trim();
      const phone = document.getElementById('app-phone').value.trim();
      const email = document.getElementById('app-email').value.trim();
      const date = document.getElementById('app-date').value;
      const time = document.getElementById('app-time').value;
      const service = document.getElementById('app-service').value;
      
      // Perform simple validation
      if (!name || !phone || !date || !time || !service) {
        showStatusModal('error', 'Please fill out all required fields marked with *.');
        return;
      }
      
      if (!validatePhone(phone)) {
        showStatusModal('error', 'Please enter a valid 10-digit phone number.');
        return;
      }

      if (email && !validateEmail(email)) {
        showStatusModal('error', 'Please enter a valid email address.');
        return;
      }

      // If valid, show a custom premium success modal
      showStatusModal('success', `
        <h3>Appointment Requested!</h3>
        <p>Thank you, <strong>${name}</strong>. Your request for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been received.</p>
        <p>A representative from Arogya Dental Hospital will contact you shortly at <strong>${phone}</strong> to confirm your booking.</p>
      `);

      appointmentForm.reset();
    });
  }

  // Contact Form Validation (Footer / Contact page)
  const contactForms = document.querySelectorAll('.clinic-contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      
      if (!name || !phone || !message) {
        showStatusModal('error', 'Please fill out all fields in the contact form.');
        return;
      }

      if (!validatePhone(phone)) {
        showStatusModal('error', 'Please enter a valid 10-digit phone number.');
        return;
      }

      showStatusModal('success', `
        <h3>Message Sent!</h3>
        <p>Thank you, <strong>${name}</strong>. We have received your query and our team will get back to you shortly at <strong>${phone}</strong>.</p>
      `);

      form.reset();
    });
  });

  // Helpers
  function validatePhone(phone) {
    // Basic phone validation (removes spaces, dashes, checks digits)
    const cleaned = phone.replace(/[\s-()]/g, '');
    return /^\+?[0-9]{10,12}$/.test(cleaned);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Premium Status Modal Creator
  function showStatusModal(type, htmlContent) {
    // Check if modal already exists, remove it
    const existingModal = document.getElementById('status-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'status-modal';
    
    // Style dynamically inside JS to keep modularity, overlay overlay
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(10, 45, 84, 0.7)';
    modal.style.backdropFilter = 'blur(5px)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';

    const card = document.createElement('div');
    card.style.backgroundColor = '#ffffff';
    card.style.padding = '40px';
    card.style.borderRadius = '16px';
    card.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
    card.style.maxWidth = '500px';
    card.style.width = '90%';
    card.style.textAlign = 'center';
    card.style.transform = 'scale(0.8)';
    card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Icon representation
    const iconContainer = document.createElement('div');
    iconContainer.style.width = '64px';
    iconContainer.style.height = '64px';
    iconContainer.style.borderRadius = '50%';
    iconContainer.style.display = 'inline-flex';
    iconContainer.style.alignItems = 'center';
    iconContainer.style.justifyContent = 'center';
    iconContainer.style.marginBottom = '20px';
    
    if (type === 'success') {
      iconContainer.style.backgroundColor = '#e6f9f7';
      iconContainer.style.color = '#2ec4b6';
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      iconContainer.style.backgroundColor = '#ffeef0';
      iconContainer.style.color = '#ff4d6d';
      iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    }

    const textDiv = document.createElement('div');
    textDiv.innerHTML = typeof htmlContent === 'string' ? htmlContent : '';
    if (type === 'error') {
      const heading = document.createElement('h3');
      heading.innerText = 'Oops!';
      heading.style.marginBottom = '10px';
      heading.style.color = '#ff4d6d';
      const desc = document.createElement('p');
      desc.innerText = htmlContent;
      desc.style.color = '#64748b';
      textDiv.appendChild(heading);
      textDiv.appendChild(desc);
    }

    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Okay';
    closeBtn.style.marginTop = '24px';
    closeBtn.style.padding = '12px 30px';
    closeBtn.style.backgroundColor = type === 'success' ? '#0a2d54' : '#ff4d6d';
    closeBtn.style.color = '#ffffff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '30px';
    closeBtn.style.fontWeight = '700';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontFamily = "'Outfit', sans-serif";
    closeBtn.style.transition = 'all 0.2s';
    
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'translateY(-2px)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'none';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      setTimeout(() => {
        modal.remove();
      }, 300);
    });

    card.appendChild(iconContainer);
    card.appendChild(textDiv);
    card.appendChild(closeBtn);
    modal.appendChild(card);
    document.body.appendChild(modal);

    // Trigger transition
    setTimeout(() => {
      modal.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 10);
  }
});
