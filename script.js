/**
 * DM Home Improvement LLC - Landing Page Interactivity Script
 * Includes 5-Second Automatic Pop-up & Render Viewer
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // 2. Consultation Modal Logic (Pop-up after 5 Seconds)
  const consultationModal = document.getElementById('consultationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.js-open-consultation');
  const modalForm = document.getElementById('modalForm');
  const modalFormContainer = document.getElementById('modalFormContainer');
  const modalSuccessMessage = document.getElementById('modalSuccessMessage');

  let modalOpened = false;

  function openModal() {
    if (consultationModal && !modalOpened) {
      consultationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      modalOpened = true;
    }
  }

  function closeModal() {
    if (consultationModal) {
      consultationModal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (modalFormContainer && modalSuccessMessage) {
          modalFormContainer.style.display = 'block';
          modalSuccessMessage.style.display = 'none';
          if (modalForm) modalForm.reset();
        }
      }, 300);
    }
  }

  // Trigger popup after 5 seconds automatically
  setTimeout(() => {
    openModal();
  }, 5000);

  // Manual trigger from buttons
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOpened = false; // Allow manual reopening even if already closed
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) {
        closeModal();
      }
    });
  }

  // Handle Consultation Modal Form Submit
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (modalFormContainer && modalSuccessMessage) {
        modalFormContainer.style.display = 'none';
        modalSuccessMessage.style.display = 'block';
      }
    });
  }

  // 3. Lead Capture Checklist Form Submission
  const leadChecklistForm = document.getElementById('leadChecklistForm');
  const leadFormContainer = document.getElementById('leadFormContainer');
  const leadSuccessMessage = document.getElementById('leadSuccessMessage');

  if (leadChecklistForm) {
    leadChecklistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (leadFormContainer && leadSuccessMessage) {
        leadFormContainer.style.display = 'none';
        leadSuccessMessage.classList.add('active');
      }
    });
  }

  // 4. Render Project Details Modal
  const projectModal = document.getElementById('projectModal');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalDesc = document.getElementById('projectModalDesc');
  const projectModalImg = document.getElementById('projectModalImg');
  const viewProjectBtns = document.querySelectorAll('.js-view-project');

  const projectDetailsMap = {
    '1': {
      title: 'Custom Outdoor Living Deck Render',
      desc: '3D Render design showcasing a high-end wooden deck complete with built-in seating, a cedar pergola, and custom framing for year-round outdoor comfort.',
      img: 'assets/deck-1.png'
    },
    '2': {
      title: 'Spacious Elevated Wood Deck Render',
      desc: 'Architectural deck design featuring high-grade pressure-treated pine planks, sturdy perimeter handrails, and a wide-open layout optimized for entertainment.',
      img: 'assets/deck-2.png'
    },
    '3': {
      title: 'Modern Composite Patio Deck Render',
      desc: 'Premium low-maintenance composite deck design paired with crisp white vinyl safety railings and smooth entrance transitions from house to deck.',
      img: 'assets/deck-3.png'
    }
  };

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const details = projectDetailsMap[projectId];

      if (details && projectModal) {
        if (projectModalTitle) projectModalTitle.textContent = details.title;
        if (projectModalDesc) projectModalDesc.textContent = details.desc;
        if (projectModalImg) projectModalImg.src = details.img;
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', () => {
      if (projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
