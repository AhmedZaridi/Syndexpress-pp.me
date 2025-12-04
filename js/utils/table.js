// Classe pour trier les tableaux en cliquant sur les en-têtes
export class TableSorter {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    this.tbody = this.table.querySelector('tbody');
    this.headers = this.table.querySelectorAll('th[data-sort]');
    this.currentSort = { column: null, direction: 'asc' };
    this.init();
  }

  // Initialise les événements de clic sur les en-têtes
  init() {
    this.headers.forEach(header => {
      header.addEventListener('click', () => {
        const column = header.dataset.sort;
        this.sort(column);
      });
    });
  }

  // Fonction de tri
  sort(column) {
    const rows = Array.from(this.tbody.querySelectorAll('tr'));

    // Détermine la direction du tri (ascendant/descendant)
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    // Tri des lignes
    rows.sort((a, b) => {
      const aValue = a.dataset[column] || '';
      const bValue = b.dataset[column] || '';

      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      let comparison = 0;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        // Tri numérique si les valeurs sont des nombres
        comparison = aNum - bNum;
      } else {
        // Tri alphabétique sinon
        comparison = aValue.localeCompare(bValue);
      }

      return this.currentSort.direction === 'asc' ? comparison : -comparison;
    });

    // Supprime les classes de tri sur tous les en-têtes
    this.headers.forEach(header => {
      header.classList.remove('sorted-asc', 'sorted-desc');
    });

    // Ajoute la classe de tri à l'en-tête actif
    const activeHeader = Array.from(this.headers).find(h => h.dataset.sort === column);
    if (activeHeader) {
      activeHeader.classList.add(`sorted-${this.currentSort.direction}`);
    }

    // Réinsère les lignes triées dans le tableau
    rows.forEach(row => this.tbody.appendChild(row));
  }
}

// Fonction pour afficher un état vide lorsque le tableau est vide
export function createEmptyState(message) {
  return `
    <tr>
      <td colspan="100%" class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p>${message}</p>
      </td>
    </tr>
  `;
}