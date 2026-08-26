# Setup

This app needs its own Firebase project and a Cloudinary account before it
actually works. None of this is optional — the app won't run without it.

## 1. Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project (e.g. "kids-meal-orders").
2. **Build > Firestore Database > Create database** — start in production mode, pick a region close to you.
3. **Build > Authentication > Sign-in method** — enable two providers:
   - **Google** (for parents)
   - **Anonymous** (for kids)
4. **Project settings > General > Your apps > Add app > Web** — register the app, then copy the `firebaseConfig` object it gives you into `src/firebase.js`, replacing the `REPLACE_ME` placeholders.
5. Deploy the security rules in `firestore.rules`:
   ```
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules --project <your-project-id>
   ```
   (Or paste the contents of `firestore.rules` into the console's Firestore **Rules** tab and click Publish.)

## 2. Parent access

Edit `src/authConfig.js` and list every Google email address allowed to sign in as a parent. Also update the matching list inside `firestore.rules` (`isParent()`) and redeploy the rules — the two lists must match, since the app-level allowlist controls the UI but the Firestore rule is what actually enforces it.

## 3. Cloudinary (photos)

1. Create a free account at [cloudinary.com](https://cloudinary.com) (or reuse an existing one).
2. **Settings > Upload > Add upload preset** — set **Signing Mode** to **Unsigned**, and leave the **Folder** field blank/unlocked (the app sets the folder per-upload — `library-items` for the food library, `Menu` for kids' meal photos).
3. Copy your **Cloud name** and the new preset's name into `src/cloudinaryConfig.js`.

## 4. GitHub Pages hosting

In the repo's GitHub Settings → Pages, set **Source** to **GitHub Actions**. Every push to `main` builds and deploys automatically via `.github/workflows/deploy.yml`.

## 5. Install & run locally

```
npm install
npm run dev
```

## First-time app setup (as a parent)

Once deployed with real Firebase/Cloudinary config:
1. Open the app, choose **I'm a Parent**, sign in with Google.
2. Go to **Kids** and add a profile for each kid (name, username, 4-digit PIN).
3. Go to **Library** and add food items with photos and categories.
4. Go to **Menu** to build and open your first menu.

## Known trade-offs (by design, to keep this app free to run)

- **No push notifications.** "Meal ready" only shows up while a kid has the app open — there's no background alert. Adding real push would need Cloud Functions and Firebase's paid Blaze plan.
- **Kid PINs aren't cryptographically secure.** Kids sign in anonymously and the PIN is checked client-side against Firestore — fine for a private family app on devices you control, but not a real auth system. Don't reuse these PINs anywhere sensitive.
- **Orphaned Cloudinary photos.** Only the latest meal photo per kid is ever shown or linked, but if a kid re-uploads, the previous image stays in your Cloudinary account (harmless, just unused storage).
