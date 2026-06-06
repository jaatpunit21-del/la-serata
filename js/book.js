document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("booking-form");
  const successBox = document.getElementById("booking-success");
  
  if (bookingForm && successBox) {
    // Restrict date selector to today and future dates
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
      dateInput.value = today;
    }

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect form fields
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const zone = document.getElementById("zone").value;
      const eventType = document.getElementById("event-type").value;
      const guests = document.getElementById("guests").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const catering = document.getElementById("catering").value;
      const notes = document.getElementById("notes").value.trim();

      // Simple validation
      if (!name || !phone || !date || !time) {
        alert("Please fill in all required fields.");
        return;
      }

      // Format zone readable name
      let zoneName = "The Grand Lawn";
      if (zone === "lawn") zoneName = "The Grand Lawn";
      else if (zone === "hall") zoneName = "The Royal Banquet Hall";
      else if (zone === "garden") zoneName = "The Courtyard Garden";
      else if (zone === "suite") zoneName = "VIP Bridal Suite & Groom Lounge";

      // Format event type readable name
      let eventTypeName = "Grand Wedding Reception";
      if (eventType === "wedding") eventTypeName = "Grand Wedding Reception";
      else if (eventType === "sangeet") eventTypeName = "Sangeet / Mehendi Ceremony";
      else if (eventType === "corporate") eventTypeName = "Corporate Gala / Seminar";
      else if (eventType === "birthday") eventTypeName = "Birthday / Anniversary Dinner";
      else if (eventType === "social") eventTypeName = "Private Social Celebration";

      // Format guest count readable name
      let guestCountText = "500 to 800 Guests";
      if (guests === "50") guestCountText = "Under 50 Guests (Intimate Session)";
      else if (guests === "150") guestCountText = "50 to 150 Guests";
      else if (guests === "300") guestCountText = "150 to 300 Guests";
      else if (guests === "500") guestCountText = "300 to 500 Guests";
      else if (guests === "800") guestCountText = "500 to 800 Guests";

      // Format catering package readable name
      let cateringText = "Classic Vegetarian Buffet";
      if (catering === "veg-gold") cateringText = "Classic Vegetarian Buffet (Starts at ₹1,100/plate)";
      else if (catering === "veg-diamond") cateringText = "Royal Multi-Cuisine Vegetarian (Starts at ₹1,500/plate)";
      else if (catering === "veg-platinum") cateringText = "Signature Fusion Vegetarian (Starts at ₹1,800/plate)";
      else if (catering === "none") cateringText = "Venue Hire Only (Excludes Catering Packages)";

      // Generate a random booking reference code e.g., CN-8274
      const bookingCode = `CN-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save to localStorage for demo persistence (wrapped in try-catch to avoid crashing on file:// protocol or private browsing modes)
      const reservation = {
        code: bookingCode,
        name,
        phone,
        zone: zoneName,
        eventType: eventTypeName,
        guests: guestCountText,
        catering: cateringText,
        date,
        time,
        notes,
        createdAt: new Date().toISOString()
      };

      try {
        let existingReservations = JSON.parse(localStorage.getItem("laserata_venue_bookings") || "[]");
        existingReservations.push(reservation);
        localStorage.setItem("laserata_venue_bookings", JSON.stringify(existingReservations));
      } catch (err) {
        console.warn("localStorage is blocked or restricted. Simulated booking running in-memory.", err);
      }

      // Display Details in success panel
      document.getElementById("success-code").textContent = bookingCode;
      document.getElementById("success-name").textContent = name;
      document.getElementById("success-phone").textContent = phone;
      document.getElementById("success-zone").textContent = zoneName;
      document.getElementById("success-event-type").textContent = eventTypeName;
      document.getElementById("success-guests").textContent = guestCountText;
      document.getElementById("success-datetime").textContent = `${date} - ${time}`;

      // Transition visibility from Form to Success Box
      bookingForm.style.opacity = "0";
      setTimeout(() => {
        bookingForm.style.display = "none";
        successBox.style.display = "block";
        successBox.style.opacity = "1";
        // Smooth scroll to success box
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    });

    // Handle "Book Another Space" action
    const resetBtn = document.getElementById("success-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        bookingForm.reset();
        
        // Reset date
        const dateInput = document.getElementById("date");
        if (dateInput) {
          dateInput.value = new Date().toISOString().split("T")[0];
        }

        successBox.style.opacity = "0";
        setTimeout(() => {
          successBox.style.display = "none";
          bookingForm.style.display = "block";
          bookingForm.style.opacity = "1";
        }, 300);
      });
    }
  }
});
