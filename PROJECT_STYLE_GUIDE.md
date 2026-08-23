# New Prime Website — Reusable Design Reference

## Brand identity

- Company: New Prime General Construction Corp.
- Visual tone: dependable, experienced, professional New York contractor
- Primary navy: `#101c2b`
- Secondary blue: `#184f8c`
- Accent orange: `#f15a24`
- Supporting orange: `#ff8a58`
- Light surfaces: white, light blue-gray, and warm off-white
- Headings: bold condensed construction-style typography
- Body text: clean Arial/sans-serif typography

## Page pattern

- Permanent top information bar with office and cell numbers
- Sticky main header with logo, navigation tabs, and orange Call Now button
- Full-screen Home hero with construction-photo slideshow
- Separate routed views for Why Us, Services, Process, and Contact
- Different service-related heading photograph for every view
- Dark overlays on photographs to keep white text readable
- Compact navy footer with company identity and tree-style service lists
- Home view stays full-screen without the footer; internal views include the footer

## Navigation and interaction

- One `index.html` with hash routes: `#home`, `#why-us`, `#services`, `#process`, and `#contact`
- JavaScript routing plus an HTML/CSS fallback
- Responsive hamburger menu on mobile
- Logo always returns to Home
- Call Now opens a navy contact panel showing office, cell, fax, and office hours
- Escape key, close button, and outside click close the panel

## Image and slideshow pattern

- All photographs live in the lowercase `assets` folder
- Home uses 10 rotating construction images
- Services uses four synchronized category-specific slideshows
- Every service card uses unique, related photographs
- Images remain for two seconds, exit left, and enter from the right
- Why Us uses a continuous service-photo reel
- CSS image fallbacks allow pictures to work through both `file://` and web servers

## Content pattern

- Trust-driven language: fully insured, free estimates, direct communication, durable results
- Company history: established in 2001; 25 years shown as 2001–present
- Experience includes residential, commercial, city, and NYC HPD contractor work
- Service area includes Yonkers, Westchester County, and all five New York City boroughs
- Exterior categories: roofing, waterproofing, masonry, concrete, stucco, pavers, siding, gutters, and decks
- Interior categories: kitchens, bathrooms, flooring, marble, tile, plaster, painting, carpentry, and finishing

## Estimate workflow

- Full official estimate-request form
- Customer and property information
- Two-column service checklist on desktop and one column on small phones
- Project details and preferred timing
- Copy Request button for email, text, or WhatsApp
- Open Email button creates a prefilled email to the company

## Mobile pattern

- Viewport meta tag required
- Layout switches to one column below 700px
- Touch targets are at least approximately 46–50px tall
- Forms use 16px inputs to avoid mobile zoom
- Call panel stays within the screen and scrolls when necessary
- No horizontal overflow
- Footer and service trees stack cleanly

## Required project structure

```text
project-folder/
├── index.html
├── style.css
├── script.js
└── assets/
    └── all website photographs
```

Use this document as the starting pattern for future contractor, home-service, remodeling, roofing, masonry, or local-business websites. Change the company identity, contact details, service area, wording, and photographs while preserving the layout and interaction system when a similar style is requested.
