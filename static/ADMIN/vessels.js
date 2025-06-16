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

  // Notification modal functionality
  const notificationModal = document.getElementById("notificationModal");
  const notificationBtn = document.querySelector(".notification-btn");
  const closeModalBtn = document.getElementById("closeNotificationModal");

  // Function to show the notification modal
  function openNotificationModal() {
    notificationModal.classList.add("show-modal");
  }

  // Function to close the notification modal
  function closeNotificationModal() {
    notificationModal.classList.remove("show-modal");
  }

  // Close modal when clicking outside
  function clickOutside(e) {
    if (e.target === notificationModal) {
      closeNotificationModal();
    }
  }

  // Event listeners
  notificationBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    openNotificationModal();
  });

  closeModalBtn.addEventListener("click", closeNotificationModal);
  window.addEventListener("click", clickOutside);

  // Add escape key to close modal
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      notificationModal.classList.contains("show-modal")
    ) {
      closeNotificationModal();
    }
  });
});
