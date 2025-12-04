import { requireAuth } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getCotisations, getPrestations } from '../data/storage.js';

requireAuth();
renderNavbar();

const cotisations = getCotisations();
const prestations = getPrestations();

const totalCotisations = cotisations.reduce((sum, c) => sum + c.amount, 0);
const totalPrestations = prestations.reduce((sum, p) => sum + p.amount, 0);
const netBalance = totalCotisations - totalPrestations;

// Mise à jour des totaux
document.getElementById('totalCotisations').textContent = `${totalCotisations.toFixed(2)} DHS`;
document.getElementById('cotisationsCount').textContent = `${cotisations.length} paiements`;

document.getElementById('totalPrestations').textContent = `${totalPrestations.toFixed(2)} DHS`;
document.getElementById('prestationsCount').textContent = `${prestations.length} services`;

document.getElementById('netBalance').textContent = `${netBalance.toFixed(2)} DHS`;

// Mise à jour du statut du solde
const balanceCard = document.getElementById('netBalanceCard');
if (netBalance >= 0) {
  balanceCard.classList.add('positive');
  document.getElementById('balanceStatus').textContent = 'Solde positif';
} else {
  balanceCard.classList.add('negative');
  document.getElementById('balanceStatus').textContent = 'Solde négatif';
}

// Répartition des cotisations par type et statut
const cotisationsByType = cotisations.reduce((acc, c) => {
  acc[c.type] = (acc[c.type] || 0) + c.amount;
  return acc;
}, {});

const cotisationsByStatus = cotisations.reduce((acc, c) => {
  acc[c.status] = (acc[c.status] || 0) + c.amount;
  return acc;
}, {});

const cotisationsBreakdown = document.getElementById('cotisationsBreakdown');

if (Object.keys(cotisationsByType).length === 0) {
  cotisationsBreakdown.innerHTML = '<div class="empty-breakdown">Aucune cotisation enregistrée</div>';
} else {
  let html = '<h3 style="margin-bottom: 15px; font-size: 14px; color: var(--gray-600);">Par Type</h3>';
  Object.entries(cotisationsByType).forEach(([type, amount]) => {
    html += `
      <div class="breakdown-item">
        <span class="breakdown-label">${type}</span>
        <span class="breakdown-value">${amount.toFixed(2)} DHS</span>
      </div>
    `;
  });

  html += '<h3 style="margin: 20px 0 15px; font-size: 14px; color: var(--gray-600);">Par Statut</h3>';
  Object.entries(cotisationsByStatus).forEach(([status, amount]) => {
    html += `
      <div class="breakdown-item">
        <span class="breakdown-label">${status}</span>
        <span class="breakdown-value">${amount.toFixed(2)} DHS</span>
      </div>
    `;
  });

  html += `
    <div class="breakdown-item total">
      <span class="breakdown-label">Total</span>
      <span class="breakdown-value">${totalCotisations.toFixed(2)} DHS</span>
    </div>
  `;

  cotisationsBreakdown.innerHTML = html;
}

// Répartition des prestations par catégorie et statut
const prestationsByCategory = prestations.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + p.amount;
  return acc;
}, {});

const prestationsByStatus = prestations.reduce((acc, p) => {
  acc[p.status] = (acc[p.status] || 0) + p.amount;
  return acc;
}, {});

const prestationsBreakdown = document.getElementById('prestationsBreakdown');

if (Object.keys(prestationsByCategory).length === 0) {
  prestationsBreakdown.innerHTML = '<div class="empty-breakdown">Aucun service enregistré</div>';
} else {
  let html = '<h3 style="margin-bottom: 15px; font-size: 14px; color: var(--gray-600);">Par Catégorie</h3>';
  Object.entries(prestationsByCategory).forEach(([category, amount]) => {
    html += `
      <div class="breakdown-item">
        <span class="breakdown-label">${category}</span>
        <span class="breakdown-value">${amount.toFixed(2)} DHS</span>
      </div>
    `;
  });

  html += '<h3 style="margin: 20px 0 15px; font-size: 14px; color: var(--gray-600);">Par Statut</h3>';
  Object.entries(prestationsByStatus).forEach(([status, amount]) => {
    html += `
      <div class="breakdown-item">
        <span class="breakdown-label">${status}</span>
        <span class="breakdown-value">${amount.toFixed(2)} DHS</span>
      </div>
    `;
  });

  html += `
    <div class="breakdown-item total">
      <span class="breakdown-label">Total</span>
      <span class="breakdown-value">${totalPrestations.toFixed(2)} DHS</span>
    </div>
  `;

  prestationsBreakdown.innerHTML = html;
}