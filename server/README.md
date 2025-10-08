# Dinmana Backend API

Backend API pentru aplicația Dinmana.

## Deployment pe Railway/Render

### 1. Variabile de mediu necesare

Configurează următoarele variabile de mediu în platforma de hosting:

```
PORT=8080
MONGODB_URI=mongodb+srv://vasihab82_db_user:D9btUdRX5fplw9Gz@cluster0.4vcuu83.mongodb.net/dinmana?retryWrites=true&w=majority&appName=Cluster0
CLIENT_ORIGIN=https://dinmana.vercel.app,https://www.din-mm.site,http://localhost:3000
CF_ACCOUNT_ID=6c4685145803de4e2a161d569526ee20
CF_IMAGES_TOKEN=UOxvY6BszSWFfE7DHzNaTbveOPEj1zdaM6rMZuHz
CF_IMAGES_URL=https://imagedelivery.net/XUmtXWy7NhUY02gsO5fPbg/<image_id>/<variant_name>
GOOGLE_APPLICATION_CREDENTIALS=./creds/firebase-admin.json
```

### 2. Fișiere necesare

Asigură-te că fișierul `creds/firebase-admin.json` este prezent în repository.

### 3. Comenzi de deployment

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 4. Testare locală

```bash
npm install
npm run build
npm run start
```

Serverul va porni pe portul specificat în variabila `PORT` (implicit 8080).

### 5. Endpoints

- `GET /health` - Health check
- `GET /api/ads` - Lista anunțurilor
- `POST /api/ads` - Creează anunț nou
- `POST /api/upload/direct-url` - Upload imagine
- `POST /api/chat` - Mesaje chat

### 6. CORS

Serverul este configurat să accepte cereri de pe:
- `https://dinmana.vercel.app` (producție Vercel)
- `https://www.din-mm.site` (producție domeniu personalizat)
- `http://localhost:3000` (dezvoltare locală)
