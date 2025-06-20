// Add automatic print dialog if opened from the manifest list
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("print") === "true") {
    setTimeout(function () {
      window.print();
    }, 500);
  }
});
