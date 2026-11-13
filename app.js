const CONFIG = {
  formspreeEndpoint: ''
};

const portfolioData = {
  projects: [
    {
      name: 'Budget Buddy',
      description: 'Project named in Ella’s portfolio. Add a verified description, technologies, and links here.',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      theme: 'project-orange',
      symbol: '↗'
    },
    {
      name: 'Sparkgen',
      description: 'Project named in Ella’s portfolio. Add a verified description, technologies, and links here.',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      theme: 'project-green',
      symbol: '✳'
    },
    {
      name: 'Launchpad Youth Opportunity Portal',
      description: 'Project listed in the portfolio. Add a verified description, technologies, and links here.',
      technologies: [],
      githubUrl: '',
      demoUrl: '',
      theme: 'project-paper',
      symbol: '◎'
    }
  ],
  skillGroups: [
    {
      category: 'Development',
      skills: ['HTML', 'CSS', 'JavaScript fundamentals'],
      featuredTag: 'HTML / CSS / JavaScript',
      question: 'What are Ella’s HTML, CSS, and JavaScript skills?'
    },
    {
      category: 'Tools',
      skills: ['Git', 'GitHub'],
      featuredTag: 'Git & GitHub',
      question: 'What are Ella’s Git and GitHub skills?'
    },
    {
      category: 'AI',
      skills: ['AI tools', 'Prompt engineering'],
      featuredTag: 'AI tools & prompt engineering',
      question: 'What AI tools and prompt engineering does Ella know?'
    },
    {
      category: 'Collaboration',
      skills: ['Communication', 'Teamwork and collaboration', 'Problem-solving', 'Willingness to learn']
    }
  ],
  certificates: [
    {
      title: 'CAPACITI AI Skills Acceleration Programme',
      kind: 'Certificate / achievement',
      category: 'ai',
      categoryLabel: 'AI',
      provider: 'CAPACITI',
      year: '2026',
      duration: '1 week',
      description: 'Completed a one-week AI Skills Acceleration Programme focused on developing practical AI skills.',
      pdf: ''
    },
  ]
};

const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

const themeToggle = document.querySelector('#theme-toggle');
try {
  const darkModeEnabled = localStorage.getItem('ella-portfolio-theme') === 'dark';
  document.body.classList.toggle('dark-mode', darkModeEnabled);
  themeToggle.setAttribute('aria-pressed', String(darkModeEnabled));
  themeToggle.querySelector('.toggle-label').textContent = darkModeEnabled ? 'Light mode' : 'Dark mode';
  themeToggle.title = darkModeEnabled ? 'Enable light mode' : 'Enable dark mode';
} catch {
  themeToggle.setAttribute('aria-pressed', 'false');
}
themeToggle.addEventListener('click', (event) => {
  const enabled = document.body.classList.toggle('dark-mode');
  event.currentTarget.setAttribute('aria-pressed', String(enabled));
  event.currentTarget.querySelector('.toggle-label').textContent = enabled ? 'Light mode' : 'Dark mode';
  event.currentTarget.title = enabled ? 'Enable light mode' : 'Enable dark mode';
  try {
    localStorage.setItem('ella-portfolio-theme', enabled ? 'dark' : 'light');
  } catch {
    // Theme still works for the current page if storage is unavailable.
  }
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const number = entry.target;
    const target = Number(number.dataset.count);
    const started = performance.now();
    const duration = 850;
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      number.textContent = String(Math.floor(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(number);
  });
}, { threshold: 0.55 });
document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

const timelineEntries = [...document.querySelectorAll('.timeline-entry')];
const timelineProgress = document.querySelector('.timeline-progress');
function setTimelineActive(activeEntry) {
  const activeIndex = timelineEntries.indexOf(activeEntry);
  timelineEntries.forEach((entry, index) => entry.classList.toggle('is-active', index <= activeIndex));
  const progress = timelineEntries.length > 1 ? activeIndex / (timelineEntries.length - 1) : 1;
  if (window.matchMedia('(max-width: 540px)').matches) {
    timelineProgress.style.height = `${progress * 100}%`;
  } else {
    timelineProgress.style.width = `${progress * 100}%`;
  }
}
const timelineObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setTimelineActive(visible.target);
}, { threshold: [0.25, 0.6] });
timelineEntries.forEach((entry) => {
  timelineObserver.observe(entry);
  entry.querySelector('.timeline-node').addEventListener('click', () => {
    entry.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimelineActive(entry);
  });
});
window.addEventListener('resize', () => {
  const active = [...timelineEntries].reverse().find((entry) => entry.classList.contains('is-active'));
  if (active) setTimelineActive(active);
});

const phaseTabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, moveFocus = false) {
  phaseTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (moveFocus) tab.focus();
}
phaseTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % phaseTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + phaseTabs.length) % phaseTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = phaseTabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      activateTab(phaseTabs[nextIndex], true);
    }
  });
});

const certificateGrid = document.querySelector('#certificate-grid');
function renderProjects() {
  const projectGrid = document.querySelector('#project-grid');
  projectGrid.replaceChildren();
  if (!portfolioData.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No projects have been added yet.';
    projectGrid.append(empty);
    return;
  }
  portfolioData.projects.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = `project-card ${project.theme || 'project-paper'}`;
    const top = document.createElement('div');
    top.className = 'project-top';
    const number = document.createElement('span');
    number.className = 'project-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const symbol = document.createElement('span');
    symbol.className = 'project-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = project.symbol || '↗';
    top.append(number, symbol);
    const type = document.createElement('p');
    type.className = 'project-type';
    type.textContent = 'PROJECT';
    const title = document.createElement('h3');
    title.textContent = project.name;
    const description = document.createElement('p');
    description.textContent = project.description;
    card.append(top, type, title, description);
    if (project.technologies?.length) {
      const technologies = document.createElement('p');
      technologies.className = 'project-technologies';
      technologies.textContent = `Technologies: ${project.technologies.join(', ')}`;
      card.append(technologies);
    }
    const actions = document.createElement('div');
    actions.className = 'project-actions';
    [
      { url: project.demoUrl, label: 'Live demo' },
      { url: project.githubUrl, label: 'GitHub code' }
    ].forEach((action) => {
      if (!action.url) return;
      const link = document.createElement('a');
      link.href = action.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = action.label;
      actions.append(link);
    });
    if (actions.childElementCount) card.append(actions);
    projectGrid.append(card);
  });
}

function renderSkills() {
  const skillGroupsElement = document.querySelector('#skill-groups');
  const featuredSkills = document.querySelector('#featured-skills');
  skillGroupsElement.replaceChildren();
  featuredSkills.replaceChildren();
  portfolioData.skillGroups.forEach((group) => {
    const section = document.createElement('article');
    section.className = 'skill-group';
    const heading = document.createElement('h3');
    heading.textContent = group.category;
    const list = document.createElement('ul');
    list.className = 'skill-pills';
    group.skills.forEach((skill) => {
      const item = document.createElement('li');
      item.textContent = skill;
      list.append(item);
    });
    section.append(heading, list);
    skillGroupsElement.append(section);
    if (group.featuredTag) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.skillQuestion = group.question;
      button.textContent = group.featuredTag;
      item.append(button);
      featuredSkills.append(item);
    }
  });
}

function renderCertificates() {
  const visible = portfolioData.certificates;
  certificateGrid.replaceChildren();
  if (visible.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = portfolioData.certificates.length ? 'No learning items in this category yet.' : 'Add a certificate or learning record in app.js to display it here.';
    certificateGrid.append(empty);
    return;
  }
  visible.forEach((certificate) => {
    const card = document.createElement('article');
    card.className = 'certificate-card';
    const category = document.createElement('p');
    category.className = 'project-type';
    category.textContent = `${certificate.kind} · ${certificate.categoryLabel}`;
    const title = document.createElement('h3');
    title.textContent = certificate.title;
    card.append(category, title);
    const metadata = [certificate.provider, certificate.year, certificate.duration].filter(Boolean).join(' · ');
    if (metadata) {
      const details = document.createElement('p');
      details.textContent = metadata;
      card.append(details);
    }
    if (certificate.description) {
      const description = document.createElement('p');
      description.textContent = certificate.description;
      card.append(description);
    }
    if (certificate.pdf) {
      const preview = document.createElement('button');
      preview.type = 'button';
      preview.textContent = 'Preview PDF';
      preview.dataset.pdf = certificate.pdf;
      card.append(preview);
    }
    certificateGrid.append(card);
  });
}
renderProjects();
renderSkills();
renderCertificates();

