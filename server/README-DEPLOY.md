# Server Deployment (Docker + Cloud Run)

This document explains how to build and deploy the `server/` component to Google Cloud Run and how to run it locally with Docker.

Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated.
- Firebase project configured if you use Firebase Admin features.
- GitHub repository with `Secrets` configured (see below) if using the included GitHub Actions workflow.

Recommended GitHub Secrets
- `GCP_PROJECT` — your Google Cloud project id
- `GCP_SA_KEY` — base64-encoded service account JSON (or the raw JSON string). Must have Cloud Run & Cloud Build permissions.
- `CLOUD_RUN_SERVICE` — desired Cloud Run service name (e.g., `eyeq-server`)
- `CLOUD_RUN_REGION` — region (e.g., `us-central1`)
- `ADMIN_API_KEY` — secret used by the server to protect admin endpoints
- `FRONTEND_URL` — optional frontend base URL used when generating signup links
- `FIREBASE_DATABASE_URL` — optional if your Admin SDK needs it

Local build & run (Docker)
1. Build image:
```powershell
cd server
docker build -t eyeq-server:local .
```

2. Run container (map port):
```powershell
docker run -it -p 8080:8080 --env ADMIN_API_KEY=local-test-key eyeq-server:local
```

3. Health check:
```powershell
curl http://localhost:8080/api/health
```

Cloud Run deployment (manual with gcloud)
1. Authenticate and set project:
```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. Build and push image (Cloud Build):
```powershell
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eyeq-server:latest ./server
```

3. Deploy to Cloud Run:
```powershell
gcloud run deploy eyeq-server --image gcr.io/YOUR_PROJECT_ID/eyeq-server:latest --region us-central1 --platform managed --allow-unauthenticated --set-env-vars ADMIN_API_KEY=your-secret,FRONTEND_URL=https://yourfrontend.example
```

Notes & secrets
- Do NOT commit `serviceAccountKey.json` to the repo. Use Secrets or Cloud IAM workloads for production.
- For CI (GitHub Actions) store `GCP_SA_KEY` as a Base64 string or as the raw JSON in repository Secrets.

Deploy Firestore & Storage rules
```powershell
cd <repo-root>
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

Admin endpoints
- Protected by `ADMIN_API_KEY` header or `?admin_key=` query when `ADMIN_API_KEY` is set in the server env. Make sure to set this secret in Cloud Run env vars.
