# CITED — Community Initiative For Teens Empowerment And Development

A modern, responsive NGO website built with plain **HTML, CSS and JavaScript** — no frameworks, no build tools.
Backend powered by **Firebase Firestore** for volunteer/member registrations.

---

## 📁 Folder structure

```
project/
├── index.html         # Home
├── about.html         # About / story / mission
├── programs.html      # Programs overview
├── gallery.html       # Masonry gallery + lightbox
├── join.html          # Volunteer registration (Firestore)
├── contact.html       # Contact form + map
│
├── css/
│   └── style.css      # All styles (organized by section, with comments)
│
├── js/
│   ├── script.js          # Navbar, scroll reveal, counters, gallery, form logic
│   └── firebase-config.js # Firebase setup — REPLACE keys here
│
├── assets/
│   ├── logo/cited-logo.png   # CITED logo
│   └── images/               # Add your own photos here
│
└── README.md
```

---

## 🚀 Run locally (VS Code Live Server)

1. Open the project folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel.
3. Right-click `index.html` → **"Open with Live Server"**.
4. Your browser opens at `http://127.0.0.1:5500` — that's it!

> **Why Live Server?** This project uses ES Modules (`<script type="module">`) for Firebase, which require an actual web server. Opening the file directly with `file://` will NOT work.

---

## 🔥 Firebase setup (for the Join Us form)

The volunteer form on `join.html` saves submissions to **Firestore**. Setup takes ~5 minutes:

### 1. Create a Firebase project
- Go to https://console.firebase.google.com/
- Click **Add project** → name it (e.g. `cited-ngo`) → continue.

### 2. Register a Web App
- In your project, click the **`</>`** icon to add a web app.
- Give it a nickname (e.g. `CITED Web`) → Register app.
- Firebase shows you a `firebaseConfig` object — **copy it**.

### 3. Paste your config
Open `js/firebase-config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey:            "your-api-key",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abc123"
};
```

### 4. Enable Firestore
- In the Firebase console sidebar, click **Build → Firestore Database**.
- Click **Create database** → choose **Start in test mode** (for development) → pick a region → Enable.

### 5. Test it
- Open `join.html` via Live Server.
- Fill in the form and submit.
- Back in the Firebase console, open the **`members`** collection — you should see your new record with all the fields and a `createdAt` timestamp. 🎉

### 6. Before going live (production)
Switch your Firestore rules from "test mode" to something safer. Example minimal rules that only allow new submissions (no public reads):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

---

## ✍️ Things you might want to edit

| What | Where |
|---|---|
| Contact info (email/phone/WhatsApp) | Footer + `contact.html` + `whatsapp-float` link in every page |
| Map location | `contact.html` → `iframe` `bbox` parameter |
| Statistics numbers | `index.html` → `data-counter="500"` values |
| Replace stock photos | Swap Unsplash URLs in HTML with files from `assets/images/` |
| Brand colors | `css/style.css` → `:root` section at the top |
| Social media links | Footer `<div class="socials">` in each page |

---

## 🎨 Design system

- **Fonts:** Inter, Sora, Poppins (loaded from Google Fonts)
- **Primary:** Deep Blue `#0F172A`
- **Accent:** Gold `#F59E0B`
- **Glow accents:** Cyan `#22D3EE`, Purple `#8B5CF6`
- **Surface:** `#F8FAFC`

---

## 🌐 Deploy

This is a fully static site, so you can deploy it for free on:
- **Vercel** — drag & drop the folder at https://vercel.com/new
- **Netlify** — drag & drop at https://app.netlify.com/drop
- **Firebase Hosting** — `firebase init hosting` then `firebase deploy`
- **GitHub Pages** — push the folder to a repo, enable Pages in settings

No build step is required for any of them.

---

Made with ❤️ for the next generation.

---

## Contact form → Owner's inbox (EmailJS)

Contact-page messages are delivered to **clemony01@gmail.com** through
EmailJS (free tier, no server required).

1. Create a free account at https://www.emailjs.com/
2. **Email Services** → Add New Service → Gmail → connect clemony01@gmail.com.
   Copy the **Service ID**.
3. **Email Templates** → Create New Template.
   - "To Email": `clemony01@gmail.com`
   - "Reply To": `{{reply_to}}`
   - Subject: `New message from {{from_name}} (CITED website)`
   - Body:
     ```
     From: {{from_name}} <{{from_email}}>

     {{message}}
     ```
   - Save and copy the **Template ID**.
4. **Account → General** → copy your **Public Key**.
5. Open `js/emailjs-config.js` and paste the three values.

## Newsletter subscribers → Firestore

The Subscribe form on the homepage saves each email to a `subscribers`
collection in the same Firebase project used for the Join form.

View subscribers: Firebase console → Firestore Database → `subscribers`.
You can export the collection as JSON/CSV from the console.

Suggested Firestore security rules (add to your existing rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /subscribers/{doc} {
      allow create: if request.resource.data.email is string
                   && request.resource.data.email.size() < 255;
      allow read, update, delete: if false;
    }
  }
}
```
