# Din mana in mana

Aplicatie marketplace construita cu Next.js (frontend) si un backend Express + Socket.IO pentru anunturi, autentificare Firebase si chat in timp real.

## Structura
- `app/`, `components/`, `lib/` - frontend Next.js 14 cu directory `app`.
- `server/` - API Express scris in TypeScript (import/export ESM) cu MongoDB, Firebase Admin si Cloudflare Images.
- `.env.local` - variabile publice pentru frontend (copiate in Vercel ca Environment Variables).
- `server/.env` - variabile private pentru backend (nu le incarca in git).

## Rulare locala
1. Instaleaza dependentele in ambele proiecte:
   ```bash
   npm install
   cd server && npm install
   ```
2. Configureaza variabilele (vezi sectiunea urmatoare) si ruleaza serviciile in paralel:
   ```bash
   # frontend
   npm run dev

   # backend
   cd server
   npm run dev
   ```
3. Acceseaza `http://localhost:3000`. Frontend-ul apeleaza API-ul la `http://localhost:8080` (configurabil prin `NEXT_PUBLIC_API_BASE`).

## Variabile de mediu
### Frontend (`.env.local` / Vercel Project Settings -> Environment Variables)
- `NEXT_PUBLIC_API_BASE` - URL-ul backend-ului (ex: `https://api.dinmana.ro`).
- `NEXT_PUBLIC_FIREBASE_*` - configurarea Firebase Web App (key, auth domain, project id, app id, storage bucket, messaging sender id, measurement id).

### Backend (`server/.env` / serviciul unde publici API-ul)
- `PORT` - portul HTTP (implicit `8080`).
- `MONGODB_URI` - conexiune MongoDB Atlas.
- `CLIENT_ORIGIN` - lista de origini separate prin virgula care pot apela API-ul si Socket.IO. Exemplu local + Vercel: `http://localhost:3000,https://dinmana.vercel.app`.
- `CF_ACCOUNT_ID`, `CF_IMAGES_TOKEN` - credentiale Cloudflare Images (token cu permisiunea `Account.Cloudflare Images` -> `Edit`).
- `NEXT_PUBLIC_FIREBASE_*` - aceleasi valori ca in frontend (sunt folosite in anumite raspunsuri).
- `GOOGLE_APPLICATION_CREDENTIALS` sau `FIREBASE_SERVICE_ACCOUNT_JSON` - credentiale Firebase Admin.

> **Nota:** Cloudflare Images a raportat "service limit (0)". Activeaza un plan sau foloseste un cont cu quota disponibila inainte de a testa upload-ul in productie.

## Pregatire pentru deploy in productie
### 1. Backend
Vercel nu poate gazdui direct serverul Express + Socket.IO, deci publica `server/` pe un serviciu pentru aplicatii Node.js (de ex. Railway, Render, Fly.io). Pasi generali:
1. Configureaza variabilele din sectiunea de mai sus (inclusiv `CLIENT_ORIGIN` cu domeniul Vercel).
2. Comanda de build: `npm install && npm run build`.
3. Comanda de pornire: `npm run start` (ruleaza `node dist/index.js`).
4. Asigura-te ca portul expus este cel indicat de platforma (majoritatea ofera variabila `PORT`).
5. Dupa deploy obtine URL-ul public al API-ului (ex: `https://dinmana-api.up.railway.app`).

### 2. Frontend pe Vercel
1. Importa repository-ul in Vercel si lasa setarile implicite: build command `npm run build`, output directory `.`, root directory radacina proiectului.
2. Adauga variabilele front-end mentionate (in special `NEXT_PUBLIC_API_BASE` setata la URL-ul backend-ului implementat la pasul anterior).
3. Daca folosesti Cloudflare Images, seteaza si `NEXT_PUBLIC_FIREBASE_*` cu valorile corecte pentru mediul de productie.
4. Deploy-ul automat va rula `npm install` si `npm run build`. In medii noi nu exista director `.next`, deci eroarea de blocare intalnita local nu apare.
5. Dupa primul deploy actualizeaza `CLIENT_ORIGIN` din backend pentru a include domeniul final Vercel (`https://<project>.vercel.app`) si orice custom domain pe care il atasezi.

### 3. Verificari recomandate
- Ruleaza `npm run build` in frontend si `npm run build` in `server/` inainte de fiecare release (backend-ul are in continuare doua atentionari TypeScript: lipseste `@types/morgan` si sortarea in `routes/ads.ts`; trateaza-le inainte de productie).
- Confirma conectarea la MongoDB si Firebase prin endpoint-ul `/health` si printr-un flux complet de publicare anunt + chat.
- Monitorizeaza quota Cloudflare Images si configureaza mesaje clare in UI daca upload-ul este dezactivat.

## Observatii
- `CLIENT_ORIGIN` suporta acum valori multiple, deci poti mentine si `localhost` pentru debugging dupa ce aplicatia este live.
- Daca ai nevoie de un proxy in fata backend-ului, foloseste un CDN (ex. Cloudflare) si pastreaza headerul `Authorization` pentru verificarea token-urilor Firebase.
