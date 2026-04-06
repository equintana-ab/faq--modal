let isDragging = false;
let startY = 0;
let currentY = 0;

// Getters
const getModal = () => document.getElementById("faq-modal");
const getModalContent = () => document.querySelector(".modal-content");

function closeModal(slide = false) {
  const modal = getModal();
  const modalContent = getModalContent();
  if (!modal || !modalContent) return;

  if (slide) {
    modalContent.style.transition = "transform 0.4s ease-out";
    modalContent.style.transform = "translateY(100%)";
    modal.style.transition = "opacity 0.4s ease-out";
    modal.style.opacity = "0";
  }
  setTimeout(
    () => {
      modal.classList.remove("show-modal");
      modal.style.cssText = "";
      modalContent.style.cssText = "";
      document.body.style.overflow = "auto";
    },
    slide ? 300 : 0,
  );
}

function onTouchStart(e) {
  isDragging = true;
  startY = e.touches[0].clientY;
  currentY = e.touches[0].clientY;
  getModalContent().style.transition = "none";
}

function onTouchMove(e) {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  const dragDistance = currentY - startY;
  if (dragDistance > 0) {
    getModalContent().style.transform = `translateY(${dragDistance}px)`;
    const opacity = 1 - dragDistance / window.innerHeight;
    getModal().style.opacity = Math.max(opacity, 0);
  }
}

function onTouchEnd() {
  if (!isDragging) return;
  isDragging = false;
  const modalContent = getModalContent();
  modalContent.style.transition = "transform 0.5s ease-out";
  if (currentY - startY > window.innerHeight / 4) {
    closeModal(true);
  } else {
    modalContent.style.transition = "transform 0.35s ease-out";
    getModal().style.transition = "opacity 0.35s ease-out";
    modalContent.style.transform = "translateY(0)";
    getModal().style.opacity = "1";
  }
}

const mobileQuery = window.matchMedia("(max-width: 767px)");

function setupDragListeners() {
  const modalContent = getModalContent();
  if (!modalContent) return;
  modalContent.removeEventListener("touchstart", onTouchStart);
  modalContent.removeEventListener("touchmove", onTouchMove);
  modalContent.removeEventListener("touchend", onTouchEnd);
  if (mobileQuery.matches) {
    modalContent.addEventListener("touchstart", onTouchStart);
    modalContent.addEventListener("touchmove", onTouchMove);
    modalContent.addEventListener("touchend", onTouchEnd);
  }
}

mobileQuery.addEventListener("change", setupDragListeners);

// Single delegated listener on document
document.addEventListener("click", (e) => {
  const modal = getModal();
  const modalContent = getModalContent();

  // Open
  if (e.target.closest("#open-button")) {
    if (!modal || !modalContent) return;
    modal.style.opacity = "";
    modal.style.transition = "";
    modalContent.style.transform = "";
    modalContent.style.transition = "";
    modal.classList.add("show-modal");
    document.body.style.overflow = "hidden";
    setupDragListeners(); // reattach to fresh element
  }

  // Close (X button)
  if (e.target.closest(".faq-section_header-main > svg")) {
    closeModal();
  }

  // Close on backdrop click
  if (e.target === modal) {
    closeModal();
  }
});

// Prevent clicks inside modal from closing it
document.addEventListener("click", (e) => {
  const modal = getModal();
  if (e.target.closest(".modal-content") && e.target !== modal) {
    e.stopPropagation();
  }
});

function initFaqTabs() {
  const options = document.querySelectorAll(".faq-option");
  const containers = document.querySelectorAll(".faq-container");

  if (!options.length) return;

  options.forEach((option) => {
    option.onclick = () => {
      const target = option.dataset.target;

      options.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");

      containers.forEach((c) => {
        c.classList.toggle("hidden", c.dataset.category !== target);

        // optional: close open accordions
        if (c.dataset.category !== target) {
          c.querySelectorAll("input[type='checkbox']").forEach((i) => (i.checked = false));
        }
      });
    };
  });
}

document.addEventListener("click", (e) => {
  const option = e.target.closest(".faq-option");
  if (!option) return;

  const target = option.dataset.target;

  document.querySelectorAll(".faq-option").forEach((o) => o.classList.remove("active"));

  option.classList.add("active");

  document
    .querySelectorAll(".faq-container")
    .forEach((c) => c.classList.toggle("hidden", c.dataset.category !== target));
});

// Runs on normal load
document.addEventListener("DOMContentLoaded", initFaqTabs);

// Runs when coming back via browser back button
window.addEventListener("pageshow", initFaqTabs);
