# Career Counselors — Study Abroad Consultants website

Static website (HTML, CSS, JavaScript). No build step. Ready for GitHub Pages.

## Pages
| File | URL | Purpose |
|---|---|---|
| index.html | / | Home page |
| study-in-italy.html | /study-in-italy | Google Ads landing page — Italy (Sept 2027) |
| study-in-uk.html | /study-in-uk | Landing page — UK (Jan 2027) |
| study-in-ireland.html | /study-in-ireland | Landing page — Ireland (Jan 2027) |
| study-in-hungary.html | /study-in-hungary | Landing page — Hungary (Jan 2027) |
| study-in-cyprus.html | /study-in-cyprus | Landing page — Cyprus (Jan 2027) |
| contact.html | /contact | Contact page with map |
| privacy-policy.html | /privacy-policy | Required by Google Ads |
| 404.html | — | Not-found page |

## Host on GitHub Pages
1. Create a new public repository on GitHub (e.g. `careercounselors-website`).
2. Upload **all files and folders in this zip** to the root of the repository (not inside a sub-folder).
3. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. After 1–2 minutes the site is live at `https://YOUR-USERNAME.github.io/careercounselors-website/`.

### Connect your own domain (recommended for Google Ads)
1. Buy a domain (e.g. `careercounselors.pk`).
2. In **Settings → Pages → Custom domain**, enter `www.yourdomain.com` and tick **Enforce HTTPS**.
3. At your domain provider, add a `CNAME` record: `www` → `YOUR-USERNAME.github.io`.

## IMPORTANT: replace the placeholder domain
All SEO tags, the sitemap and schema use the placeholder **`https://www.careercounselors.pk`**.
If your domain is different, use GitHub's search or any editor's "Find and Replace in files" to replace
`https://www.careercounselors.pk` with your real domain in every `.html` file, `sitemap.xml` and `robots.txt`.

## Before you go live — please check
- **Exact office address**: the site says "DHA Branch, Lahore". Add the full street address in `contact.html`
  and in the JSON-LD block (`streetAddress`) on each page, and change the map link
  (`https://www.google.com/maps?q=DHA+Lahore&output=embed`) to your exact Google Maps location.
- **"Free Assessment"**: confirm your first counselling session is free; otherwise change the wording.
- **Photos**: destination and student photos load from Unsplash (free licence). If any photo fails to load, a coloured tile with the country flag shows instead. To use your own photos, put them in `assets/img/` and change the `images.unsplash.com` links in the HTML files.
- **Logo**: a placeholder logo is in `assets/img/logo.svg` / `logo.png`. Replace with your real logo (same file names).
- **Testimonials**: add real student reviews / visa success photos when you have permission to use them.

## How the lead form works
The form does not need a server. When a student presses **Send on WhatsApp**, WhatsApp opens with all their details
filled in, addressed to **+92 324 9499994**. To change the number, edit `WA_NUMBER` at the top of `assets/js/main.js`
and the `wa.me/923249499994` links in the HTML files.

## Google Ads conversion tracking
Each page has a comment `<!-- Google Ads / GA4: paste your global site tag (gtag.js) here -->` in the `<head>`.
Paste your Google Ads tag there. The site already sends these events:
- `generate_lead` — form submitted (use as your main conversion)
- `whatsapp_click` — any WhatsApp button clicked
- `phone_click` — any phone number tapped

In Google Ads create conversion actions for these, or import them from GA4 / Google Tag Manager.

## SEO already included
- Unique title, meta description and keywords per page, targeting searches like
  "study in Italy from Pakistan", "study in UK without IELTS", "study abroad consultants Lahore"
- Canonical URLs, Open Graph and Twitter cards with a share image (`assets/img/og-image.png`)
- Structured data (JSON-LD): EducationalOrganization + LocalBusiness, Service, FAQPage, BreadcrumbList
- `sitemap.xml` and `robots.txt` — submit the sitemap in Google Search Console after going live
- Fast, mobile-first, accessible markup; animations respect "reduce motion" settings

## After launch
1. Add the site to **Google Search Console** and submit `sitemap.xml`.
2. Create / claim your **Google Business Profile** for the DHA office and link the website.
3. Add the website link to the Career Counselors Facebook page.
