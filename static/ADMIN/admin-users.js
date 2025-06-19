// Toggle sidebar collapse
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

      // Check for and fix expanded items when sidebar collapses
      if (sidebar.classList.contains("sidebar-collapsed")) {
        // Reset expanded nav items when sidebar collapses
        document.querySelectorAll(".nav-item.expanded").forEach((item) => {
          if (window.getComputedStyle(sidebar).width === "80px") {
            // Keep the expanded class for hover effect but collapse the height
            item.querySelector(".nav-sub-menu").style.height = "0";
          }
        });
      }
    });

  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      // Here you would typically show/hide the corresponding user cards
      // This is a placeholder for the filtering logic
      const userType = button.dataset.tab;
      console.log(`Showing ${userType} users`);
    });
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

  // ------------- CREATE ADMIN MODAL -------------
  const addAdminBtn = document.getElementById("addAdmin");
  const addAdminModal = document.getElementById("createAdminModal");
  const addAdminCloseBtn = document.getElementById("closeAdminModal");
  const addAdminCancelBtn = document.getElementById("cancelAdminModal");
  const createAdminBtn = document.getElementById("createAdmin");

  const closeModal = (modal) => {
    modal.style.display = "none";
  };

  const adminCloseBtns = [addAdminCancelBtn, addAdminCloseBtn];
  adminCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(addAdminModal);
    });
  });

  addAdminBtn.addEventListener("click", () => {
    addAdminModal.style.display = "flex";
  });
  window.addEventListener("click", (e) => {
    if (e.target === addAdminModal) {
      closeModal(addAdminModal);
    }
  });

  // TODO: CREATE ADMIN LOGIC HERE

  // ------------- CREATE EMPLOYEE MODAL -------------
  const addEmployeeBtn = document.getElementById("addEmployee");
  const addEmployeeModal = document.getElementById("createEmployeeModal");
  const addEmployeeCloseBtn = document.getElementById("closeEmployeeModal");
  const addEmployeeCancelBtn = document.getElementById("cancelEmployeeModal");
  const createEmployeeBtn = document.getElementById("createEmployee");

  const employeeCloseBtns = [addEmployeeCancelBtn, addEmployeeCloseBtn];
  employeeCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(addEmployeeModal);
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === addEmployeeModal) {
      closeModal(addEmployeeModal);
    }
  });

  addEmployeeBtn.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });
});
