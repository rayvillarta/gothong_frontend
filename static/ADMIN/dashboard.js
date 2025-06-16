// Initialize all charts
function initCharts() {
  // Shipment Volume Bar Chart
  const shipmentCtx = document.getElementById("shipmentChart").getContext("2d");
  const shipmentChart = new Chart(shipmentCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Current",
          data: [500, 700, 600, 800, 750, 900],
          backgroundColor: "#1E3A8A",
          borderRadius: 4,
        },
        {
          label: "Previous",
          data: [450, 650, 550, 700, 650, 800],
          backgroundColor: "#8CA6DB",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f0f0f0",
            drawBorder: false,
          },
          ticks: {
            stepSize: 200,
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#6B7280",
          },
        },
      },
    },
  });

  // Vessel Status Doughnut Chart
  const vesselCtx = document.getElementById("vesselChart").getContext("2d");
  const vesselChart = new Chart(vesselCtx, {
    type: "doughnut",
    data: {
      labels: ["Operational", "Maintenance", "Damage"],
      datasets: [
        {
          data: [60, 25, 15],
          backgroundColor: ["#2D9C5A", "#FCDDB0", "#D14343"],
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
            padding: 20,
            font: {
              size: 12,
              family: "'Montserrat', sans-serif",
            },
            color: "#0A1F44",
          },
        },
      },
    },
  });

  // Incident Reports Line Chart
  const incidentCtx = document.getElementById("incidentChart").getContext("2d");
  const incidentChart = new Chart(incidentCtx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Incidents",
          data: [5, 3, 6, 2, 4, 7],
          fill: false,
          borderColor: "#D14343",
          tension: 0.3,
          pointBackgroundColor: "#D14343",
          pointBorderColor: "#fff",
          pointHoverRadius: 6,
          pointRadius: 4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
      },
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f0f0f0",
            drawBorder: false,
          },
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });

  return [shipmentChart, vesselChart, incidentChart];
}

// Toggle sidebar collapse
document.addEventListener("DOMContentLoaded", function () {
  const charts = initCharts();
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

      // Resize charts after sidebar toggle animation completes
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        charts.forEach((chart) => {
          chart.resize();
          chart.render();
        });
      }, 350);
    });

  // Submenu toggle functionality
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    const hasSubmenu = item.querySelector(".nav-sub-menu");

    if (hasSubmenu) {
      link.addEventListener("click", function (e) {
        // If the link has a real URL (not just #), navigate to it
        if (this.getAttribute("href") && this.getAttribute("href") !== "#") {
          window.location.href = this.getAttribute("href");
          return;
        }

        e.preventDefault();

        // Reset userHasClickedSubNav flag when clicking main Dashboard nav
        // This ensures sub-links won't be active until explicitly clicked
        userHasClickedSubNav = false;

        // Remove active class from all sub-links when main nav is clicked
        document.querySelectorAll(".nav-sub-link").forEach((subLink) => {
          subLink.classList.remove("active");
        });

        // Don't toggle if sidebar is collapsed - use hover instead
        if (!sidebar.classList.contains("sidebar-collapsed")) {
          item.classList.toggle("expanded");

          // Close other expanded items
          navItems.forEach((otherItem) => {
            if (
              otherItem !== item &&
              otherItem.classList.contains("expanded")
            ) {
              otherItem.classList.remove("expanded");
            }
          });
        }
      });
    } else if (link) {
      // Handle direct navigation for links without submenus
      link.addEventListener("click", function (e) {
        if (this.getAttribute("href") && this.getAttribute("href") !== "#") {
          // No need to prevent default - let browser navigate normally
        } else {
          e.preventDefault();
        }
      });
    }
  });

  // Track if user has manually clicked a sub-nav link
  let userHasClickedSubNav = false;

  // Navigation handling for sub-links
  document.querySelectorAll(".nav-sub-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Check if this is a real URL or a page anchor
      const href = this.getAttribute("href");

      if (href && !href.startsWith("#")) {
        // It's a real URL, let navigation happen normally
        return;
      }

      e.preventDefault();

      // Set flag that user has interacted with navigation
      userHasClickedSubNav = true;

      // Remove active class from all sub links
      document.querySelectorAll(".nav-sub-link").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked link
      this.classList.add("active");

      const targetId = href;
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Set active submenu item on scroll, but only after user has interacted
  window.addEventListener("scroll", function () {
    // Don't update active link on initial page load scroll events
    if (!userHasClickedSubNav && window.scrollY < 100) {
      return;
    }

    const scrollPosition = window.scrollY;

    // Get all sections
    const sections = [
      document.querySelector("#mapSection"),
      document.querySelector("#activeVesselsSection"),
      document.querySelector("#analyticsSection"),
    ];

    // Find the current section in view
    let currentSection = null;
    sections.forEach((section) => {
      if (section) {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section.id;
        }
      }
    });

    // Set active state on navigation only when user has clicked a sub-nav link
    if (currentSection && userHasClickedSubNav) {
      document.querySelectorAll(".nav-sub-link").forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
          link.classList.add("active");
        }
      });
    }
  });

  // Initial layout state
  if (window.innerWidth <= 768) {
    sidebar.classList.add("sidebar-collapsed");
    mainContent.classList.add("sidebar-collapsed-content");
  }

  // Handle window resize events
  window.addEventListener("resize", function () {
    // Resize charts on window resize
    charts.forEach((chart) => {
      chart.resize();
    });
  });
});

