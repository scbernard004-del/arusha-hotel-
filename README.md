# Meru Haven Hotel Arusha Website

A premium multipage React/Vite hotel website for Arusha, Tanzania. Fully responsive, mobile-friendly, dark/light mode, English/Swahili toggle, booking form layout, WhatsApp button, and unique images across pages.

## Run locally

1. Install Node.js from https://nodejs.org
2. Open this folder in VS Code or Terminal
3. Run:

```bash
npm install
npm run dev
```

4. Open the local link shown in the terminal, usually:

```text
http://localhost:5173
```

## Build for Vercel

```bash
npm run build
```

Upload the project to GitHub, then import the repository in Vercel.

## Notes

Images are loaded from online image URLs. When deploying on Vercel, they will display normally if the visitor has internet access.


## Latest Image Update

- Added 20 locally generated premium hotel/safari-inspired images in `src/assets/images/`.
- Each main page uses a different hero image.
- Room, dining, safari, gallery, about, contact, and booking sections use different image files.
- Images are responsive, lazy-loaded, and optimized to scale well on mobile, tablet, and desktop.

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

Upload the folder to GitHub, then import the repo into Vercel. Use the default Vite settings.

## Latest update: full English / Swahili language switch
- The language toggle now changes the full website, not only selected sections.
- Updated desktop header, mobile menu, logo initials/name, buttons, forms, room cards, footer, booking section, and page text.
- Added a unique Rooms hero image so the Rooms and Booking pages do not share the same hero.
- Build tested successfully with `npm run build`.


## Image update
This version uses real free online hotel, room, dining, safari, pool, spa, and landscape photos from Unsplash. Each main page uses a different hero image, and room/gallery images are responsive with `object-fit: cover` so they work on mobile, tablet, desktop, and wide screens.

Note: the website needs internet when previewing so the online photos can load. If you want everything 100% offline later, download the images from the listed free-photo sources and replace the URLs in `src/main.jsx`.
