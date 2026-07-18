
  // Load header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header').innerHTML = data;

      // Now attach hamburger menu functionality
      const hamb = document.getElementById('hamb');
      const nav = document.getElementById('mainNav');

      hamb.addEventListener('click', () => {
        nav.classList.toggle('open'); // toggles 'open' class to show/hide menu
      });
    });

//load footer
/*
  fetch("/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
*/

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function(){
  const hamb = document.getElementById('hamb');
  const nav = document.getElementById('mainNav');
  hamb?.addEventListener('click', ()=>{
    nav.classList.toggle('open');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1 && document.querySelector(href)){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        nav.classList.remove('open');
      }
    });
  });


document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", function() {
    const ans = this.nextElementSibling;

    // Close all others
    document.querySelectorAll(".faq-answer").forEach(el => {
      if (el !== ans) el.style.maxHeight = "";
    });
    document.querySelectorAll(".faq-question").forEach(el => {
      if (el !== this) el.classList.remove("active");
    });

    // Toggle current one
    if (ans.style.maxHeight) {
      ans.style.maxHeight = "";
      this.classList.remove("active");
    } else {
      ans.style.maxHeight = ans.scrollHeight + "px";
      this.classList.add("active");
    }
  });
});


  /* FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const open = item.classList.toggle('open');
	  
      const ans = item.querySelector('.answer');
      if(open){ ans.style.maxHeight = ans.scrollHeight + 'px'; }
      else { 
	  alert (open)
		ans.style.maxHeight = ""; 
		}
    });
  });
  */

  // Build WhatsApp message for contact form
  const waBtn = document.getElementById('waContact');
  const apptForm = document.getElementById('apptForm');
  function buildWA(){
    if(!apptForm) return;
    const name = apptForm.name.value || '-';
    const phone = apptForm.phone.value || '-';
    const date = apptForm.date.value || '-';
    const time = apptForm.time.value || '-';
    const conc = apptForm.concern.value || '-';
    const lines = `Name: ${name}%0APhone: ${phone}%0ADate: ${date}%0ATime: ${time}%0AConcern: ${conc}`;
    waBtn.href = 'https://wa.me/919881912065?text=' + encodeURIComponent(lines);
  }
  apptForm?.addEventListener('input', buildWA);
  buildWA();

  // Contact form validation + Formspree (placeholder endpoint)
  const sendEmail = document.getElementById('sendEmail');
  sendEmail?.addEventListener('click', async function(){
    if(!apptForm) return;
    const name = apptForm.name.value.trim();
    const phone = apptForm.phone.value.trim();
    if(!name || !/^\d{10}$/.test(phone)){ alert('Please enter name and a 10-digit phone number.'); return; }
    // Forms endpoint: replace in contact.html with your Formspree URL
    const endpoint = apptForm.dataset.endpoint;
    if(!endpoint){ alert('Email endpoint not configured.'); return; }
    sendEmail.disabled = true;
    sendEmail.textContent = 'Sending...';
    try{
      const payload = { name, phone, date: apptForm.date.value, time: apptForm.time.value, concern: apptForm.concern.value, _subject: 'Appointment request' };
      const res = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(res.ok){ alert('Thanks — request sent.'); apptForm.reset(); }
      else { alert('Failed to send. Use WhatsApp.'); }
    }catch(e){ console.error(e); alert('Error sending form.'); }
    sendEmail.disabled = false;
    sendEmail.textContent = 'Send via Email';
  });
});

function trackWhatsapp(location) {
  gtag('event', 'whatsapp_click', {
    location: location
  });
}

function trackPhone(location) {
  gtag('event', 'phone_click', {
    location: location
  });
}

function trackEvent(eventName, location) {
  if (typeof gtag === "function") {
    gtag('event', eventName, {
      location: location
    });
  }
}



function initializeContactForm() {

		console.log("DOM Loaded");
	  const form = document.getElementById("enquiryForm");
	  console.log(form);
	  const dateField = document.getElementById("apptDate");
	  const timeField = document.getElementById("apptTime");
	  const mobileField = document.getElementById("mobile");
	  
	  const dateError = document.getElementById("dateError");
	  const timeError = document.getElementById("timeError");
	  const mobileError = document.getElementById("mobileError");

	  // Set min date = today
	  const today = new Date().toISOString().split("T")[0];
	  dateField.setAttribute("min", today);

	  // Custom holidays
	  const offDays = ["2025-09-15", "2025-09-20"];
	  //const offDays = ["2099-01-01"];

	  form.addEventListener("submit", function(e) {
		console.log("Submit event fired");
		let valid = true;
		dateError.style.display = "none";
		timeError.style.display = "none";
		mobileError.style.display = "none";

		const selectedDate = new Date(dateField.value);
		const selectedTime = timeField.value;
		const mobile = mobileField.value.trim();

		// ---- Date validation ----
		if (!dateField.value) {
		  dateError.textContent = "❌ Please select a date.";
		  dateError.style.display = "block";
		  valid = false;
		} else {
		  const yyyy_mm_dd = dateField.value;

		  // Check Sunday
		  if (selectedDate.getDay() === 0) {
			dateError.textContent = "❌ Clinic is closed on Sundays.";
			dateError.style.display = "block";
			valid = false;
		  }

		  // Check custom off-days
		  if (offDays.includes(yyyy_mm_dd)) {
			dateError.textContent = "❌ Clinic is closed on this date.";
			dateError.style.display = "block";
			valid = false;
		  }
		}

		// ---- Time validation ----
		const morningStart = "10:30";
		const morningEnd   = "12:30";
		const eveningStart = "17:30";
		const eveningEnd   = "19:30";

		if (
		  !(
			(selectedTime >= morningStart && selectedTime <= morningEnd) ||
			(selectedTime >= eveningStart && selectedTime <= eveningEnd)
		  )
		) {
		  timeError.textContent = "❌ Please select a valid slot: 10:30–12:30 or 17:30–19:30.";
		  timeError.style.display = "block";
		  valid = false;
		}

		// ---- Mobile validation ----
		if (!/^\d{10}$/.test(mobile)) {
		  mobileError.textContent = "❌ Please enter a valid 10-digit mobile number.";
		  mobileError.style.display = "block";
		  valid = false;
		}
		
		if (!valid) e.preventDefault();
	  });

	  // Success message handling
	  if (window.location.search.includes("submitted=true")) {
		form.style.display = "none";
		document.getElementById("successMsg").style.display = "block";
	  }
}