// Initialize map centered on Philippines
const map = L.map("vessel-map").setView([12.8797, 121.774], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const filterToggle = document.getElementById("filterToggle");
const filterDropdown = document.getElementById("filterDropdown");

filterToggle.addEventListener("click", () => {
  filterDropdown.style.display =
    filterDropdown.style.display === "block" ? "none" : "block";
});

// Optional: Click outside to close the dropdown
document.addEventListener("click", (e) => {
  if (!document.querySelector(".filter-wrapper").contains(e.target)) {
    filterDropdown.style.display = "none";
  }
});
// Define Philippine territorial waters boundary (simplified polygon)
// This is an approximate boundary for demonstration purposes
const philTerritorialWaters = [
  // Northern bounds
  [21.1, 119.0],
  [21.1, 127.0],
  // Eastern bounds
  [21.1, 127.0],
  [4.2, 127.0],
  // Southern bounds
  [4.2, 127.0],
  [4.2, 114.0],
  // Western bounds
  [4.2, 114.0],
  [21.1, 119.0],
];

// Philippine major ports with coordinates
const philippinePorts = {
  Manila: [14.5995, 120.9842],
  Cebu: [10.3157, 123.9054],
  Davao: [7.0727, 125.6127],
  Iloilo: [10.7202, 122.5621],
  Subic: [14.7824, 120.2817],
  Zamboanga: [6.9214, 122.079],
  "Cagayan de Oro": [8.4542, 124.6319],
  Batangas: [13.7565, 121.0583],
};

// Add vessel markers for Philippine locations
const vesselMarkers = [
  {
    name: "Manila Bay Express",
    position: [14.5995, 120.9842], // Manila
    status: "arrived",
    icon: L.divIcon({
      html: '<i class="fas fa-ship" style="color: #2D9C5A; font-size: 24px;"></i>',
      className: "vessel-marker",
      iconSize: [24, 24],
    }),
  },
  {
    name: "Cebu Pearl",
    position: [10.3157, 123.9054], // Cebu
    status: "docked",
    icon: L.divIcon({
      html: '<i class="fas fa-ship" style="color: #4682B4; font-size: 24px;"></i>',
      className: "vessel-marker",
      iconSize: [24, 24],
    }),
  },
  {
    name: "Mindanao Explorer",
    position: [12.5, 123.0], // Off Samar coast
    status: "in-transit",
    icon: L.divIcon({
      html: '<i class="fas fa-ship" style="color: #D4AF37; font-size: 24px;"></i>',
      className: "vessel-marker",
      iconSize: [24, 24],
    }),
  },
  {
    name: "Visayas Navigator",
    position: [11.2, 123.7], // Between Panay and Negros
    status: "in-transit",
    icon: L.divIcon({
      html: '<i class="fas fa-ship" style="color: #D4AF37; font-size: 24px;"></i>',
      className: "vessel-marker",
      iconSize: [24, 24],
    }),
  },
];

// Add vessel markers to the map
vesselMarkers.forEach((vessel) => {
  const marker = L.marker(vessel.position, {
    icon: vessel.icon,
    title: vessel.name,
  }).addTo(map);

  // Add popup with vessel info
  marker.bindPopup(
    `<div style="font-family: 'Montserrat', sans-serif;">
                    <h4 style="margin: 0 0 5px 0; font-family: 'Exo 2', sans-serif;">${
                      vessel.name
                    }</h4>
                    <p style="margin: 0 0 3px 0; font-size: 0.9em;">
                        <strong>Status:</strong> 
                        <span style="color: ${
                          vessel.status === "arrived"
                            ? "#2D9C5A"
                            : vessel.status === "docked"
                            ? "#4682B4"
                            : "#D4AF37"
                        }">
                            ${
                              vessel.status === "arrived"
                                ? "Arrived"
                                : vessel.status === "docked"
                                ? "Docked"
                                : "In Transit"
                            }
                        </span>
                    </p>
                    <p style="margin: 0; font-size: 0.9em;">
                        <strong>Location:</strong> 
                        ${vessel.position[0].toFixed(
                          4
                        )}°N, ${vessel.position[1].toFixed(4)}°E
                    </p>
                </div>`
  );
});

// Add port markers
Object.entries(philippinePorts).forEach(([portName, coords]) => {
  L.marker(coords, {
    icon: L.divIcon({
      html: '<i class="fas fa-anchor" style="color: #1E3A8A; font-size: 20px;"></i>',
      className: "port-marker",
      iconSize: [20, 20],
    }),
  })
    .addTo(map)
    .bindPopup(`<b>${portName} Port</b>`);
});

// Add territorial waters polygon
L.polygon(philTerritorialWaters, {
  color: "#1E3A8A",
  fillColor: "#1E3A8A",
  fillOpacity: 0.1,
  weight: 1,
  dashArray: "5, 5",
})
  .addTo(map)
  .bindPopup("<b>Philippine Territorial Waters</b>");

// Simulate vessel movement for demo purposes
function simulateVesselMovement() {
  // Move Mindanao Explorer eastward
  const mindanaoExplorer = vesselMarkers.find(
    (v) => v.name === "Mindanao Explorer"
  );
  if (mindanaoExplorer) {
    mindanaoExplorer.position[1] += 0.05;
    if (mindanaoExplorer.position[1] > 125.0) {
      mindanaoExplorer.position[1] = 123.0;
    }
  }

  // Move Visayas Navigator northward
  const visayasNavigator = vesselMarkers.find(
    (v) => v.name === "Visayas Navigator"
  );
  if (visayasNavigator) {
    visayasNavigator.position[0] += 0.03;
    if (visayasNavigator.position[0] > 11.8) {
      visayasNavigator.position[0] = 11.2;
    }
  }

  // Update map markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker && layer.options.title) {
      const vessel = vesselMarkers.find((v) => v.name === layer.options.title);
      if (vessel) {
        layer.setLatLng(vessel.position);
      }
    }
  });
}

