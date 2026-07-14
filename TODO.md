# Jodha Bai — remaining setup (do these at launch)

## 1. ⚠ CONTACT FORM — the one you asked me to remind you about
The form is in **demo mode**: it validates and shows the thank-you screen,
but sends nothing. Enquiries are lost until this is done.
- Sign up free at https://formspree.io (or https://web3forms.com) with
  bookings@jodhabairetreat.com
- Open `pages/contact.js`, find `var FORM_ENDPOINT = "";` at the top,
  and paste your endpoint URL between the quotes. That's the whole job.
- Send yourself one test enquiry to confirm it arrives.

## 2. Domain check
All canonical URLs, Open Graph tags, robots.txt and sitemap.xml assume
**https://jodhabairetreat.com**. If the site will live on a different
domain, find-and-replace that string across index.html, pages/*.html,
robots.txt and sitemap.xml.

## 3. STRA registration number
NSW requires the STRA registration number to be displayed on any
advertising of the accommodation. When you have the number(s), add them
to the note at the bottom of the Residences section in index.html
(the line ending "...short-term rental accommodation, NSW").

## 4. Images — the single biggest performance lever left
The code is now optimised around the images (lazy loading, async
decode, fetchpriority on heroes, content-visibility on the gallery
grid). The images themselves are the remaining 90% of page weight.

### Quick version (good)
Run every image through https://squoosh.app — export WebP at ~80
quality. Targets: gallery/mosaic tiles under 250 KB, heroes under
500 KB. Replace the files in /images keeping the same names (or same
names with .webp and a find-and-replace on the extension).

### Proper version for the Gallery page (best — it shows 20 photos)
Generate 3 widths per image (480 / 960 / 1600 px wide) and use srcset
so phones never download desktop-size files. With sharp-cli installed
(npm i -g sharp-cli), from the images folder:

    for f in *.jpg; do
      npx sharp-cli resize 480  --input "$f" --output "${f%.jpg}-480.webp"  --format webp --quality 80
      npx sharp-cli resize 960  --input "$f" --output "${f%.jpg}-960.webp"  --format webp --quality 80
      npx sharp-cli resize 1600 --input "$f" --output "${f%.jpg}-1600.webp" --format webp --quality 80
    done

Then each gallery cell becomes:

    <img src="../images/NAME-960.webp"
         srcset="../images/NAME-480.webp 480w,
                 ../images/NAME-960.webp 960w,
                 ../images/NAME-1600.webp 1600w"
         sizes="(max-width: 720px) 50vw, 33vw"
         alt="..." loading="lazy" decoding="async" />

Send me the image list when they're ready and I'll rewrite the
gallery markup with the srcsets for you.

## 4b. Hosting
Deploy on Netlify, Cloudflare Pages or Vercel (all free tier). They
add Brotli compression, HTTP/2 and CDN caching automatically — that,
plus the image work above, is the entire remaining speed story.

## 5. Legal copy (optional, later)
House Rules/Terms still read stay-first — legitimate since the STRA
licence continues, but consider adding event-hire terms: deposit and
payment schedule, event cancellation policy, vendor bump-in/bump-out,
guest capacity, noise curfew, damage bond. Needs your business
decisions on the numbers.

## Deleted files (on purpose — don't restore)
- includes/header.html and includes/footer.html — nothing ever loaded
  them; the live markup is inlined in each page. They had drifted out
  of date and were a trap.
