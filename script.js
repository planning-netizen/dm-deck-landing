/**
 * DM Home Improvement LLC - Accessible Decks & Ramps Landing Page Script
 * Includes 5-Second Interactive Multi-Step Qualification Quiz Popup & Render Viewer
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
  // 2. Interactive Qualification Questionnaire Modal Logic (4 Steps)
  // --------------------------------------------------------------------------
  const consultationModal = document.getElementById('consultationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.js-open-consultation');

  let currentDeckStep = 1;
  const totalDeckSteps = 4;
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

  function openDeckModal() {
    if (consultationModal) {
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
    if (!quizHasAutoTriggered && !localStorage.getItem('dm_deck_quiz_submitted')) {
      openDeckModal();
      quizHasAutoTriggered = true;
    }
  }, 5000);

  // Manual Trigger from all CTA buttons
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDeckModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDeckModal);
  }

  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) {
        closeDeckModal();
      }
    });
  }

  // Quiz Step 1 Selection (Goal)
  document.querySelectorAll('#deckQuizStep1 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.goal = card.dataset.value;
      updateDeckQuizStep(2);
    });
  });

  // Quiz Step 2 Selection (Timeline)
  document.querySelectorAll('#deckQuizStep2 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.timeline = card.dataset.value;
      updateDeckQuizStep(3);
    });
  });

  // Quiz Step 3 Selection (Existing Idea)
  document.querySelectorAll('#deckQuizStep3 .quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      deckUserAnswers.idea = card.dataset.value;
      updateDeckQuizStep(4);
    });
  });

  // Quiz Step 4 Final Form Submit
  const deckQuizFinalForm = document.getElementById('deckQuizFinalForm');
  if (deckQuizFinalForm) {
    deckQuizFinalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      deckUserAnswers.name = document.getElementById('deckQuizName').value;
      deckUserAnswers.phone = document.getElementById('deckQuizPhone').value;
      deckUserAnswers.email = document.getElementById('deckQuizEmail').value;
      deckUserAnswers.zip = document.getElementById('deckQuizZip').value;

      console.log('DM Home Improvement Deck & Ramp Lead Submitted:', deckUserAnswers);
      localStorage.setItem('dm_deck_quiz_submitted', 'true');

      updateDeckQuizStep(5);
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