// Update vessel positions every 5 seconds
setInterval(simulateVesselMovement, 5000);

// DROPDOWN FOR THE USER PROFILE
const profileToggle = document.querySelector(".user-profile i.fas");
const profileDropdown = document.getElementById("profileDropdown");

profileToggle.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");

  // Set chevron based on dropdown visibility
  if (profileDropdown.classList.contains("hidden")) {
    profileToggle.classList.remove("fa-chevron-up");
    profileToggle.classList.add("fa-chevron-down");
  } else {
    profileToggle.classList.remove("fa-chevron-down");
    profileToggle.classList.add("fa-chevron-up");
  }
});

document.addEventListener("click", (event) => {
  const isClickInside = document
    .querySelector(".user-profile")
    .contains(event.target);

  if (!isClickInside) {
    // Only run if dropdown is visible
    if (!profileDropdown.classList.contains("hidden")) {
      profileDropdown.classList.add("hidden");

      // Always reset icon to chevron-down
      profileToggle.classList.remove("fa-chevron-up");
      profileToggle.classList.add("fa-chevron-down");
    }
  }
});

// EDIT PROFILE OPEN MODAL TOPBAR
document.addEventListener("DOMContentLoaded", () => {
  // SIDEBAR:
  const sidebarEditProfileBtn = document.getElementById(
    "sidebarEditProfileBtn"
  );
  const editProfileModal = document.getElementById("editProfileModal");
  const openEditProfileBtn = document.getElementById("editProfileBtn");
  const closeEditProfileModalBtn = document.getElementById(
    "editProfileCloseBtn"
  );
  const cancelEditProfileBtn = document.getElementById("editProfileCancelBtn");
  const editProfileForm = document.getElementById("editProfileForm");

  const avatarInput = document.getElementById("avatarUpload");
  const avatarPreview = document.getElementById("avatarPreview");

  const editableFields = ["firstName", "lastName"];
  // OPEN MODAL:
  sidebarEditProfileBtn.addEventListener("click", () => {
    editProfileModal.style.display = "flex";
  });
  openEditProfileBtn.addEventListener("click", () => {
    editProfileModal.style.display = "flex";
  });
  // CLOSE MODAL:
  closeEditProfileModalBtn.addEventListener("click", () => {
    editProfileModal.style.display = "none";
  });
  // CANCEL MODAL:
  cancelEditProfileBtn.addEventListener("click", () => {
    editProfileModal.style.display = "none";
  });
  // MAKE INPUT FIELDS EDITABLE:
  editableFields.forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("click", () => {
      input.readOnly = false;
      input.style.backgroundColor = "white";
      input.focus();
    });
  });
  // AVATAR PREVIEW:
  avatarInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => (avatarPreview.src = e.target.result);
      reader.readAsDataURL(file);
    }
  });

  // FORM SUBMIT:
  editProfileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // TODO ADD AJAX HERE
  });

  // CLOSE MODAL WHEN CLICKING OUTSIDE:
  // window.addEventListener("click", function (e) {
  //   if (e.target === modal) {
  //     modal.style.display = "none";
  //   }
  // });

  // CHANGE PASSWORD MODAL:
  const sidebarChangePassword = document.getElementById(
    "sidebarChangePassword"
  );
  const changePassModal = document.getElementById("changePasswordModal");
  const openPasswordModal = document.getElementById("changePasswordBtn");
  const closePasswordModal = document.getElementById("changePasswordCloseBtn");
  const cancelPasswordModal = document.getElementById(
    "changePasswordCancelBtn"
  );
  const passwordForm = document.getElementById("changePasswordForm");
  const errorDiv = document.getElementById("changePasswordError");

  // OPEN CHANGE PASSWORD MODAL:
  sidebarChangePassword.addEventListener("click", () => {
    changePassModal.style.display = "flex";
  });
  openPasswordModal.addEventListener("click", () => {
    changePassModal.style.display = "flex";
  });

  // CLOSE CHANGE PASSWORD MODAL:
  [closePasswordModal, cancelPasswordModal].forEach((btn) =>
    btn.addEventListener("click", () => {
      changePassModal.style.display = "none";
      errorDiv.style.display = "none";
      passwordForm.reset();
    })
  );

  //TOGGLE PASSWORD VISIBILITY:
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      icon.classList.toggle("fa-eye", isVisible);
      icon.classList.toggle("fa-eye-slash", !isVisible);
    });
  });

  //HANDLE FORM SUBMISSION
  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const oldPassword = form.old_password.value.trim();
    const newPassword = form.new_password.value.trim();
    const confirmPassword = form.confirm_password.value.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
      errorDiv.textContent = "All fields required.";
      errorDiv.style.display = "block";
      return;
    }

    if (newPassword !== confirmPassword) {
      errorDiv.textContent = "New passwords does not match!";
      errorDiv.style.display = "block";
      return;
    }

    // TODO ACTUAL REQUEST WITH THE BACKEND AJAX
    // FORM SUBMISSION
  });

  window.addEventListener("click", function (e) {
    if (e.target === editProfileModal) {
      editProfileModal.style.display = "none";
    }
    if (e.target === changePassModal) {
      changePassModal.style.display = "none";
    }
  });

  // NOTIFICATION:
  const notifToggle = document.getElementById("notificationToggle");
  const notifDropdown = document.getElementById("notificationDropdown");

  notifToggle.addEventListener("click", () => {
    notifDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    const isClickInside =
      notifToggle.contains(event.target) ||
      notifDropdown.contains(event.target);
    if (!isClickInside) {
      notifDropdown.classList.add("hidden");
    }
  });
});

// OUTSIDE DOM LOADED:
//updateNotificationBadge(); // call after DOM loaded or any update

// UPDATE THE NOTIFICATION ICON BLUE
function updateNotificationBadge() {
  const unreadCount = document.querySelectorAll(
    ".notification-item.unread"
  ).length;
  const badge = document.querySelector(".notification-badge");

  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}
