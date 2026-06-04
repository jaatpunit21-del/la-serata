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
      const guests = document.getElementById("guests").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const notes = document.getElementById("notes").value.trim();

      // Simple validation
      if (!name || !phone || !date || !time) {
        alert("Please fill in all required fields.");
        return;
      }

      // Format zone readable name
      let zoneName = "Cozy Corner";
      if (zone === "study") zoneName = "Quiet Study Nook (with Power Outlet)";
      else if (zone === "lounge") zoneName = "Social Coffee Lounge (Sofas)";
      else if (zone === "library") zoneName = "The Book Library Corner";
      else if (zone === "group") zoneName = "Group Discussion Table (4-6 persons)";

      // Generate a random booking reference code e.g., CN-8274
      const bookingCode = `CN-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save to localStorage for demo persistence
      const reservation = {
        code: bookingCode,
        name,
        phone,
        zone: zoneName,
        guests,
        date,
        time,
        notes,
        createdAt: new Date().toISOString()
      };

      let existingReservations = JSON.parse(localStorage.getItem("coffee_nation_bookings") || "[]");
      existingReservations.push(reservation);
      localStorage.setItem("coffee_nation_bookings", JSON.stringify(existingReservations));

      // Display Details in success panel
      document.getElementById("success-code").textContent = bookingCode;
      document.getElementById("success-name").textContent = name;
      document.getElementById("success-phone").textContent = phone;
      document.getElementById("success-zone").textContent = zoneName;
      document.getElementById("success-guests").textContent = `${guests} Person(s)`;
      document.getElementById("success-datetime").textContent = `${date} at ${time}`;

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