const pdfModal = document.querySelector('#pdf-modal');
const pdfFrame = document.querySelector('#pdf-frame');
certificateGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-pdf]');
  if (!button) return;
  pdfFrame.src = button.dataset.pdf;
  pdfModal.showModal();
});
function closePdfModal() {
  pdfModal.close();
  pdfFrame.removeAttribute('src');
}
document.querySelector('.modal-close').addEventListener('click', closePdfModal);
pdfModal.addEventListener('click', (event) => {
  if (event.target === pdfModal) closePdfModal();
});
pdfModal.addEventListener('close', () => pdfFrame.removeAttribute('src'));

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const formButton = form.querySelector('button[type="submit"]');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  if (form.elements._gotcha.value) {
    form.reset();
    formStatus.textContent = 'Thanks. Your message could not be processed.';
    return;
  }
  if (!form.reportValidity()) {
      formFields.forEach((field) => {
        field.dataset.touched = 'true';
        updateFieldFeedback(field);
      });
      return;
    }
  if (!CONFIG.formspreeEndpoint) {
    formStatus.textContent = 'This form is not connected yet. Configure a Formspree endpoint or email Ella directly.';
    formStatus.classList.add('is-error');
    return;
  }
  formButton.disabled = true;
  formButton.firstChild.textContent = 'Sending… ';
  formStatus.textContent = 'Sending your message…';
  try {
    const response = await fetch(CONFIG.formspreeEndpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('The message could not be sent.');
    form.reset();
    formStatus.textContent = 'Message sent. Thanks for getting in touch!';
    formStatus.classList.add('is-success');
  } catch {
    formStatus.textContent = 'Something went wrong. Please try again later or use an enabled contact channel.';
    formStatus.classList.add('is-error');
  } finally {
    formButton.disabled = false;
    formButton.firstChild.textContent = 'Send a message ';
  }
});
const formFields = [...form.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), textarea')];
function updateFieldFeedback(field) {
  const invalid = !field.checkValidity();
  field.setAttribute('aria-invalid', String(invalid));
  document.querySelector(`#${field.id}-feedback`).textContent = invalid ? field.validationMessage : '';
}
formFields.forEach((field) => {
  field.addEventListener('blur', () => {
    field.dataset.touched = 'true';
    updateFieldFeedback(field);
  });
  field.addEventListener('input', () => {
    if (field.dataset.touched) updateFieldFeedback(field);
  });
});

