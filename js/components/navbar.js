import { getCurrentUser, logout, hasRole } from '../auth/auth.js';

export function renderNavbar() {
  const user = getCurrentUser();
  if (!user) return;

  const navbar = document.getElementById('navbar');

  const menuItems = [];

  menuItems.push({ href: '/pages/dashboard.html', text: 'Dashboard' });
  menuItems.push({ href: '/pages/residents.html', text: 'Residents' });
  menuItems.push({ href: '/pages/cotisations.html', text: 'Cotisations' });
  menuItems.push({ href: '/pages/prestations.html', text: 'Prestations' });

  // Suppression de la ligne des Invoices
  // if (hasRole('admin', 'syndic')) {
  //   menuItems.push({ href: '/pages/invoices.html', text: 'Invoices' });
  // }

  menuItems.push({ href: '/pages/balance.html', text: 'Balance' });

  const currentPath = window.location.pathname;

  const menuHTML = menuItems.map(item => {
    const isActive = currentPath === item.href ? 'active' : '';
    return `<li><a href="${item.href}" class="${isActive}">${item.text}</a></li>`;
  }).join('');

  navbar.innerHTML = `
    <div class="nav-container">
      <a href="/pages/dashboard.html" class="nav-brand">SyndExpress</a>

      <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>

      <ul class="nav-menu" id="navMenu">
        ${menuHTML}
      </ul>

      <div class="nav-user">
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-role">${user.role}</div>
        </div>
        <button class="btn btn-secondary btn-sm" id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', logout);

  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}