document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  document
    .querySelector(".collapse-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();

      // Apply transitions
      sidebar.classList.toggle("sidebar-collapsed");
      mainContent.classList.toggle("sidebar-collapsed-content");

      // Force a reflow for smooth transitions
      void sidebar.offsetWidth;
    });

  // Submenu toggle functionality
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    const hasSubmenu = item.querySelector(".nav-sub-menu");

    if (hasSubmenu) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Don't toggle if sidebar is collapsed - use hover instead
        if (!sidebar.classList.contains("sidebar-collapsed")) {
          // Toggle expanded class and show/hide submenu
          const isExpanded = item.classList.contains("expanded");

          if (isExpanded) {
            // If it's already expanded, collapse it
            item.classList.remove("expanded");
            hasSubmenu.style.height = "0px";
          } else {
            // If it's collapsed, expand it
            item.classList.add("expanded");
            hasSubmenu.style.height = "auto";

            // Close other expanded items
            navItems.forEach((otherItem) => {
              if (
                otherItem !== item &&
                otherItem.classList.contains("expanded")
              ) {
                otherItem.classList.remove("expanded");
                const otherSubmenu = otherItem.querySelector(".nav-sub-menu");
                if (otherSubmenu) {
                  otherSubmenu.style.height = "0px";
                }
              }
            });
          }
        }
      });
    }
  });

  // Initial layout state
  if (window.innerWidth <= 768) {
    sidebar.classList.add("sidebar-collapsed");
    mainContent.classList.add("sidebar-collapsed-content");
  }

  // EDIT ACTIVE VESSEL OPEN MODAL:
  const editVesselButtons = document.querySelectorAll(".btn-icon.edit");
  const editVesselModal = document.getElementById("editVesselModal");
  const closeEditVesselBtn = document.getElementById("editVesselCloseBtn");
  const cancelEditVesselBtn = document.getElementById("editVesselCancelBtn");
  const updateEditVesselBtn = document.getElementById("editVesselUpdateBtn");
  const editVesselForm = document.getElementById("editVesselForm");

  const vesselNameInput = document.getElementById("vesselName");
  const vesselIMOInput = document.getElementById("vesselIMO");
  const vesselTypeSelect = document.getElementById("vesselType");
  const vesselCapacityInput = document.getElementById("vesselCapacity");

  let orignalName = "";

  // OPEN EDIT ACTIVE VESSEL MODAL USING EVENT DELEGATION:
  editVesselButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // EXTRACT THE VESSEL DATA FROM THE BUTTON
      const name = btn.getAttribute("data-name");
      const type = btn.getAttribute("data-type");
      const imo = btn.getAttribute("data-imo");
      const capacity = btn.getAttribute("data-capacity");

      // PREFILL THE FORM
      vesselNameInput.value = name;
      vesselIMOInput.value = imo;
      vesselTypeSelect.value = type;
      vesselCapacityInput.value = capacity;

      // STORE OLD NAME FOR COMPARISON
      originalName = name;
      updateEditVesselBtn.disabled = true;

      // SHOW EDIT MODAL
      editVesselModal.style.display = "flex";
    });
  });

  // TRACK CHANGES IN VESSEL NAME:
  vesselNameInput.addEventListener("input", () => {
    const currentName = vesselNameInput.value.trim();
    updateEditVesselBtn.disabled =
      currentName === originalName || currentName === "";
  });
  const btnToCloseEditVesselModal = [cancelEditVesselBtn, closeEditVesselBtn];
  // CLOSE THE EDIT VESSEL MODAL:
  btnToCloseEditVesselModal.forEach((btn) => {
    btn.addEventListener("click", () => {
      editVesselModal.style.display = "none";
      editVesselForm.reset();
      updateEditVesselBtn.disabled = true;
    });
  });
  // CLOSE WHEN CLICKING OUTSIDE THE MODAL:
  window.addEventListener("click", (e) => {
    if (e.target === editVesselModal) {
      editVesselModal.style.display = "none";
      editVesselForm.reset();
      updateEditVesselBtn.disabled = true;
    }
  });

  // VESSEL TABLE EDIT:
  const statusOptions = [
    "Arrived",
    "In Transit",
    "Under Maintenance",
    "Delayed",
  ];
  const portOptions = ["Manila", "Cebu", "Davao", "Zamboanga", "Iloilo"];

  // Apply event delegation to all editable td cells
  document.querySelectorAll("table.vessels-table tbody td").forEach((cell) => {
    const header = cell
      .closest("table")
      .querySelectorAll("thead th")
      [cell.cellIndex].textContent.trim();

    const isEditable = ["Origin", "Destination", "Status"].includes(header);
    if (!isEditable) return;

    cell.classList.add("editable");

    cell.addEventListener("click", function handleCellClick(e) {
      if (cell.querySelector("select")) return; // prevent duplicate selects

      const currentValue = cell.textContent.trim();
      const select = document.createElement("select");

      const options = header === "Status" ? statusOptions : portOptions;

      options.forEach((opt) => {
        const optionEl = document.createElement("option");
        optionEl.value = opt;
        optionEl.textContent = opt;
        if (opt === currentValue) optionEl.selected = true;
        select.appendChild(optionEl);
      });

      cell.textContent = "";
      cell.appendChild(select);
      select.focus();

      // On blur or change, save the value MAO NI USBON NA PART IG BUTANG BACKEND
      const commitChange = () => {
        const newValue = select.value;

        // IF STATUS ANG G EDIT:
        if (header === "Status") {
          const badge = document.createElement("span");
          badge.classList.add("status-badge");
          // DYNAMICALLY APPLYING THE CORRECT STATUS:
          const classMap = {
            Arrived: "arrived",
            "In Transit": "in-transit",
            "Under Maintenance": "under-maintenance",
            Delayed: "delayed",
          };
          const badgeClass = classMap[newValue];
          if (badgeClass) badge.classList.add(badgeClass);

          badge.textContent = newValue;
          cell.innerHTML = "";
          cell.appendChild(badge);
        } else {
          cell.textContent = newValue;
        }
      };

      select.addEventListener("blur", commitChange);
      select.addEventListener("change", commitChange);
    });
  });

  // SORT TABLE:
  const statusPriority = {
    "in transit": 1,
    arrived: 2,
    delayed: 3,
    "under maintenance": 4,
    decommissioned: 5,
  };

  document.querySelectorAll(".sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const table = button.closest("table");
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));
      const currentOrder = button.getAttribute("data-order");
      const isAsc = currentOrder !== "asc";

      // Reset all sort icons and orders
      table.querySelectorAll(".sort-btn").forEach((btn) => {
        btn.setAttribute("data-order", "none");
        const icon = btn.querySelector("i");
        if (icon) icon.className = "fas fa-sort";
      });

      // SET CURRENT BUTTON
      button.setAttribute("data-order", isAsc ? "asc" : "desc");
      const sortIcon = button.querySelector("i");
      if (sortIcon) {
        sortIcon.className = isAsc ? "fas fa-sort-up" : "fas fa-sort-down";
      }

      // Sort the rows
      const colIndex = button.closest("th").cellIndex;

      // CHECK IF ITS THE STATUS COLUMN
      const isStatusColumn = button
        .closest("th")
        .classList.contains("status-column");

      const sortedRows = rows.sort((a, b) => {
        const valA = a.children[colIndex].textContent.trim().toLowerCase();
        const valB = b.children[colIndex].textContent.trim().toLowerCase();

        // IF STATUS COLUMN:
        if (isStatusColumn) {
          const aPriority = statusPriority[valA] || 99;
          const bPriority = statusPriority[valB] || 99;
          return isAsc ? aPriority - bPriority : bPriority - aPriority;
        }

        return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      // Re-append sorted rows
      sortedRows.forEach((row) => tbody.appendChild(row));
    });
  });
});
// OUTSIDE DOMCONTENTLOADED
