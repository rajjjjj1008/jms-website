

// ===== Scroll Animation for Elements =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in-scroll class
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));
});

// ===== Form Validation (for contact page) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;

  // clear previous errors
  document.querySelectorAll('.error-text').forEach(e => {
    e.innerText = '';
    e.style.display = 'none';
  });
  document.querySelectorAll('.form-control, .form-select')
    .forEach(i => i.classList.remove('error'));

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const inquiry = document.getElementById('inquiry');
  const message = document.getElementById('message');

  // NAME
  if (!/^[A-Za-z\s]+$/.test(name.value.trim())) {
    showError(name, 'Name should contain only letters');
    isValid = false;
  }

  // EMAIL
  if (!isValidEmail(email.value.trim())) {
    showError(email, 'Please enter a valid email');
    isValid = false;
  }

  // PHONE
  if (!isValidPhone(phone.value.trim())) {
    showError(phone, 'Please enter a valid phone number');
    isValid = false;
  }

  // INQUIRY
  if (inquiry.value === '') {
    showError(inquiry, 'Please select an inquiry type');
    isValid = false;
  }

  // MESSAGE
  if (message.value.trim().length < 10) {
    showError(message, 'Message must be at least 10 characters');
    isValid = false;
  }

  if (!isValid) return;

  showNotification('Thank you! Your message has been sent.', 'success');
  contactForm.reset();
});

function showError(input, msg) {
  input.classList.add('error');
  const errorEl = input.nextElementSibling;
  errorEl.innerText = msg;
  errorEl.style.display = 'block';
}

}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (basic)
function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
}

// Notification function
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  background: ${type === 'success' ? '#4caf50' : '#f44336'};
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 10000;
  max-width: 420px;
  animation: slideDown 0.35s ease;
  white-space: pre-line;
`;

    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to document
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideDown {
  from {
    transform: translate(-50%, -30px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -30px);
    opacity: 0;
  }
}

    `;
    document.head.appendChild(style);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});


// ===== Product Filter (for products page) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== Counter Animation for Stats =====
function animateCounter(element, start, end, duration) {
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observe stat numbers
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            entry.target.dataset.suffix = suffix;
            animateCounter(entry.target, 0, number, 2000);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== Back to Top Button =====
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '↑';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    width: 50px;
    height: 50px;
    background: var(--primary-color, #1a4d8f);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;


document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
});

backToTopButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// ===== Image Lazy Loading Fallback =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===== Enquiry Modal + Google Sheet =====
const enquireBtn = document.getElementById('enquireBtn');
const enquireModal = document.getElementById('enquireModal');
const modalClose = document.querySelector('.modal-close');
const enquiryForm = document.getElementById('enquiryForm');
const enquiryStatus = document.getElementById('enquiryStatus');

if (enquireBtn) {
    enquireBtn.onclick = () => enquireModal.style.display = 'block';
}

if (modalClose) {
    modalClose.onclick = () => enquireModal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    if (e.target === enquireModal) {
        enquireModal.style.display = 'none';
    }
});

if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = {
            name: enquiryForm.name.value,
            email: enquiryForm.email.value,
            phone: enquiryForm.phone.value,
            message: enquiryForm.message.value
        };

        fetch("PASTE_GOOGLE_APPS_SCRIPT_URL_HERE", {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => {
            enquiryStatus.style.color = 'green';
            enquiryStatus.innerText = "✅ Enquiry submitted successfully!";
            enquiryForm.reset();
        })
        .catch(() => {
            enquiryStatus.style.color = 'red';
            enquiryStatus.innerText = "❌ Submission failed. Try again.";
        });
    });
}

// ===== Scroll Progress Bar =====
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  const scrollPercent = (scrollTop / docHeight) * 100;

  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
});
