
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

  fetch("/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });


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

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      const open = item.classList.toggle('open');
      const ans = item.querySelector('.answer');
      if(open){ ans.style.maxHeight = ans.scrollHeight + 'px'; }
      else { ans.style.maxHeight = null; }
    });
  });

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



