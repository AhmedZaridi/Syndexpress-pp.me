import { requireAuth, hasRole } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getResidents, saveResident, deleteResident } from '../data/storage.js';
import { TableSorter, createEmptyState } from '../utils/table.js';

requireAuth();
renderNavbar();

const canEdit = hasRole('admin', 'syndic');
const addBtn = document.getElementById('addResidentBtn');
const actionsHeader = document.getElementById('actionsHeader');
const modal = document.getElementById('residentModal');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('residentForm');
const closeBtn = modal.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');

if (canEdit) {
  addBtn.style.display = 'inline-flex';
  actionsHeader.style.display = 'table-cell';
}

let currentEditId = null;

function renderTable() {
  const residents = getResidents();
  const tbody = document.getElementById('residentsTableBody');

  if (residents.length === 0) {
    tbody.innerHTML = createEmptyState('Aucun résident trouvé');
    return;
  }

  tbody.innerHTML = residents.map(resident => `
    <tr data-name="${resident.name}" data-email="${resident.email}" data-apartment="${resident.apartment}" data-phone="${resident.phone}" data-status="${resident.status}">
      <td>${resident.name}</td>
      <td>${resident.email}</td>
      <td>${resident.apartment}</td>
      <td>${resident.phone}</td>
      <td><span class="badge ${resident.status === 'active' ? 'badge-success' : 'badge-gray'}">${resident.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
      ${canEdit ? `
        <td class="actions">
          <button class="btn btn-primary btn-sm edit-btn" data-id="${resident.id}">Modifier</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${resident.id}">Supprimer</button>
        </td>
      ` : ''}
    </tr>
  `).join('');

  if (canEdit) {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editResident(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteResidentHandler(btn.dataset.id));
    });
  }
}

function openModal(residentId = null) {
  currentEditId = residentId;

  if (residentId) {
    modalTitle.textContent = 'Modifier un résident';
    const resident = getResidents().find(r => r.id === residentId);
    if (resident) {
      document.getElementById('residentId').value = resident.id;
      document.getElementById('residentName').value = resident.name;
      document.getElementById('residentEmail').value = resident.email;
      document.getElementById('residentApartment').value = resident.apartment;
      document.getElementById('residentPhone').value = resident.phone;
      document.getElementById('residentStatus').value = resident.status;
    }
  } else {
    modalTitle.textContent = 'Ajouter un résident';
    form.reset();
    document.getElementById('residentId').value = '';
  }

  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
  currentEditId = null;
}

function editResident(id) {
  openModal(id);
}

function deleteResidentHandler(id) {
  if (confirm('Voulez-vous vraiment supprimer ce résident ?')) {
    deleteResident(id);
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

  const resident = {
    id: document.getElementById('residentId').value || undefined,
    name: document.getElementById('residentName').value,
    email: document.getElementById('residentEmail').value,
    apartment: document.getElementById('residentApartment').value,
    phone: document.getElementById('residentPhone').value,
    status: document.getElementById('residentStatus').value
  };

  saveResident(resident);
  closeModal();
  renderTable();
});

renderTable();
new TableSorter('residentsTable');