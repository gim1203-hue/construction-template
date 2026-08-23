(() => {
  'use strict';

  document.querySelectorAll('[data-bg]').forEach(element => {
    element.style.backgroundImage = `url('${element.dataset.bg}')`;
  });

  const body = document.body;
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.setAttribute('title', 'Back to top');
  backToTop.innerHTML = '<span aria-hidden="true">↑</span><small>TOP</small>';
  document.body.appendChild(backToTop);
  const updateBackToTop = () => backToTop.classList.toggle('visible', window.scrollY > 420);
  backToTop.addEventListener('click', () => {
    document.querySelector('.topbar').scrollIntoView({behavior:'auto',block:'start'});
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    backToTop.classList.remove('visible');
  });
  window.addEventListener('scroll', updateBackToTop, {passive:true});
  updateBackToTop();
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.header nav');
  const requirementsView = document.createElement('div');
  requirementsView.className = 'site-view';
  requirementsView.id = 'requirements';
  requirementsView.dataset.view = 'requirements';
  document.getElementById('main-content').appendChild(requirementsView);
  const requirementsLink = document.createElement('a');
  requirementsLink.href = '#requirements';
  requirementsLink.dataset.route = 'requirements';
  requirementsLink.textContent = 'Requirements';
  nav.insertBefore(requirementsLink, nav.querySelector('.nav-cta'));
  const views = [...document.querySelectorAll('[data-view]')];
  const routeLinks = [...document.querySelectorAll('[data-route]')];
  const titles = {
    home: 'New Prime General Construction Corp.',
    'why-us': 'Why Us | New Prime General Construction',
    services: 'Services | New Prime General Construction',
    projects: 'Projects | New Prime General Construction',
    process: 'Process | New Prime General Construction',
    contact: 'Contact | New Prime General Construction',
    requirements: 'Requirements | New Prime General Construction'
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

    const photoInput = document.getElementById('project-photos');
    const photoPreview = document.getElementById('photo-preview');
    photoInput?.addEventListener('change', () => {
      photoPreview.replaceChildren();
      [...photoInput.files].slice(0, 6).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const caption = document.createElement('figcaption');
        image.src = URL.createObjectURL(file);
        image.alt = `Selected project photograph: ${file.name}`;
        image.addEventListener('load', () => URL.revokeObjectURL(image.src), { once: true });
        caption.textContent = file.name;
        figure.append(image, caption);
        photoPreview.append(figure);
      });
    });

    const estimatePreview = document.getElementById('estimate-document-preview');
    const estimatePreviewText = estimatePreview?.querySelector('pre');
    form.querySelector('.estimate-preview-trigger')?.addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const services = data.getAll('services');
      estimatePreviewText.textContent = [
        'NEW PRIME GENERAL CONSTRUCTION CORP.',
        'WRITTEN ESTIMATE — APPROVAL PREVIEW',
        '',
        'Estimate no.: To be assigned',
        `Prepared for: ${data.get('name')}`,
        `Project address: ${data.get('address')}, ${data.get('city')}`,
        `Property type: ${data.get('property_type') || 'Not specified'}`,
        `Preferred contact: ${data.get('contact_method') || 'Not specified'}`,
        '',
        'REQUESTED SERVICES',
        services.length ? services.map(item => `• ${item}`).join('\n') : 'To be confirmed during inspection',
        '',
        'CUSTOMER PROJECT DESCRIPTION',
        data.get('message'),
        '',
        'CONTRACTOR TO COMPLETE AFTER INSPECTION',
        '1. Detailed scope of work',
        '2. Materials, manufacturers and specifications',
        '3. Labor, materials, allowances and total price',
        '4. Estimated start and substantial completion dates',
        '5. Permit responsibility and estimated fees',
        '6. Payment stages tied to work progress',
        '7. Exclusions, contingencies and warranties',
        '8. Estimate expiration date',
        '',
        'This preview is not a contract or final price quote.'
      ].join('\n');
      estimatePreview.hidden = false;
      estimatePreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    estimatePreview?.querySelector('.estimate-preview-close')?.addEventListener('click', () => {
      estimatePreview.hidden = true;
    });
  }

  const areaList = document.querySelector('.area-list');
  if (areaList && !document.querySelector('.service-map')) {
    areaList.insertAdjacentHTML('afterend', `
      <div class="service-map">
        <iframe title="Map of New Prime service areas in New York City and Westchester County" src="https://www.google.com/maps?q=New%20York%20City%20and%20Westchester%20County%20New%20York&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=New+York+City+and+Westchester+County+New+York" target="_blank" rel="noopener">Open a larger service-area map →</a>
      </div>`);
  }

  if (areaList) {
    const serviceMapFrame = document.querySelector('.service-map iframe');
    const serviceMapLink = document.querySelector('.service-map a');
    const areaTabs = [...areaList.querySelectorAll('span')];
    const showAreaOnMap = areaTab => {
      const locationName = areaTab.textContent.trim();
      const mapQuery = `${locationName}, New York`;
      areaTabs.forEach(tab => {
        const selected = tab === areaTab;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-pressed', String(selected));
      });
      if (serviceMapFrame) {
        serviceMapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
        serviceMapFrame.title = `Map of ${locationName}`;
      }
      if (serviceMapLink) {
        serviceMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
        serviceMapLink.textContent = `Open ${locationName} in a larger map →`;
      }
    };
    areaTabs.forEach(tab => {
      tab.setAttribute('role', 'button');
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('aria-pressed', 'false');
      tab.addEventListener('click', () => showAreaOnMap(tab));
      tab.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showAreaOnMap(tab);
        }
      });
    });
  }

  document.querySelectorAll('[data-footer-area]').forEach(link => {
    link.addEventListener('click', () => {
      const requestedArea = link.dataset.footerArea;
      setTimeout(() => {
        const matchingAreaTab = [...document.querySelectorAll('.area-list span')]
          .find(tab => tab.textContent.trim() === requestedArea);
        matchingAreaTab?.click();
        document.querySelector('.service-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    });
  });

  const faqList = document.querySelector('.faq-list');
  if (faqList && !faqList.querySelector('[data-expanded-faq]')) {
    faqList.insertAdjacentHTML('beforeend', `
      <details data-expanded-faq><summary>Which areas do you serve?</summary><p>New Prime serves the five boroughs of New York City, Yonkers and Westchester County. Call the office to confirm availability for your exact address.</p></details>
      <details><summary>Are you fully insured?</summary><p>The company represents that it is fully insured. Customers should request a current certificate of insurance for their project and verify any required coverage before work begins.</p></details>
      <details><summary>What services do you provide?</summary><p>Services include roofing, waterproofing, masonry, concrete, siding, gutters, decks, carpentry, painting, plaster, flooring, tile, kitchen remodeling and bathroom remodeling.</p></details>
      <details><summary>How should I prepare for an inspection?</summary><p>Provide safe access to the work area, describe any leaks or damage, gather previous repair information and share clear photographs when available.</p></details>
      <details><summary>Who selects the materials?</summary><p>Material brands, colors, finishes, quantities and allowances should be reviewed with the customer and written into the estimate or contract before installation.</p></details>
      <details><summary>How are additional changes handled?</summary><p>Any change to the agreed scope, price or schedule should be described in a written change order and approved by both parties before the additional work proceeds.</p></details>
      <details><summary>Is cleanup included?</summary><p>The contract should state the daily protection, debris removal and final cleanup responsibilities for the specific project.</p></details>
      <details><summary>Do you provide warranties?</summary><p>Applicable workmanship and manufacturer warranty details should be listed in the written agreement, including coverage, duration and exclusions.</p></details>`);
  }

  const reviewGrid = document.querySelector('.review-grid');
  if (reviewGrid) {
    reviewGrid.innerHTML = `
      <article>
        <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
        <h3>Imran K. · Concrete foundation</h3>
        <p>“He is an amazing worker. He is good and I'm happy.”</p>
        <small>HomeAdvisor review · October 2020 · Recommends this professional</small>
      </article>
      <article>
        <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
        <h3>Muhammad R. · Concrete driveway &amp; floor</h3>
        <p>This reviewer gave five stars and recommended the professional but did not provide written comments.</p>
        <small>HomeAdvisor rating · October 2020</small>
      </article>
      <article class="review-summary-card">
        <div class="review-score">5.0</div>
        <h3>HomeAdvisor profile rating</h3>
        <p>Two published ratings were shown on the matched New Prime General Construction Corp. profile when checked.</p>
        <small>Source checked August 20, 2026</small>
      </article>`;
  }

  const credentialSection = document.querySelector('.credential-section');
  const whyUsFeature = document.querySelector('#why-us .feature');
  if (credentialSection && whyUsFeature) {
    whyUsFeature.before(credentialSection);
  }

  if (requirementsView && !document.querySelector('.regulatory-guide')) {
    requirementsView.insertAdjacentHTML('beforeend', `
    <section class="page-hero hero-requirements"><div class="wrap"><p class="kicker">Permits, codes and responsible construction</p><h1>Construction requirements.</h1><p>Essential permit, code, safety and approval guidance for New York projects.</p></div></section>
    <section class="regulatory-guide" aria-labelledby="regulatory-title"><div class="wrap">
      <header class="regulatory-heading"><p class="kicker">Permits, codes and responsible construction</p><h2 id="regulatory-title">Know the requirements before work begins.</h2><p>This guide summarizes common requirements for New York City, New York State, Westchester County and Yonkers. Requirements depend on the property, occupancy, zoning, landmark or flood status and exact scope. This is educational information—not legal advice or a permit determination. Confirm current requirements with the authority having jurisdiction and licensed project professionals.</p></header>
      <div class="regulatory-alert"><strong>Never start permit-required work early.</strong><span>Approvals, permits and required licenses must be active first. Keep approved plans on site, follow them, and obtain approval for material field changes.</span></div>
      <div class="jurisdiction-grid">
        <article><span class="rule-number">01</span><h3>New York City: all five boroughs</h3><p>Manhattan, Brooklyn, Queens, the Bronx and Staten Island use the same NYC Construction Codes and DOB process. Property conditions—not the borough name—create most differences.</p><ul><li>Review legal use, violations, active permits and prior approvals.</li><li>Check zoning, yards, special districts, flood zones and landmarks.</li><li>Identify HPD, DEP, FDNY, DOT, Parks and utility approvals.</li><li>Use required NYC-licensed contractors and registered design professionals.</li></ul><a href="https://www.nyc.gov/site/buildings/property-or-business-owner/working-on-your-project.page" target="_blank" rel="noopener">Official NYC process →</a></article>
        <article><span class="rule-number">02</span><h3>New York State</h3><p>Outside NYC, the 2025 State Uniform Code and Energy Code set minimum requirements. Local governments administer permits and may enforce approved stricter standards.</p><ul><li>Confirm building, residential, existing-building, fire and energy provisions.</li><li>Apply plumbing, mechanical and fuel-gas codes where relevant.</li><li>Use a NYS architect or engineer when sealed plans are required.</li><li>Complete local progress and final inspections.</li></ul><a href="https://dos.ny.gov/uniform-fire-prevention-and-building-code" target="_blank" rel="noopener">Official NYS code →</a></article>
        <article><span class="rule-number">03</span><h3>Westchester County</h3><p>Building permits are usually issued by the city, town or village. The County separately regulates home-improvement and certain trade licenses and specified health approvals.</p><ul><li>Verify the County home-improvement license.</li><li>Use properly licensed electricians and plumbers.</li><li>Obtain municipal zoning and building approval for the address.</li><li>County Health review may apply to wells, septic, water or sewer work.</li></ul><a href="https://consumerlicenseweb.westchestercountyny.gov/ConsumerLicenseWeb/" target="_blank" rel="noopener">County license search →</a></article>
        <article><span class="rule-number">04</span><h3>City of Yonkers</h3><p>Yonkers Housing and Buildings issues permits and certificates, conducts inspections and enforces construction and housing requirements.</p><ul><li>File applicable building and trade applications online.</li><li>A Yonkers HIC license is required before renovating an existing one-to-three-family dwelling.</li><li>Provide plans, surveys and architect or engineer documents when required.</li><li>Street openings, sidewalk occupation, equipment or dumpsters may need Engineering permits.</li><li>Complete inspections and obtain the required certificate or sign-off.</li></ul><a href="https://www.yonkersny.gov/229/Forms-Permits" target="_blank" rel="noopener">Yonkers permits →</a></article>
      </div>
      <section class="permit-section"><div class="regulatory-subhead"><p class="kicker">Common permit decisions</p><h2>Work type determines the filing.</h2><p>Screening examples only—confirm every scope with DOB or the local building department.</p></div><div class="permit-grid">
        <article><h3>Building approval commonly required</h3><ul><li>New buildings, additions and enlargements</li><li>Beams, columns, bearing walls and structural framing</li><li>Foundations, underpinning and major excavation</li><li>Decks, porches, retaining walls and exterior structures</li><li>Changes to use, occupancy, exits or apartment count</li><li>Major alterations, façade work and demolition</li></ul></article>
        <article><h3>Separate trade permits may apply</h3><ul><li>Electrical service, panels, circuits and wiring</li><li>Plumbing, gas, water, waste and vent systems</li><li>Boilers, heating, ventilation and air-conditioning</li><li>Sprinklers, standpipes, suppression and alarms</li><li>Elevators and regulated equipment</li><li>Fuel equipment and chimney connections</li></ul></article>
        <article><h3>Minor work may be exempt</h3><ul><li>Painting and ordinary decorating</li><li>Plastering and limited finish repair</li><li>Cabinets without regulated system changes</li><li>Floor resurfacing and certain finish flooring</li><li>Limited nonstructural roof repair</li><li>Qualifying ordinary plumbing repair by the proper licensee</li></ul><p>Exempt work still must comply with code, zoning, housing, environmental, licensing and safety rules.</p></article>
        <article><h3>Other permissions to investigate</h3><ul><li>Landmarks approval</li><li>DOT street, sidewalk and container permits</li><li>DEP asbestos, sewer and water filings</li><li>FDNY fire or fuel approvals</li><li>HPD occupied-building requirements</li><li>Health approval for wells or septic</li><li>Utility authorization and shutdowns</li></ul></article>
      </div><a class="official-button" href="https://www.nyc.gov/site/buildings/property-or-business-owner/do-i-need-a-permit.page" target="_blank" rel="noopener">Official NYC permit guidance</a></section>
      <section class="procedure-section"><p class="kicker">Required project discipline</p><h2>From research to final sign-off.</h2><ol class="procedure-list">
        <li><b>Research the property.</b><span>Confirm ownership, block and lot, legal use, occupancy, zoning, landmarks, flood conditions, violations and prior approvals.</span></li>
        <li><b>Define a written scope.</b><span>Document demolition, structure, architecture, plumbing, electrical, mechanical, fire protection and finishes.</span></li>
        <li><b>Assign qualified professionals.</b><span>Retain required architects, engineers, licensed contractors, trade licensees and inspection agencies.</span></li>
        <li><b>Complete investigations.</b><span>Address asbestos, lead, utilities, soil, groundwater, tenant protection and adjoining-property protection.</span></li>
        <li><b>File coordinated applications.</b><span>Submit drawings, forms, energy information, owner authorization and supporting approvals.</span></li>
        <li><b>Resolve objections.</b><span>Answer plan-exam comments and secure zoning, landmark, environmental, fire, health or transportation approvals.</span></li>
        <li><b>Pull and post permits.</b><span>Provide insurance, post permits and notices, and keep approved plans at the site.</span></li>
        <li><b>Protect people and property.</b><span>Install barriers, dust control, egress protection, fire measures, sidewalk protection and neighbor safeguards.</span></li>
        <li><b>Build only approved work.</b><span>Follow approved documents and stop for approval when a material change is necessary.</span></li>
        <li><b>Inspect before concealment.</b><span>Arrange progress, special and trade inspections before walls or work are covered.</span></li>
        <li><b>Close the project.</b><span>Resolve objections, submit reports or as-builts and obtain sign-off, a Letter of Completion or required certificate.</span></li>
      </ol></section>
      <section class="safety-section"><p class="kicker">How work should be performed</p><h2>Safe, lawful and documented.</h2><div class="safety-grid">
        <article><h3>Occupied buildings</h3><p>Maintain exits, fire protection, essential services and safe access. Tenant Protection Plans and notices may be required. Never block required egress.</p></article>
        <article><h3>Lead-safe renovation</h3><p>Pre-1978 housing may trigger federal rules; NYC adds requirements, especially for pre-1960 housing and homes with young children. Use certified firms, control dust, complete required clearance and retain records.</p><a href="https://www.nyc.gov/site/hpd/services-and-information/safe-work-practices.page" target="_blank" rel="noopener">HPD lead guidance →</a></article>
        <article><h3>Asbestos</h3><p>NYC renovation or demolition may require investigation before permit issuance. DEP notification, licensed abatement, independent monitoring and completion records may apply.</p><a href="https://www.nyc.gov/site/buildings/property-or-business-owner/asbestos-abatement-permit.page" target="_blank" rel="noopener">NYC asbestos process →</a></article>
        <article><h3>Excavation and structural stability</h3><p>Locate utilities, evaluate soil and groundwater, protect adjoining structures, follow designed shoring or underpinning and arrange required monitoring.</p></article>
        <article><h3>Fire and building systems</h3><p>Use properly licensed trades. Maintain fire separations, safe temporary power, tested piping and required alarms. Inspect before concealment.</p></article>
        <article><h3>Public and site safety</h3><p>Provide fencing, guardrails, fall protection, housekeeping, debris control, sidewalk protection and trained supervision. Unsafe or unpermitted work can trigger Stop Work Orders.</p></article>
      </div></section>
      <section class="borough-section"><p class="kicker">Borough-by-borough screening</p><h2>One NYC system—different site conditions.</h2><div class="borough-grid">
        <article><h3>Manhattan</h3><p>Landmarks, dense-site logistics, sidewalk protection, occupied buildings, party walls and street-use restrictions.</p></article><article><h3>Brooklyn</h3><p>Landmarks, row-house party walls, rear-yard zoning, cellar use, decks, extensions and waterfront flooding.</p></article><article><h3>Queens</h3><p>Legal occupancy, yards, curb cuts, garages, additions, flood zones and airport-related conditions.</p></article><article><h3>The Bronx</h3><p>Legal use, violations, attached buildings, retaining walls, irregular sites, sidewalks and flood status.</p></article><article><h3>Staten Island</h3><p>Flood and coastal rules, grading, drainage, natural areas, retaining walls and lower-density zoning.</p></article>
      </div></section>
      <section class="verification-box"><h2>Before committing to a start date</h2><div><span>□ Written scope and exclusions</span><span>□ Property and violation research</span><span>□ Permit determination</span><span>□ Design-professional determination</span><span>□ Licenses and insurance verified</span><span>□ Agency approvals identified</span><span>□ Tenant and neighbor protections planned</span><span>□ Inspections assigned</span><span>□ Close-out responsibility documented</span></div><p><strong>Final authority:</strong> Government agencies and licensed design professionals determine the actual filing, permit, inspection and technical requirements. Always verify current rules before work begins.</p></section>
    </div></section>`);
  }

  const servicesHeroHeading = document.querySelector('.hero-services h1');
  const servicesHeroDescription = document.querySelector('.hero-services .wrap > p:last-child');
  if (servicesHeroHeading) servicesHeroHeading.textContent = 'Complete construction—from foundation to final finish.';
  if (servicesHeroDescription) servicesHeroDescription.textContent = 'Organized residential, commercial, interior and exterior solutions for repairs, improvements and complete transformations.';

  const completeServiceGrid = document.querySelector('#services .service-grid');
  if (completeServiceGrid) {
    const serviceCatalog = [
      {
        number:'01', title:'Foundation & Structural', description:'Core work that supports, stabilizes and strengthens the property.',
        board:'assets/service-pictures/foundation-structural-board.png', picturePrefix:'foundation', boardColumns:6, boardRows:3,
        groups:[['Foundation',['Site excavation','Footings','Foundation walls','Concrete slabs','Foundation crack repair','Underpinning','Waterproofing','Drainage systems','Sump-pump preparation','Crawl-space repair']],['Structural',['Wood framing','Steel framing','Load-bearing wall work','Beams and columns','Lintel replacement','Joist repair','Structural masonry repair','Stair structure repair']]],
        images:['hero-concrete.png','masonry-driveway.png','hero-construction.png','masonry-steps.png','masonry-brick.png','hero-waterproofing.png','masonry-pointing.png','exterior-porch.png']
      },
      {
        number:'02', title:'Roofing & Water Protection', description:'Complete roof, drainage and weather-protection services.',
        board:'assets/service-pictures/roofing-water-board.png', picturePrefix:'roofing', boardColumns:5, boardRows:4,
        groups:[['Roof systems',['Flat roofs','Rubber roofs','Shingle roofs','Roof replacement','Roof repair','Roof coatings','Flashing repair','Skylight work','Roof ventilation','Roof inspections']],['Water control',['Leak detection','Waterproof membranes','Chimney flashing','Gutters','Downspouts','Drainage correction','Emergency covering']]],
        images:['hero-roofing.png','roof-rubber.png','roof-shingles.png','roof-coating.png','roof-flashing.png','roof-skylight.png','roof-leak.png','hero-waterproofing.png','hero-gutters.png']
      },
      {
        number:'03', title:'Exterior Construction', description:'Durable exterior improvements for protection, access and curb appeal.',
        board:'assets/service-pictures/exterior-construction-board.png', picturePrefix:'exterior', boardColumns:5, boardRows:4,
        groups:[['Masonry & site work',['Brick pointing','Brick replacement','Block work','Stone work','Concrete sidewalks','Driveways','Steps and stoops','Retaining walls','Paver stones','Stucco']],['Exterior improvements',['Siding','Exterior painting','Decks','Porches','Fences and gates','Exterior doors','Window installation','Power washing','Caulking and sealing']]],
        images:['masonry-pointing.png','masonry-brick.png','hero-concrete.png','masonry-driveway.png','masonry-steps.png','masonry-pavers.png','masonry-stucco.png','hero-siding.png','hero-deck.png','exterior-porch.png','exterior-fence.png','exterior-window.png','exterior-powerwash.png']
      },
      {
        number:'04', title:'Interior Remodeling', description:'Complete room renovations and finished interior construction.',
        board:'assets/service-pictures/interior-remodeling-board.png', picturePrefix:'interior', boardColumns:5, boardRows:4,
        groups:[['Rooms',['Kitchen remodeling','Bathroom remodeling','Basement finishing','Laundry rooms','Living spaces','Commercial interiors','Apartment turnovers']],['Finishes',['Drywall and sheetrock','Plaster repair','Interior painting','Hardwood flooring','Laminate and vinyl flooring','Ceramic tile','Marble and stone','Finish carpentry','Doors and trim','Cabinets and countertops','Insulation','Soundproofing']]],
        images:['interior-kitchen.png','interior-bathroom.png','hero-remodeling.png','hero-flooring-tile.png','interior-tile.png','interior-marble.png','interior-plaster.png','hero-painting.png','hero-carpentry.png']
      },
      {
        number:'05', title:'Building Systems', description:'Specialty trades coordinated as part of a complete renovation.',
        board:'assets/service-pictures/building-systems-board.png', picturePrefix:'systems', boardColumns:5, boardRows:3,
        groups:[['Licensed-trade coordination',['Electrical upgrades','Lighting installation','Outlet and switch work','Plumbing rough-in','Fixture installation','Water and drain lines','Heating systems','Ventilation','Air-conditioning coordination','Fire stopping','Smoke/CO safety work']],['Confirm before publishing',['Trade licenses','Permit responsibility','Subcontractor insurance','Inspection requirements']]],
        images:['hero-remodeling.png','interior-kitchen.png','interior-bathroom.png','hero-construction.png','interior-plaster.png','hero-carpentry.png','hero-painting.png','hero-flooring-tile.png']
      },
      {
        number:'06', title:'Project Support', description:'Recommended services that create a clear and professional customer experience.',
        board:'assets/service-pictures/project-support-board.png', picturePrefix:'support', boardColumns:5, boardRows:4,
        groups:[['Customer Experience',['Free project consultation','Written estimates','Photo documentation','Material selections','Project scheduling','Progress updates','Written change orders','Final walkthrough','Cleanup plan','Warranty documentation']],['Property Support',['Permit coordination','DOB and HPD repair work','Violation-correction work','Accessibility upgrades','Maintenance programs','Insurance restoration','Emergency assessment']]],
        images:['hero-construction.png','exterior-porch.png','masonry-steps.png','interior-kitchen.png','hero-roofing.png','hero-masonry.png','hero-remodeling.png','hero-deck.png']
      }
    ];
    completeServiceGrid.classList.add('complete-service-grid');
    completeServiceGrid.innerHTML = serviceCatalog.map(category => {
      const allServices = category.groups.flatMap(group => group[1]);
      const serviceSlides = allServices.map((item,index) => `<div class="service-photo${index===0?' active':''}" data-bg="assets/service-pictures/${category.picturePrefix}-${String(index+1).padStart(2,'0')}.png" role="img" aria-label="${item}"></div>`).join('');
      const serviceGroups = category.groups.map(group => `<section><h4>${group[0]}</h4><ul>${group[1].map(item => `<li>${item}</li>`).join('')}</ul></section>`).join('');
      return `
      <article class="service-card catalog-service-card">
        <div class="service-card-carousel">${serviceSlides}<div class="service-photo-shade"></div></div>
        <span class="num">${category.number}</span>
        <div class="catalog-service-content">
          <h3>${category.title}</h3>
          <p>${category.description}</p>
          <div class="catalog-service-groups">${serviceGroups}</div>
        </div>
      </article>`;
    }).join('');
    completeServiceGrid.querySelectorAll('[data-bg]').forEach(element => {
      element.style.backgroundImage = `url('${element.dataset.bg}')`;
    });
  }

  document.querySelectorAll('.project-card small').forEach(label => label.remove());

  const projectFilters = [...document.querySelectorAll('[data-project-filter]')];
  const projectCards = [...document.querySelectorAll('[data-project-category]')];
  projectFilters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    projectFilters.forEach(item => item.classList.toggle('active', item === button));
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.projectCategory !== filter;
    });
  }));

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
