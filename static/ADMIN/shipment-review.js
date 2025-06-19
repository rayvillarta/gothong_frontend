document.addEventListener("DOMContentLoaded", function () {
  // Sidebar Toggle Functionality
  const sidebarToggle = document.getElementById("collapse-sidebar");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar-collapsed");
    mainContent.classList.toggle("sidebar-collapsed-content");
  });

  // Submenu toggle functionality
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    const hasSubmenu = item.querySelector(".nav-sub-menu");

    if (hasSubmenu) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        item.classList.toggle("expanded");

        // Close other expanded items
        navItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("expanded")) {
            otherItem.classList.remove("expanded");
          }
        });
      });
    }
  });

  // Select all checkboxes functionality
  const selectAllCheckbox = document.getElementById("select-all");
  const shipmentCheckboxes = document.querySelectorAll(".shipment-select");

  selectAllCheckbox.addEventListener("change", function () {
    shipmentCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Filter functionality
  const sortSelect = document.getElementById("sort-select");
  const statusFilter = document.getElementById("status-filter");
  const timeFilter = document.getElementById("time-filter");
  const refreshBtn = document.getElementById("btn-refresh");

  function applyFilters() {
    console.log("Applying filters:");
    console.log("Sort by:", sortSelect.value);
    console.log("Status:", statusFilter.value);
    console.log("Time period:", timeFilter.value);

    // In a real application, this would call an API or reload the data
    // Here we just show a notification
    alert(
      "Filters applied! In a real application, this would refresh the data."
    );
  }

  sortSelect.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  timeFilter.addEventListener("change", applyFilters);
  refreshBtn.addEventListener("click", applyFilters);

  // Export functionality
  const exportBtn = document.getElementById("btn-export");

  exportBtn.addEventListener("click", function () {
    // In a real application, this would generate a CSV or Excel file
    alert("This would download the current filtered shipments as a CSV file.");
  });

  // Action buttons functionality
  const verifyButtons = document.querySelectorAll(".btn-success");
  const rejectButtons = document.querySelectorAll(".btn-danger");

  verifyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const shipmentId = row.cells[1].textContent;

      // Update the status badge
      const statusCell = row.cells[7];
      statusCell.innerHTML =
        '<span class="badge badge-verified">Verified</span>';

      // Remove the action buttons
      this.remove();
      row.querySelector(".btn-danger").remove();

      // In a real application, this would make an API call to update the status
      console.log("Verified shipment:", shipmentId);
      alert("Shipment " + shipmentId + " has been verified.");
    });
  });

  rejectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const shipmentId = row.cells[1].textContent;

      // Update the status badge
      const statusCell = row.cells[7];
      statusCell.innerHTML =
        '<span class="badge badge-rejected">Rejected</span>';

      // Remove the action buttons
      this.remove();
      row.querySelector(".btn-success").remove();

      // In a real application, this would make an API call to update the status
      console.log("Rejected shipment:", shipmentId);
      alert("Shipment " + shipmentId + " has been rejected.");
    });
  });
});
