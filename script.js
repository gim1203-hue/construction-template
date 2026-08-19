(() => {
  'use strict';

  document.querySelectorAll('[data-bg]').forEach(element => {
    element.style.backgroundImage = `url('${element.dataset.bg}')`;
  });

  const body = document.body;
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.header nav');
  const views = [...document.querySelectorAll('[data-view]')];
  const routeLinks = [...document.querySelectorAll('[data-route]')];
  const titles = {
    home: 'New Prime General Construction Corp.',
    'why-us': 'Why Us | New Prime General Construction',
    services: 'Services | New Prime General Construction',
    process: 'Process | New Prime General Construction',
    contact: 'Contact | New Prime General Construction'
  };

  function routeName() {
    const requested = location.hash.replace('#', '') || 'home';
    return views.some(view => view.dataset.view === requested) ? requested : 'home';
  }

  function showView({ scroll = true } = {}) {
    const route = routeName();
    views.forEach(view => {
      const active = view.dataset.view === route;
      view.hidden = !active;
      view.setAttribute('aria-hidden', String(!active));
    });
    routeLinks.forEach(link => {
      const active = link.dataset.route === route;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    body.classList.toggle('home-page', route === 'home');
    document.title = titles[route];
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  window.addEventListener('hashchange', () => showView());
  document.querySelectorAll('[data-scroll-target]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => document.getElementById(link.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' }), 0);
    });
  });

  document.querySelectorAll('.year').forEach(year => year.textContent = new Date().getFullYear());

  const modal = document.querySelector('.call-modal');
  const closeModal = modal.querySelector('.call-close');
  let previousFocus = null;
  function openCallPanel(event) {
    previousFocus = event.currentTarget;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    closeModal.focus();
  }
  function closeCallPanel() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    previousFocus?.focus();
  }
  document.querySelectorAll('.call-trigger').forEach(button => button.addEventListener('click', openCallPanel));
  closeModal.addEventListener('click', closeCallPanel);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeCallPanel();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeCallPanel();
  });

  const form = document.getElementById('estimate-form');
  if (form) {
    const buildRequest = () => {
      const data = new FormData(form);
      const services = data.getAll('services');
      return [
        'NEW PRIME GENERAL CONSTRUCTION CORP.',
        'OFFICIAL ESTIMATE REQUEST', '',
        'CLIENT & PROPERTY INFORMATION',
        `Full name: ${data.get('name')}`,
        `Company: ${data.get('company') || 'N/A'}`,
        `Phone: ${data.get('phone')}`,
        `Email: ${data.get('email')}`,
        `Project address: ${data.get('address')}`,
        `City / State / ZIP: ${data.get('city')}`, '',
        'SERVICES NEEDED',
        services.length ? services.map(service => `[x] ${service}`).join('\n') : 'None selected',
        `Other service: ${data.get('other_service') || 'N/A'}`, '',
        'PROJECT DETAILS',
        data.get('message'),
        `Preferred start date / timing: ${data.get('timing') || 'Not specified'}`,
        `Best contact time: ${data.get('contact_time') || 'Not specified'}`, '',
        'This is an estimate request, not a contract or final price quote.'
      ].join('\n');
    };
    const copyText = async text => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const area = document.createElement('textarea');
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
    };
    form.querySelector('.copy-estimate').addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      await copyText(buildRequest());
      const note = form.querySelector('.form-note');
      note.textContent = 'Copied! Paste the request into any email, text message or WhatsApp conversation.';
      note.classList.add('copied');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `Free Estimate Request - ${data.get('name')}`;
      location.href = `mailto:newprimeconstruction@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildRequest())}`;
    });
  }

  function startCarousel(selector, itemSelector, hold = 2000, transition = 700) {
    const groups = [...document.querySelectorAll(selector)].map(group => [...group.querySelectorAll(itemSelector)]).filter(group => group.length > 1);
    if (!groups.length) return;
    let index = 0;
    const max = Math.max(...groups.map(group => group.length));
    const advance = () => {
      const nextIndex = (index + 1) % max;
      groups.forEach(group => {
        const oldItem = group[index % group.length];
        const nextItem = group[nextIndex % group.length];
        nextItem.className = `${itemSelector.slice(1)} prepare-right`;
        void nextItem.offsetWidth;
        nextItem.className = `${itemSelector.slice(1)} active`;
        oldItem.className = `${itemSelector.slice(1)} exit-left`;
      });
      setTimeout(() => {
        groups.forEach(group => group[index % group.length].className = `${itemSelector.slice(1)} prepare-right`);
        index = nextIndex;
        setTimeout(advance, hold);
      }, transition);
    };
    setTimeout(advance, hold);
  }

  startCarousel('.hero-carousel', '.hero-slide');
  startCarousel('.service-card-carousel', '.service-photo');
  showView({ scroll: false });
})();
