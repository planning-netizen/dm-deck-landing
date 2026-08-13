/**
 * DM Home Improvement LLC - Accessible Decks & Ramps Landing Page Script
 * Includes 5-Step Qualification Quiz Popup with 15-Minute Booking Calendar & Google Calendar Link
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
  // 2. Interactive Qualification & Booking Calendar Logic (5 Steps)
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
    zip: '',
    selectedDateObj: null,
    selectedTimeSlot: null
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

  // Step 4 Form Submit -> Proceeds to Step 5 (Calendar Booking)
  const deckQuizContactForm = document.getElementById('deckQuizContactForm');
  if (deckQuizContactForm) {
    deckQuizContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      deckUserAnswers.name = document.getElementById('deckQuizName').value;
      deckUserAnswers.phone = document.getElementById('deckQuizPhone').value;
      deckUserAnswers.email = document.getElementById('deckQuizEmail').value;
      deckUserAnswers.zip = document.getElementById('deckQuizZip').value;

      initBookingCalendar();
      updateDeckQuizStep(5);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Calendar & Time Slot Generator (Max 3 Days Availability, 9AM-6PM, 15-min slots + 15-min buffers)
  // --------------------------------------------------------------------------
  const calendarDateTabs = document.getElementById('calendarDateTabs');
  const calendarSlotsGrid = document.getElementById('calendarSlotsGrid');
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');

  // Available 15-minute slots with 15-min buffer intervals (9:00 AM to 6:00 PM)
  const availableSlotsList = [
    { label: '9:00 AM – 9:15 AM', startH: 9, startM: 0, endH: 9, endM: 15 },
    { label: '9:45 AM – 10:00 AM', startH: 9, startM: 45, endH: 10, endM: 0 },
    { label: '10:30 AM – 10:45 AM', startH: 10, startM: 30, endH: 10, endM: 45 },
    { label: '11:15 AM – 11:30 AM', startH: 11, startM: 15, endH: 11, endM: 30 },
    { label: '12:00 PM – 12:15 PM', startH: 12, startM: 0, endH: 12, endM: 15 },
    { label: '12:45 PM – 1:00 PM', startH: 12, startM: 45, endH: 13, endM: 0 },
    { label: '1:30 PM – 1:45 PM', startH: 13, startM: 30, endH: 13, endM: 45 },
    { label: '2:15 PM – 2:30 PM', startH: 14, startM: 15, endH: 14, endM: 30 },
    { label: '3:00 PM – 3:15 PM', startH: 15, startM: 0, endH: 15, endM: 15 },
    { label: '3:45 PM – 4:00 PM', startH: 15, startM: 45, endH: 16, endM: 0 },
    { label: '4:30 PM – 4:45 PM', startH: 16, startM: 30, endH: 16, endM: 45 },
    { label: '5:15 PM – 5:30 PM', startH: 17, startM: 15, endH: 17, endM: 30 }
  ];

  function getNext3Days() {
    const days = [];
    const now = new Date();

    for (let i = 0; i < 3; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      days.push({
        dateObj: d,
        tabLabel: `${dayName}, ${monthDay}`,
        fullDateStr: fullDateStr,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      });
    }

    return days;
  }

  function initBookingCalendar() {
    if (!calendarDateTabs || !calendarSlotsGrid) return;

    calendarDateTabs.innerHTML = '';
    calendarSlotsGrid.innerHTML = '';

    const days = getNext3Days();
    deckUserAnswers.selectedDateObj = days[0];

    days.forEach((day, index) => {
      const tabBtn = document.createElement('div');
      tabBtn.className = `date-tab ${index === 0 ? 'active' : ''}`;
      tabBtn.textContent = day.tabLabel;
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.date-tab').forEach(t => t.classList.remove('active'));
        tabBtn.classList.add('active');
        deckUserAnswers.selectedDateObj = day;
      });
      calendarDateTabs.appendChild(tabBtn);
    });

    // Render Slots
    deckUserAnswers.selectedTimeSlot = availableSlotsList[0];

    availableSlotsList.forEach((slot, index) => {
      const slotCard = document.createElement('div');
      slotCard.className = `time-slot-card ${index === 0 ? 'selected' : ''}`;
      slotCard.textContent = slot.label;
      slotCard.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-card').forEach(s => s.classList.remove('selected'));
        slotCard.classList.add('selected');
        deckUserAnswers.selectedTimeSlot = slot;
      });
      calendarSlotsGrid.appendChild(slotCard);
    });
  }

  // Handle Booking Confirmation
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');
  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      console.log('DM Home Improvement Lead & Appointment Submitted:', deckUserAnswers);
      localStorage.setItem('dm_deck_quiz_submitted', 'true');
      updateDeckQuizStep(6);
    });
  }

  const closeModalSuccessBtn = document.getElementById('closeModalSuccessBtn');
  if (closeModalSuccessBtn) {
    closeModalSuccessBtn.addEventListener('click', () => {
      closeDeckModal();
    });
  }

  // --------------------------------------------------------------------------
  // 4. Lead Capture Checklist Form Submission
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
  // 5. Render Project Details Modal
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