const widget = document.querySelector('#cutie-widget');
const launcher = document.querySelector('#cutie-launcher');
const chat = document.querySelector('#cutie-chat');
const chatMessages = document.querySelector('#chat-messages');
let openedOnce = false;
function setCutieState(state) {
  widget.dataset.state = state;
  if (state === 'happy') setTimeout(() => {
    if (widget.dataset.state === 'happy') widget.dataset.state = chat.hidden ? 'dismissed' : 'helping';
  }, 600);
}
function openCutie() {
  chat.hidden = false;
  launcher.setAttribute('aria-expanded', 'true');
  setCutieState('helping');
  updateCutieObstruction();
  if (!openedOnce) openedOnce = true;
}
function closeCutie() {
  chat.hidden = true;
  launcher.setAttribute('aria-expanded', 'false');
  setCutieState('dismissed');
  updateCutieObstruction();
}
launcher.addEventListener('click', () => {
  if (chat.hidden) openCutie();
  else closeCutie();
  setCutieState('happy');
  if (!chat.hidden) window.setTimeout(() => document.querySelector('#chat-question').focus(), 100);
});
document.querySelector('#chat-close').addEventListener('click', closeCutie);
function appendChatMessage(text, sender) {
  const message = document.createElement('p');
  message.className = `chat-bubble ${sender}-message`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function replyFor(question) {
  const value = question.toLowerCase();
  if (/project|work|portfolio|buddy|sparkgen/.test(value)) {
    document.querySelector('#work').scrollIntoView({ behavior: 'smooth' });
    return 'Ella’s listed projects are Budget Buddy, Sparkgen, and Launchpad Youth Opportunity Portal. Project details and links are being added as they become available.';
  }
  if (/skill|tech|html|css|javascript|git|ai/.test(value)) {
    return 'Ella is practising HTML, CSS, JavaScript fundamentals, Git and GitHub, plus AI tools and prompt engineering. She also values teamwork, communication, and problem-solving.';
  }
  if (/contact|email|reach|message/.test(value)) {
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    return 'You can email Ella at ellampu710@gmail.com, open her LinkedIn profile, or visit her GitHub profile from the contact section.';
  }
  if (/cv|resume|résumé|download/.test(value)) {
    return 'A CV file has not been added yet. Once Ella’s CV is available, a download link will appear here.';
  }
  if (/capaciti|trainee|journey|learn|education/.test(value)) {
    document.querySelector('#journey').scrollIntoView({ behavior: 'smooth' });
    return 'Ella completed Grade 12 at Mfuleni Technical Academy in 2025 and is a CAPACITI Digital Associate Web Development Trainee in 2026.';
  }
  return 'I can point you to Ella’s projects, skills, learning journey, or contact section. Try asking about one of those!';
}
function askCutie(question) {
  if (!question.trim()) return;
  appendChatMessage(question.trim(), 'user');
  window.setTimeout(() => appendChatMessage(replyFor(question), 'cutie'), 180);
}
document.querySelectorAll('[data-skill-question]').forEach((button) => {
  button.addEventListener('click', () => {
    if (chat.hidden) openCutie();
    askCutie(button.dataset.skillQuestion);
    setCutieState('helping');
  });
});
document.querySelector('#quick-replies').addEventListener('click', (event) => {
  const button = event.target.closest('[data-question]');
  if (!button) return;
  const prompts = {
    projects: 'Show me her best projects',
    skills: 'What are her top skills?',
    contact: 'How do I contact her?',
    cv: 'Download her CV'
  };
  askCutie(prompts[button.dataset.question]);
  setCutieState('helping');
});
document.querySelector('#chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chat-question');
  askCutie(input.value);
  input.value = '';
  setCutieState('helping');
});
let chaseFrame = 0;
let chaseReturnState = 'idle';
window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' || !chat.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = launcher.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
  if (distance > 150) {
    if (widget.dataset.state === 'chase') widget.dataset.state = chaseReturnState;
    return;
  }
  if (widget.dataset.state !== 'chase') chaseReturnState = widget.dataset.state === 'dismissed' ? 'dismissed' : 'idle';
  cancelAnimationFrame(chaseFrame);
  chaseFrame = requestAnimationFrame(() => {
    const dx = Math.max(-13, Math.min(13, (event.clientX - centerX) * .12));
    const dy = Math.max(-13, Math.min(13, (event.clientY - centerY) * .12));
    widget.style.transform = `translate(${dx}px, ${dy}px)`;
    widget.dataset.state = 'chase';
  });
});
document.addEventListener('pointerleave', () => {
  widget.style.transform = '';
  if (widget.dataset.state === 'chase') widget.dataset.state = chaseReturnState;
});
document.querySelectorAll('a[href="#work"], a[href="#journey"], a[href="#about"]').forEach((link) => {
  link.addEventListener('click', () => {
    if (chat.hidden) openCutie();
    setCutieState('helping');
  });
});

const importantCtas = [...document.querySelectorAll('.hero-actions .button, .form-submit')];
function updateCutieObstruction() {
  const widgetRect = widget.getBoundingClientRect();
  const overlaps = chat.hidden && importantCtas.some((button) => {
    const rect = button.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.left < widgetRect.right && rect.right > widgetRect.left && rect.top < widgetRect.bottom && rect.bottom > widgetRect.top;
  });
  widget.classList.toggle('is-occluding-cta', overlaps);
}
window.addEventListener('scroll', updateCutieObstruction, { passive: true });
window.addEventListener('resize', updateCutieObstruction);
updateCutieObstruction();