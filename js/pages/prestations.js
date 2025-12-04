import { requireAuth, hasRole } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getPrestations, savePrestation, deletePrestation } from '../data/storage.js';
import { TableSorter, createEmptyState } from '../utils/table.js';

requireAuth();
renderNavbar();

const canEdit = hasRole('admin', 'syndic');
const addBtn = document.getElementById('addPrestationBtn');
const actionsHeader = document.getElementById('actionsHeader');
const modal = document.getElementById('prestationModal');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('prestationForm');
const closeBtn = modal.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

if (canEdit) {
  addBtn.style.display = 'inline-flex';
  actionsHeader.style.display = 'table-cell';
}

let currentEditId = null;

function renderTable() {
  const prestations = getPrestations();
  const tbody = document.getElementById('prestationsTableBody');

  if (prestations.length === 0) {
    tbody.innerHTML = createEmptyState('Aucune prestation trouvée');
    return;
  }

  tbody.innerHTML = prestations.map(prestation => {
    let statusClass = 'badge-gray';
    let statusLabel = '';
    if (prestation.status === 'completed') {
      statusClass = 'badge-success';
      statusLabel = 'Terminée';
    } else if (prestation.status === 'pending') {
      statusClass = 'badge-warning';
      statusLabel = 'En attente';
    } else if (prestation.status === 'cancelled') {
      statusClass = 'badge-danger';
      statusLabel = 'Annulée';
    }

    return `
      <tr data-description="${prestation.description}" data-provider="${prestation.provider}" data-amount="${prestation.amount}" data-date="${prestation.date}" data-category="${prestation.category}" data-status="${prestation.status}">
        <td>${prestation.description}</td>
        <td>${prestation.provider}</td>
        <td>${prestation.amount.toFixed(2)} DHS</td>
        <td>${new Date(prestation.date).toLocaleDateString()}</td>
        <td><span class="badge badge-info">${prestation.category}</span></td>
        <td><span class="badge ${statusClass}">${statusLabel}</span></td>
        ${canEdit ? `
          <td class="actions">
            <button class="btn btn-primary btn-sm edit-btn" data-id="${prestation.id}">Modifier</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${prestation.id}">Supprimer</button>
          </td>
        ` : ''}
      </tr>
    `;
  }).join('');

  if (canEdit) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editPrestation(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deletePrestationHandler(btn.dataset.id));
    });
  }
}

function openModal(prestationId = null) {
  currentEditId = prestationId;

  if (prestationId) {
    modalTitle.textContent = 'Modifier la prestation';
    const prestation = getPrestations().find(p => p.id === prestationId);
    if (prestation) {
      document.getElementById('prestationId').value = prestation.id;
      document.getElementById('prestationDescription').value = prestation.description;
      document.getElementById('prestationProvider').value = prestation.provider;
      document.getElementById('prestationAmount').value = prestation.amount;
      document.getElementById('prestationDate').value = prestation.date;
      document.getElementById('prestationCategory').value = prestation.category;
      document.getElementById('prestationStatus').value = prestation.status;
    }
  } else {
    modalTitle.textContent = 'Ajouter une prestation';
    form.reset();
    document.getElementById('prestationId').value = '';
    document.getElementById('prestationDate').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
  currentEditId = null;
}

function editPrestation(id) {
  openModal(id);
}

function deletePrestationHandler(id) {
  if (confirm('Voulez-vous vraiment supprimer cette prestation ?')) {
    deletePrestation(id);
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

  const prestation = {
    id: document.getElementById('prestationId').value || undefined,
    description: document.getElementById('prestationDescription').value,
    provider: document.getElementById('prestationProvider').value,
    amount: parseFloat(document.getElementById('prestationAmount').value),
    date: document.getElementById('prestationDate').value,
    category: document.getElementById('prestationCategory').value,
    status: document.getElementById('prestationStatus').value
  };

  savePrestation(prestation);
  closeModal();
  renderTable();
});

renderTable();
new TableSorter('prestationsTable');