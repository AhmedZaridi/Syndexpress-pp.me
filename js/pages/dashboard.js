import { requireAuth, getCurrentUser } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getResidents, getCotisations, getPrestations } from '../data/storage.js';

requireAuth();
renderNavbar();

const user = getCurrentUser();
const residents = getResidents();
const cotisations = getCotisations();
const prestations = getPrestations();

// Message de bienvenue en français
document.getElementById('welcomeMessage').textContent = `Bon retour, ${user.name} !`;

// Calculs financiers
const totalCotisations = cotisations.reduce((sum, c) => sum + c.amount, 0);
const totalPrestations = prestations.reduce((sum, p) => sum + p.amount, 0);
const netBalance = totalCotisations - totalPrestations;
const paidCotisations = cotisations.filter(c => c.status === 'paid').length;
const pendingCotisations = cotisations.filter(c => c.status === 'pending').length;

// Création des cartes statistiques avec traductions et montants en DHS
const cards = [
  {
    title: 'Total Résidents',
    value: residents.length,
    label: 'résidents enregistrés',
    color: 'primary'
  },
  {
    title: 'Total Cotisations',
    value: `${totalCotisations.toFixed(2)} DHS`,
    label: `${paidCotisations} payées, ${pendingCotisations} en attente`,
    color: 'success'
  },
  {
    title: 'Total Prestations',
    value: `${totalPrestations.toFixed(2)} DHS`,
    label: `${prestations.length} services`,
    color: 'warning'
  },
  {
    title: 'Solde Net',
    value: `${netBalance.toFixed(2)} DHS`,
    label: netBalance >= 0 ? 'Solde positif' : 'Solde négatif',
    color: netBalance >= 0 ? 'success' : 'danger'
  }
];

// Affichage des cartes sur le tableau de bord
const statsContainer = document.getElementById('statsCards');
statsContainer.innerHTML = cards.map(card => `
  <div class="stat-card ${card.color}">
    <div>
      <h3>${card.title}</h3>
      <div class="stat-value">${card.value}</div>
      <div class="stat-label">${card.label}</div>
    </div>
  </div>
`).join('');