document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const collapseBtn = document.querySelector(".collapse-btn");

  collapseBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sidebar.classList.toggle("sidebar-collapsed");
    mainContent.classList.toggle("sidebar-collapsed-content");
    // Adjust submenu visibility if needed when collapsing
    if (sidebar.classList.contains("sidebar-collapsed")) {
      document
        .querySelectorAll(".nav-item.expanded .nav-sub-menu")
        .forEach((subMenu) => {
          // If you want to collapse submenus when main sidebar collapses
          // subMenu.style.height = '0';
        });
    }
  });

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector("a.nav-link"); // Ensure it's the main link
    const hasSubmenu = item.querySelector(".nav-sub-menu");

    if (hasSubmenu) {
      // Check for submenu
      link.addEventListener("click", function (e) {
        // Prevent default only if it's a dropdown toggle
        if (link.getAttribute("href") === "#") {
          e.preventDefault();
        }

        if (sidebar.classList.contains("sidebar-collapsed")) return;

        const isExpanded = item.classList.contains("expanded");

        // Close all other expanded items
        navItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("expanded")) {
            otherItem.classList.remove("expanded");
            const otherSubmenu = otherItem.querySelector(".nav-sub-menu");
            if (otherSubmenu) {
              otherSubmenu.style.height = "0px";
            }
          }
        });

        // Toggle current item
        if (!isExpanded) {
          item.classList.add("expanded");
          hasSubmenu.style.height = "auto";
        } else {
          item.classList.remove("expanded");
          hasSubmenu.style.height = "0px";
        }
      });
    }
  });

  // ------------------------ VOYAGE REPORT TOGGLE : LIST = DEFAULT, DETAIL = TOGGLE ------------------------
  const reportsListSection = document.getElementById(
    "voyage-reports-list-section"
  );
  const reportDetailSection = document.getElementById(
    "voyage-report-detail-section"
  );
  const reportCards = document.querySelectorAll(".voyage-report-card");
  const backToListBtn = document.getElementById("back-to-voyage-list");

  reportCards.forEach((card) => {
    card.addEventListener("click", () => {
      reportDetailSection.style.display = "block";
      reportsListSection.style.display = "none";
    });
  });
  if (backToListBtn) {
    backToListBtn.addEventListener("click", function () {
      reportDetailSection.style.display = "none";
      reportsListSection.style.display = "block";
    });
  }

  // ------------- PRINT BUTTON -------------
  const printBtn = document.getElementById("printReport");
  printBtn.addEventListener("click", () => {
    const originalContents = document.body.innerHTML;
    const printContents = document.getElementById(
      "voyage-report-detail-section"
    ).innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    this.location.reload();
  });
});
