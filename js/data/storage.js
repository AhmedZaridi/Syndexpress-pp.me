// storage.js

const STORAGE_KEYS = {
  RESIDENTS: 'syndexpress_residents',
  COTISATIONS: 'syndexpress_cotisations',
  PRESTATIONS: 'syndexpress_prestations',
  INVOICES: 'syndexpress_invoices'
};

// --- Initialisation du stockage local vide ---
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.RESIDENTS)) {
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COTISATIONS)) {
    localStorage.setItem(STORAGE_KEYS.COTISATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRESTATIONS)) {
    localStorage.setItem(STORAGE_KEYS.PRESTATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([]));
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