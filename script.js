/**
 * DM Home Improvement LLC - Accessible Decks & Ramps Landing Page Script
 * 5-Step Qualification Questionnaire & Embedded Google Calendar Scheduler
 */
document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 2. Interactive Qualification Questionnaire & Booking Modal Logic (5 Steps)
  // --------------------------------------------------------------------------
  const consultationModal = document.getElementById('consultationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.js-open-consultation');

  let currentDeckStep = 1;
  const totalDeckSteps = 5;
  let quizHasAutoTriggered = false;

  const deckUserAnswers = {
    goal: '',
    timeline: '',
    idea: '',
    name: '',
    phone: '',
    email: '',
    zip: ''
  };

  const deckStepElements = {
    1: document.getElementById('deckQuizStep1'),
    2: document.getElementById('deckQuizStep2'),
    3: document.getElementById('deckQuizStep3'),
    4: document.getElementById('deckQuizStep4'),
    5: document.getElementById('deckQuizStep5'),
    success: document.getElementById('deckQuizStepSuccess')
  };

  const stepIndicator = document.getElementById('deckQuizStepIndicator');
  const progressFill = document.getElementById('deckQuizProgressFill');

  const updateDeckQuizStep = (newStep) => {
    currentDeckStep = newStep;

    Object.values(deckStepElements).forEach(el => {
      if (el) el.style.display = 'none';
    });

    if (newStep <= totalDeckSteps) {
      if (deckStepElements[newStep]) deckStepElements[newStep].style.display = 'block';
      if (stepIndicator) stepIndicator.textContent = `STEP ${newStep} OF ${totalDeckSteps}`;
      if (progressFill) progressFill.style.width = `${(newStep / totalDeckSteps) * 100}%`;
    } else {
      if (deckStepElements.success) deckStepElements.success.style.display = 'block';
      if (stepIndicator) stepIndicator.textContent = 'COMPLETE';
      if (progressFill) progressFill.style.width = '100%';
    }
  };

  function openDeckModal(forceStep = 1) {
    if (consultationModal) {
      updateDeckQuizStep(forceStep);
      consultationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDeckModal() {
    if (consultationModal) {
      consultationModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 5-Second Automatic Trigger
  setTimeout(() => {
    if (!quizHasAutoTriggered && !sessionStorage.getItem('dm_deck_modal_dismissed')) {
      openDeckModal(1);
      quizHasAutoTriggered = true;
    }
  }, 5000);

  // Manual Trigger from all CTA buttons across the page
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDeckModal(1); // Always open cleanly at Step 1
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      sessionStorage.setItem('dm_deck_modal_dismissed', 'true');
      closeDeckModal();
    });
  }

  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) {
        sessionStorage.setItem('dm_deck_modal_dismissed', 'true');
        closeDeckModal();
      }
    });
  }

  // Step 1 Selection (Goal)
  document.querySelectorAll('#deckQuizStep1 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.goal = card.dataset.value;
      updateDeckQuizStep(2);
    });
  });

  // Step 2 Selection (Timeline)
  document.querySelectorAll('#deckQuizStep2 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.timeline = card.dataset.value;
      updateDeckQuizStep(3);
    });
  });

  // Step 3 Selection (Existing Idea)
  document.querySelectorAll('#deckQuizStep3 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.idea = card.dataset.value;
      updateDeckQuizStep(4);
    });
  });

  // Step 4 Form Submit -> Proceeds to Step 5 (Embedded Google Calendar Scheduler)
  const deckQuizContactForm = document.getElementById('deckQuizContactForm');
  if (deckQuizContactForm) {
    deckQuizContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      deckUserAnswers.name = document.getElementById('deckQuizName').value;
      deckUserAnswers.phone = document.getElementById('deckQuizPhone').value;
      deckUserAnswers.email = document.getElementById('deckQuizEmail').value;
      deckUserAnswers.zip = document.getElementById('deckQuizZip').value;

      console.log('DM Home Improvement Lead Info:', deckUserAnswers);
      updateDeckQuizStep(5);
    });
  }

  // Step 5 Confirmation Button -> Proceeds to Final Success Screen
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      console.log('DM Home Improvement Appointment Completed:', deckUserAnswers);
      updateDeckQuizStep(6);
    });
  }

  // Success Screen Close Button
  const closeModalSuccessBtn = document.getElementById('closeModalSuccessBtn');
  if (closeModalSuccessBtn) {
    closeModalSuccessBtn.addEventListener('click', () => {
      closeDeckModal();
    });
  }

  // --------------------------------------------------------------------------
  // 3. Lead Capture Checklist Form Submission
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 4. Render Project Details Modal
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('projectModal');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalDesc = document.getElementById('projectModalDesc');
  const projectModalImg = document.getElementById('projectModalImg');
  const viewProjectBtns = document.querySelectorAll('.js-view-project');

  const projectDetailsMap = {
    '1': {
      title: 'Custom Outdoor Living Deck',
      desc: 'Custom outdoor design showcasing a high-end wooden deck complete with built-in seating, a cedar pergola, and custom framing for year-round outdoor comfort.',
      img: 'assets/deck-1.png'
    },
    '2': {
      title: 'Spacious Elevated Wood Deck',
      desc: 'Custom deck design featuring high-grade pressure-treated pine planks, sturdy perimeter handrails, and a wide-open layout optimized for entertainment.',
      img: 'assets/deck-2.png'
    },
    '3': {
      title: 'Modern Composite Patio Deck',
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
