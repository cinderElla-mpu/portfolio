# Ella Khanya Mpu Portfolio

A responsive, dependency-free portfolio built with semantic HTML, CSS, and vanilla JavaScript.

## Run

Open `index.html` in a browser. No installation, build, or development server is required.

## Update portfolio content

Edit `portfolioData` near the top of `app.js` to maintain the visible content:

- `projects`: add, edit, or remove records. Each record has `name`, `description`, `technologies`, `githubUrl`, `demoUrl`, and optional card `theme` and `symbol`. Leave unknown links and technologies blank rather than guessing; GitHub/demo links appear only when a URL is provided.
- `skillGroups`: update category names, skills, and optional featured badge/question values. Keep entries limited to skills Ella has learned or used.
- `certificates`: add certificates or courses with `title`, `kind`, `category` (`ai`, `web`, or `data`), `categoryLabel`, and any confirmed `provider`, `year`, `duration`, `description`, and local `pdf` path. Provider, year, description, and PDF are optional when unknown.

The current data includes the CAPACITI AI Skills Acceleration Programme. Project cards, skill groups, filters, and counts render automatically from these records.

The contact email, LinkedIn, and GitHub profile links are in the contact section in `index.html`. The certificate folder button links to the supplied SharePoint folder.

Set `formspreeEndpoint` in the `CONFIG` object in `app.js` to enable the contact form. A CV file has not been supplied; do not enable its download until one is added.

## Accessibility and behavior

The page includes a persistent dark mode toggle, keyboard-operated learning tabs, reduced-motion support, visible focus states, form validation, a honeypot field, a scroll-aware timeline, and the Cutie assistant.
# portfolio
