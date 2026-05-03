# SwiftRide CI/CD — Full Setup Steps

---

## STEP 1 — Docker Hub

1. Create account at https://hub.docker.com
2. Create a repository named: `swiftride`
3. Keep page open (you need username in next steps)

---

## STEP 2 — Edit Jenkinsfile (3 values to change)

Open `Jenkinsfile` and change:

```
DOCKERHUB_USER = 'YOUR_DOCKERHUB_USERNAME'   ← your Docker Hub username
EC2_HOST       = 'YOUR_EC2_PUBLIC_IP'         ← your EC2 IP
url            = 'https://github.com/...'     ← your GitHub repo URL
```

---

## STEP 3 — Push to GitHub

```bash
git add .
git commit -m "add cicd pipeline"
git push
```

---

## STEP 4 — EC2 Setup

```bash
# SSH into EC2
ssh -i swiftride-key.pem ec2-user@YOUR_EC2_IP

# Run all commands from ec2-setup.sh one block at a time
# (Docker → Node → Java → Jenkins → .env file)
```

---

## STEP 5 — Jenkins First Login

1. Open: `http://YOUR_EC2_IP:8080`
2. Paste password from: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`
3. Install suggested plugins (wait ~5 min)
4. Create admin user

---

## STEP 6 — Add Docker Hub Credentials to Jenkins

1. Jenkins → Manage Jenkins → Credentials
2. Click `(global)` → Add Credentials
3. Fill:
   - Kind: `Username with password`
   - Username: your Docker Hub username
   - Password: your Docker Hub password
   - ID: `dockerhub-creds`          ← must match Jenkinsfile exactly
4. Click Save

---

## STEP 7 — Create Pipeline in Jenkins

1. New Item → name: `swiftride-pipeline` → Pipeline → OK
2. Scroll to Pipeline section
3. Definition: `Pipeline script from SCM`
4. SCM: `Git`
5. Repository URL: your GitHub URL
6. Branch: `main`
7. Script Path: `Jenkinsfile`
8. Save

---

## STEP 8 — GitHub Webhook (auto-build on push)

1. Go to your GitHub repo → Settings → Webhooks → Add webhook
2. Payload URL: `http://YOUR_EC2_IP:8080/github-webhook/`
3. Content type: `application/json`
4. Select: `Just the push event`
5. Click Add webhook

In Jenkins:
1. Open your pipeline → Configure
2. Check: `GitHub hook trigger for GITScm polling`
3. Save

Now every `git push` auto-triggers a build.

---

## STEP 9 — First Manual Build

1. Jenkins → swiftride-pipeline → Build Now
2. Click build #1 → Console Output
3. Watch all 8 stages pass
4. Final line should say: `App is healthy`

---

## STEP 10 — Access App

```
App:     http://YOUR_EC2_IP:5000
Jenkins: http://YOUR_EC2_IP:8080
Health:  http://YOUR_EC2_IP:5000/health
```

---

## USEFUL COMMANDS (run on EC2)

```bash
docker ps                          # see running containers
docker logs swiftride-app          # see app logs
docker logs swiftride-app --tail 50  # last 50 lines
docker restart swiftride-app       # restart app
docker stop swiftride-app          # stop app
```

---

## AFTER EVERY CODE CHANGE

```bash
git add .
git commit -m "your message"
git push
# Jenkins auto-builds via webhook → app updates live
```

---

## PORTS TO OPEN IN AWS SECURITY GROUP

| Port | Source     | Purpose         |
|------|------------|-----------------|
| 22   | My IP      | SSH             |
| 8080 | My IP      | Jenkins         |
| 5000 | 0.0.0.0/0  | App (public)    |
| 80   | 0.0.0.0/0  | HTTP (optional) |
