document.addEventListener("DOMContentLoaded", () => {
  // ------------------ SIDEBAR JS ------------------
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

  // ------------------ END OF SIDEBAR JS ------------------

  // ------------------ TABLE TOGGLE TO SHOW SUBMANIFEST ------------------
  document.querySelectorAll(".toggle-icon").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const targetRow = document.getElementById(targetId);
      const isCurrentlyOpen = targetRow.style.display === "table-row";

      // COLLAPSE ALL SUBMANIFEST ROW
      document.querySelectorAll(".submanifest-row").forEach((row) => {
        row.style.display = "none";
      });

      // RESET ALL CHEVRON ICONS
      document.querySelectorAll(".toggle-icon").forEach((el) => {
        el.classList.remove("fa-chevron-up");
        el.classList.add("fa-chevron-down");
      });

      if (!isCurrentlyOpen) {
        targetRow.style.display = "table-row";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      }
    });
  });
  // ------------------ VIEW MASTER MANIFEST BUTTON ------------------
  const viewMasterManifestBtn = document.querySelectorAll(
    ".btnViewMasterManifest"
  );
  viewMasterManifestBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      try {
        const url = btn.getAttribute("data-url");
        window.location.href = url;
      } catch (e) {
        console.error(e);
      }
    });
  });
  console.log("master man: ", viewMasterManifestBtn);
  // ------------------ APPROVE BUTTON ------------------
  const approveBtns = document.querySelectorAll(".btnApprove");

  // ------------------ APPROVE BUTTON ------------------
  const viewSubmanifestBtn = document.querySelectorAll(".btnViewSubManifest");
  console.log("sub man: ", viewMasterManifestBtn);
  // ------------------ DECLINE REASON MODAL ------------------
  const declineReasonModal = document.getElementById("declineReasonModal");
  document.querySelectorAll(".btnDecline").forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("click");
      declineReasonModal.style.display = "flex";
    });
  });

  // Close modal
  const closeDeclineModal = document.getElementById("closeDeclineModal");
  const cancelDeclineModal = document.getElementById("cancelDeclineBtn");

  const closeDeclineModalBtns = [closeDeclineModal, cancelDeclineModal];
  closeDeclineModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      declineReasonModal.style.display = "none";
    });
  });
  window.addEventListener("click", (e) => {
    if (e.target === declineReasonModal) {
      declineReasonModal.style.display = "none";
    }
  });
});
