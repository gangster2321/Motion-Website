/* ==========================================================================
   Project Archive — data
   ==========================================================================

   This is the ONLY file you edit to add, remove or reorder archive projects.
   Everything else (the company tabs, the All/Video/Images filter, the card
   grid, the counter, the lightbox) is generated from this list by main.js.

   ── ADDING A PROJECT ──────────────────────────────────────────────────────

   Each project is one object. `company`, `title` and either `video` or
   `image` are required; everything else is optional.

     {
       company: 'Webkul',            // becomes a tab automatically
       title:   'Punchout Gateway',
       desc:    'One or two sentences.',
       tags:    ['Product Demo', 'Screen Recording'],
       video:   'rXaskL5i3ng'        // ← makes this a VIDEO card
     }

   ── VIDEO: four accepted formats ─────────────────────────────────────────

     video: 'rXaskL5i3ng'                                  YouTube ID
     video: 'https://youtu.be/rXaskL5i3ng'                 any YouTube URL
     video: 'drive:1AbCdEfGhIjKlMnOp'                      Google Drive file ID
     video: 'assets/videos/demo.mp4'                       file in this folder

   YouTube thumbnails are fetched automatically — you don't need `thumb`.
   Drive and local videos should get a `thumb` (see below); a local video
   without one will show its own first frame.

   For Drive videos the file must be shared as "Anyone with the link", and
   you only need the ID — the long string between /d/ and /view in the URL:
     https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view  →  1AbCdEfGhIjKlMnOp

   ── IMAGE: two accepted formats ──────────────────────────────────────────

     image: 'assets/images/board.jpg'                      file in this folder
     image: 'drive:1AbCdEfGhIjKlMnOp'                      Google Drive file ID

   ── OPTIONAL KEYS ────────────────────────────────────────────────────────

     thumb:    'assets/images/poster.jpg'   custom card thumbnail (any format
                                            above, including 'drive:ID')
     desc:     ''                           omit to hide the description
     tags:     []                           omit to hide the tag pills
     featured: true                         pin to the front of the grid

   Order matters: cards render in the order written here, and the company
   tabs appear in the order each company is first mentioned.
   ========================================================================== */

window.PORTFOLIO_PROJECTS = [

  /* ---------------------------------------------------------------- Webkul */
  {
    company: 'Webkul',
    title: 'eShopSync Punchout Gateway',
    desc: 'B2B procurement integration demo connecting eCommerce platforms with ERP systems for effortless purchasing workflows.',
    tags: ['Product Demo', 'Screen Recording'],
    video: 'su1TV3Lv5dY',
  },
  {
    company: 'Webkul',
    title: 'Shopify Connector for Salesforce',
    desc: 'Explainer video showcasing real-time sync between Shopify storefronts and Salesforce CRM for unified order management.',
    tags: ['Explainer', 'UI Animation'],
    video: 'toBPGIZ_kAA',
  },
  {
    company: 'Webkul',
    title: 'Multi-Channel Integration Overview',
    desc: 'Fast-paced overview connecting Amazon, eBay, and Walmart marketplaces to a centralized inventory dashboard.',
    tags: ['Motion Graphics', 'Data Viz'],
    video: 'd6Ep_ZW9gFk',
  },

  /* ------------------------------------------------------------- eShopSync */
  {
    company: 'eShopSync',
    title: 'Platform Migration Showcase',
    desc: 'End-to-end migration story from legacy monolith to modern headless commerce with zero downtime transition.',
    tags: ['Brand Film', 'Documentary'],
    video: 'xuvMsRRUmrQ',
  },
  {
    company: 'eShopSync',
    title: 'Brand Identity Motion',
    desc: 'Logo animation and motion system for the eShopSync product line refresh across all digital touchpoints.',
    tags: ['Branding', 'After Effects'],
    video: '5m3vjPMrzTM',
  },
  {
    company: 'eShopSync',
    title: 'Social Media Asset Kit',
    desc: '15-piece animated asset pack for LinkedIn and Twitter product announcement campaigns.',
    tags: ['Social', 'Motion Graphics'],
    video: 'MaqgxYEUa0k',
  },

  /* ------------------------------------------------------------ Salesforce */
  {
    company: 'Salesforce',
    title: 'Commerce Cloud Integration Demo',
    desc: 'Technical walkthrough of Salesforce B2C Commerce Cloud connected with third-party marketplace extensions.',
    tags: ['Product Demo', 'Screen Capture'],
    video: 'rXaskL5i3ng',
  },
  {
    company: 'Salesforce',
    title: 'Dashboard UI Motion Study',
    desc: 'Micro-interaction and transition animations for Salesforce admin dashboard redesign concept.',
    tags: ['UI Motion', 'Figma'],
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=450&fit=crop'
  },
  {
    company: 'Salesforce',
    title: 'AppExchange Connector Promo',
    desc: 'Promotional video for Salesforce AppExchange partner integration with Shopify storefronts.',
    tags: ['Promo', 'Edit'],
    video: 'qEVdqHwQjnI',
  },

  /* --------------------------------------------------------------- Shopify */
  {
    company: 'Shopify',
    title: 'Multi-Store Sync Overview',
    desc: 'Overview video demonstrating inventory and order synchronization across multiple Shopify Plus stores.',
    tags: ['Explainer', 'Motion'],
    video: '7Xrzta7ZIxQ',
  },
  {
    company: 'Shopify',
    title: 'Theme Launch Graphics',
    desc: 'Animated banner and social asset set for premium Shopify theme marketplace launch.',
    tags: ['Graphics', 'Animation'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=450&fit=crop'
  },
  {
    company: 'Shopify',
    title: 'POS Integration Walkthrough',
    desc: 'Step-by-step guide video for connecting Shopify POS with external ERP and accounting systems.',
    tags: ['Tutorial', 'Screen Recording'],
    video: '_W_X_tZaCmY',
  },

  /* Additional archive placeholders: 9 videos / 6 images total */
  {
    company: 'Webkul',
    title: 'Commerce Workflow Walkthrough',
    desc: 'Placeholder video card for the complete project archive.',
    tags: ['Tutorial', 'Product Demo'],
    video: 'rXaskL5i3ng',
  },
  {
    company: 'eShopSync',
    title: 'Product Storyboard Frames',
    desc: 'Placeholder image card for the complete project archive.',
    tags: ['Storyboard', 'Visual Design'],
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=450&fit=crop'
  },
  {
    company: 'Shopify',
    title: 'Campaign Visual Explorations',
    desc: 'Placeholder image card for the complete project archive.',
    tags: ['Campaign', 'Graphics'],
    image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=450&fit=crop'
  },
  {
    company: 'Webkul',
    title: 'Commerce Interface Studies',
    desc: 'Selected interface explorations for modern commerce experiences and product storytelling.',
    tags: ['UI Design', 'Visual Design'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=800&fit=crop'
  },
  {
    company: 'Salesforce',
    title: 'Product Launch Visuals',
    desc: 'Visual direction and campaign frames created for a connected commerce product launch.',
    tags: ['Campaign', 'Art Direction'],
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=800&fit=crop'
  }

];

/* How many cards show before "View All Projects" is clicked. */
window.PORTFOLIO_INITIAL_VISIBLE = 9;
window.PORTFOLIO_ARCHIVE_URL = 'https://yourdomain.com/projects';
