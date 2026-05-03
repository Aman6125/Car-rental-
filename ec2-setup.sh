#!/bin/bash
# ═══════════════════════════════════════════════
# EC2 AMAZON LINUX — FULL SETUP
# Run each block ONE AT A TIME after SSH into EC2
# ═══════════════════════════════════════════════


# ── 1. UPDATE ──────────────────────────────────
sudo yum update -y


# ── 2. DOCKER ──────────────────────────────────
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user


# ── 3. NODE 18 ─────────────────────────────────
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs


# ── 4. JAVA (for Jenkins) ──────────────────────
sudo yum install -y java-17-amazon-corretto


# ── 5. JENKINS ─────────────────────────────────
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins


# ── 6. JENKINS → DOCKER PERMISSION ────────────
sudo usermod -aG docker jenkins
sudo systemctl restart docker
sudo systemctl restart jenkins


# ── 7. GET JENKINS ADMIN PASSWORD ─────────────
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
# Copy this password — you need it to login to Jenkins


# ── 8. CREATE .ENV FILE ────────────────────────
# Fill in YOUR real values before running
cat > /home/ec2-user/swiftride.env << 'ENVEOF'
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/swiftride
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=production
ENVEOF


# ── 9. VERIFY EVERYTHING ───────────────────────
docker --version
node --version
java --version
sudo systemctl status jenkins --no-pager


# ═══════════════════════════════════════════════
# SECURITY GROUP — OPEN THESE PORTS IN AWS
# ═══════════════════════════════════════════════
# Port 22   → SSH       → Source: My IP
# Port 8080 → Jenkins   → Source: My IP
# Port 5000 → App       → Source: 0.0.0.0/0
# Port 80   → HTTP      → Source: 0.0.0.0/0  (optional)
