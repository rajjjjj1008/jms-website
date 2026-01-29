document.addEventListener('DOMContentLoaded', () => {
  fetch('/navbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;

      initNavbar();
      initDropdowns(); // 👈 THIS IS THE KEY
      initHoverDropdowns();
    });
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
  });

  // current page without path
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    // normalize href (remove leading slash)
    const linkPage = link
      .getAttribute('href')
      .replace(/^\/+/, '');

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // products dropdown parent active
  if (currentPage.startsWith('products')) {
    document
      .querySelector('.nav-item.dropdown > .nav-link')
      ?.classList.add('active');
  }
}




/* 🔥 Bootstrap dropdown re-init */
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(el => {
    new bootstrap.Dropdown(el);
  });


}

function initHoverDropdowns() {
  const isDesktop = window.matchMedia('(min-width: 992px)').matches;
  if (!isDesktop) return; // ✅ absolutely no hover logic on mobile

  document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(toggle);

    let hoverTimeout;

    const showDropdown = () => {
      clearTimeout(hoverTimeout);
      bsDropdown.show();
    };

    const hideDropdown = () => {
      hoverTimeout = setTimeout(() => {
        bsDropdown.hide();
      }, 150);
    };

    dropdown.addEventListener('mouseenter', showDropdown);
    dropdown.addEventListener('mouseleave', hideDropdown);
  });
}


