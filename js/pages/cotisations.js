import { requireAuth, hasRole } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getCotisations, saveCotisation, deleteCotisation, getResidents } from '../data/storage.js';
import { TableSorter, createEmptyState } from '../utils/table.js';

requireAuth();
renderNavbar();

const canEdit = hasRole('admin', 'syndic');
const addBtn = document.getElementById('addCotisationBtn');
const actionsHeader = document.getElementById('actionsHeader');
const modal = document.getElementById('cotisationModal');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('cotisationForm');
const closeBtn = modal.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

if (canEdit) {
  addBtn.style.display = 'inline-flex';
  actionsHeader.style.display = 'table-cell';
}

let currentEditId = null;

function populateResidents() {
  const residents = getResidents();
  const select = document.getElementById('cotisationResident');
  select.innerHTML = '<option value="">Sélectionner un résident</option>' +
    residents.map(r => `<option value="${r.id}">${r.name} - ${r.apartment}</option>`).join('');
}

function renderTable() {
  const cotisations = getCotisations();
  const tbody = document.getElementById('cotisationsTableBody');

  if (cotisations.length === 0) {
    tbody.innerHTML = createEmptyState('Aucune cotisation trouvée');
    return;
  }

  tbody.innerHTML = cotisations.map(cotisation => {
    let statusClass = 'badge-gray';
    let statusLabel = '';
    if (cotisation.status === 'paid') {
      statusClass = 'badge-success';
      statusLabel = 'Payée';
    } else if (cotisation.status === 'pending') {
      statusClass = 'badge-warning';
      statusLabel = 'En attente';
    } else if (cotisation.status === 'overdue') {
      statusClass = 'badge-danger';
      statusLabel = 'En retard';
    }

    let typeLabel = cotisation.type; // tu peux traduire les types si nécessaire

    return `
      <tr data-resident="${cotisation.residentName}" data-amount="${cotisation.amount}" data-date="${cotisation.date}" data-type="${cotisation.type}" data-status="${cotisation.status}">
        <td>${cotisation.residentName}</td>
        <td>${cotisation.amount.toFixed(2)} DHS</td>
        <td>${new Date(cotisation.date).toLocaleDateString()}</td>
        <td><span class="badge badge-info">${typeLabel}</span></td>
        <td><span class="badge ${statusClass}">${statusLabel}</span></td>
        ${canEdit ? `
          <td class="actions">
            <button class="btn btn-primary btn-sm edit-btn" data-id="${cotisation.id}">Modifier</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${cotisation.id}">Supprimer</button>
          </td>
        ` : ''}
      </tr>
    `;
  }).join('');

  if (canEdit) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editCotisation(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteCotisationHandler(btn.dataset.id));
    });
  }
}

function openModal(cotisationId = null) {
  currentEditId = cotisationId;
  populateResidents();

  if (cotisationId) {
    modalTitle.textContent = 'Modifier la cotisation';
    const cotisation = getCotisations().find(c => c.id === cotisationId);
    if (cotisation) {
      document.getElementById('cotisationId').value = cotisation.id;
      document.getElementById('cotisationResident').value = cotisation.residentId;
      document.getElementById('cotisationAmount').value = cotisation.amount;
      document.getElementById('cotisationDate').value = cotisation.date;
      document.getElementById('cotisationType').value = cotisation.type;
      document.getElementById('cotisationStatus').value = cotisation.status;
    }
  } else {
    modalTitle.textContent = 'Ajouter une cotisation';
    form.reset();
    document.getElementById('cotisationId').value = '';
    document.getElementById('cotisationDate').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
  currentEditId = null;
}

function editCotisation(id) {
  openModal(id);
}

function deleteCotisationHandler(id) {
  if (confirm('Voulez-vous vraiment supprimer cette cotisation ?')) {
    deleteCotisation(id);
    renderTable();
  }
}

addBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const cotisation = {
    id: document.getElementById('cotisationId').value || undefined,
    residentId: document.getElementById('cotisationResident').value,
    amount: parseFloat(document.getElementById('cotisationAmount').value),
    date: document.getElementById('cotisationDate').value,
    type: document.getElementById('cotisationType').value,
    status: document.getElementById('cotisationStatus').value
  };

  saveCotisation(cotisation);
  closeModal();
  renderTable();
});

renderTable();
new TableSorter('cotisationsTable');