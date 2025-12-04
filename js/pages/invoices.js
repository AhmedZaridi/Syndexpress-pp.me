import { requireRole, getCurrentUser } from '../auth/auth.js';
import { renderNavbar } from '../components/navbar.js';
import { getInvoices, saveInvoice, deleteInvoice } from '../data/storage.js';
import { TableSorter, createEmptyState } from '../utils/table.js';

requireRole('admin', 'syndic');
renderNavbar();

const user = getCurrentUser();
const uploadBtn = document.getElementById('uploadInvoiceBtn');
const modal = document.getElementById('invoiceModal');
const form = document.getElementById('invoiceForm');
const closeBtn = modal.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const fileInput = document.getElementById('invoiceFile');

function renderTable() {
  const invoices = getInvoices();
  const tbody = document.getElementById('invoicesTableBody');

  if (invoices.length === 0) {
    tbody.innerHTML = createEmptyState('No invoices uploaded yet');
    return;
  }

  tbody.innerHTML = invoices.map(invoice => `
    <tr data-fileName="${invoice.fileName}" data-type="${invoice.type}" data-uploadDate="${invoice.uploadDate}" data-uploadedBy="${invoice.uploadedBy}" data-fileSize="${invoice.fileSize}">
      <td>${invoice.fileName}</td>
      <td><span class="badge badge-info">${invoice.type}</span></td>
      <td>${new Date(invoice.uploadDate).toLocaleDateString()}</td>
      <td>${invoice.uploadedBy}</td>
      <td>${invoice.fileSize}</td>
      <td class="actions">
        <button class="btn btn-primary btn-sm view-btn" data-id="${invoice.id}">View</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${invoice.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('File preview functionality would open here');
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteInvoiceHandler(btn.dataset.id));
  });
}

function openModal() {
  form.reset();
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
}

function deleteInvoiceHandler(id) {
  if (confirm('Are you sure you want to delete this invoice?')) {
    deleteInvoice(id);
    renderTable();
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

uploadBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    return;
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Only PDF, JPG, and PNG files are allowed');
    return;
  }

  const invoice = {
    fileName: file.name,
    type: document.getElementById('invoiceType').value,
    uploadDate: new Date().toISOString().split('T')[0],
    uploadedBy: user.name,
    fileSize: formatFileSize(file.size),
    description: document.getElementById('invoiceDescription').value
  };

  saveInvoice(invoice);
  closeModal();
  renderTable();
});

renderTable();
new TableSorter('invoicesTable');
