document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  const form = document.querySelector(".multiStepForm");
  const steps = document.querySelectorAll(".form-step");
  const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");

  // Show a specific step
  function showStep(step) {
    steps.forEach((stepDiv) => stepDiv.classList.add("d-none"));
    document.getElementById(`step-${step}`).classList.remove("d-none");

    updateBreadcrumb(step);
    currentStep = step;
  }

  // Update breadcrumb highlights
  function updateBreadcrumb(step) {
    breadcrumbItems.forEach((item, index) => {
      item.classList.toggle("active", index + 1 === step);
    });
  }

  // Move to the next step
  function nextStep(event) {
    event.preventDefault();
    if (currentStep < steps.length) {
      showStep(currentStep + 1);
    }
  }

  // Reset form to initial state
  function resetForm() {
    form.reset(); // Reset fields
    showStep(1); // Go back to Step 1
  }

  // Attach event listeners dynamically
  document.querySelector("#nextStep2").addEventListener("click", nextStep); // Ensure this matches your button ID

  // Handle form submission and show the last step
  document
    .querySelector("#submitForm")
    .addEventListener("click", function (event) {
      event.preventDefault();
      showStep(3); // Show Step 3 after form submission
    });

  // Initialize first step
  showStep(1);
});
