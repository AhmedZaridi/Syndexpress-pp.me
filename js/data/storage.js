// storage.js

const STORAGE_KEYS = {
  RESIDENTS: 'syndexpress_residents',
  COTISATIONS: 'syndexpress_cotisations',
  PRESTATIONS: 'syndexpress_prestations',
  INVOICES: 'syndexpress_invoices'
};

// Données initiales résidents marocains
const initialResidents = [
  { id: '1', name: 'Ahmed Zaridi', email: 'ahmed.zaridi@gmail.com', apartment: 'A101', phone: '0673199596', status: 'actif' },
  { id: '2', name: 'Fatima Zahra El Amrani', email: 'fatima.amrani@gmail.com', apartment: 'A102', phone: '0661122334', status: 'actif' },
  { id: '3', name: 'Youssef Bennis', email: 'youssef.bennis@gmail.com', apartment: 'B201', phone: '0652233445', status: 'actif' },
  { id: '4', name: 'Khadija Lahlou', email: 'khadija.lahlou@gmail.com', apartment: 'B202', phone: '0673344556', status: 'inactif' },
  { id: '5', name: 'Hicham Benjelloun', email: 'hicham.benjelloun@gmail.com', apartment: 'C301', phone: '0664455667', status: 'actif' }
];

// Données initiales cotisations
const initialCotisations = [
  { id: '1', residentId: '1', residentName: 'Ahmed Zaridi', amount: 350.00, date: '2024-11-01', type: 'mensuelle', status: 'payé' },
  { id: '2', residentId: '2', residentName: 'Fatima Zahra El Amrani', amount: 350.00, date: '2024-11-01', type: 'mensuelle', status: 'payé' },
  { id: '3', residentId: '3', residentName: 'Youssef Bennis', amount: 350.00, date: '2024-11-01', type: 'mensuelle', status: 'en attente' },
  { id: '4', residentId: '1', residentName: 'Ahmed Zaridi', amount: 1200.00, date: '2024-10-15', type: 'trimestrielle', status: 'payé' },
  { id: '5', residentId: '5', residentName: 'Hicham Benjelloun', amount: 350.00, date: '2024-10-01', type: 'mensuelle', status: 'en retard' }
];

// Données initiales prestations
const initialPrestations = [
  { id: '1', description: 'Maintenance Ascenseur', provider: 'Tech Maroc', amount: 850.00, date: '2024-11-10', category: 'maintenance', status: 'terminée' },
  { id: '2', description: 'Réparation Toit', provider: 'Toiture Pro', amount: 2500.00, date: '2024-10-25', category: 'réparation', status: 'terminée' },
  { id: '3', description: 'Nettoyage Espaces Communs', provider: 'Nettoyage Casablanca', amount: 450.00, date: '2024-11-01', category: 'nettoyage', status: 'terminée' },
  { id: '4', description: 'Mise à jour Système de Sécurité', provider: 'SafeGuard Maroc', amount: 1800.00, date: '2024-11-20', category: 'sécurité', status: 'en attente' },
  { id: '5', description: 'Entretien Chauffe-eau', provider: 'Plomberie Express', amount: 320.00, date: '2024-11-05', category: 'maintenance', status: 'terminée' }
];

// Données initiales factures
const initialInvoices = [
  { id: '1', fileName: 'facture_ascenseur_nov2024.pdf', type: 'prestation', uploadDate: '2024-11-11', uploadedBy: 'Gestionnaire Syndic', fileSize: '245 KB', description: 'Facture maintenance ascenseur' },
  { id: '2', fileName: 'recu_cotisation_ahmed.pdf', type: 'cotisation', uploadDate: '2024-11-02', uploadedBy: 'Admin', fileSize: '128 KB', description: 'Reçu paiement cotisation' }
];

// Initialisation du stockage local
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.RESIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(initialResidents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COTISATIONS)) {
    localStorage.setItem(STORAGE_KEYS.COTISATIONS, JSON.stringify(initialCotisations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRESTATIONS)) {
    localStorage.setItem(STORAGE_KEYS.PRESTATIONS, JSON.stringify(initialPrestations));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(initialInvoices));
  }
}

// --- Résidents ---
export function getResidents() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESIDENTS));
}

export function saveResident(resident) {
  const residents = getResidents();
  if (resident.id) {
    const index = residents.findIndex(r => r.id === resident.id);
    if (index !== -1) residents[index] = resident;
  } else {
    resident.id = Date.now().toString();
    residents.push(resident);
  }
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
  return resident;
}

export function deleteResident(id) {
  const residents = getResidents().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
}

// --- Cotisations ---
export function getCotisations() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.COTISATIONS));
}

export function saveCotisation(cotisation) {
  const cotisations = getCotisations();
  const residents = getResidents();
  const resident = residents.find(r => r.id === cotisation.residentId);
  if (resident) cotisation.residentName = resident.name;

  if (cotisation.id) {
    const index = cotisations.findIndex(c => c.id === cotisation.id);
    if (index !== -1) cotisations[index] = cotisation;
  } else {
    cotisation.id = Date.now().toString();
    cotisations.push(cotisation);
  }

  localStorage.setItem(STORAGE_KEYS.COTISATIONS, JSON.stringify(cotisations));
  return cotisation;
}

export function deleteCotisation(id) {
  const cotisations = getCotisations().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COTISATIONS, JSON.stringify(cotisations));
}

// --- Prestations ---
export function getPrestations() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRESTATIONS));
}

export function savePrestation(prestation) {
  const prestations = getPrestations();
  if (prestation.id) {
    const index = prestations.findIndex(p => p.id === prestation.id);
    if (index !== -1) prestations[index] = prestation;
  } else {
    prestation.id = Date.now().toString();
    prestations.push(prestation);
  }
  localStorage.setItem(STORAGE_KEYS.PRESTATIONS, JSON.stringify(prestations));
  return prestation;
}

export function deletePrestation(id) {
  const prestations = getPrestations().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRESTATIONS, JSON.stringify(prestations));
}

// --- Factures ---
export function getInvoices() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVOICES));
}

export function saveInvoice(invoice) {
  const invoices = getInvoices();
  invoice.id = Date.now().toString();
  invoices.push(invoice);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  return invoice;
}

export function deleteInvoice(id) {
  const invoices = getInvoices().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
}