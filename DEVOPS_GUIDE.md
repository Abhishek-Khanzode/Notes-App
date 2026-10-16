# 🚀 Beginner's DevOps Quickstart Guide

Welcome to the DevOps setup for the **Notes App**! If you started learning DevOps 1-2 weeks ago, this guide explains how **Docker**, **Docker Compose**, **Jenkins**, and **Kubernetes** work together.

---

## 🗺️ The Big Picture: How They Connect

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  1. Code &   │  ==>  │  2. Jenkins  │  ==>  │  3. Docker   │  ==>  │4. Kubernetes │
│     Git      │       │  (CI Server) │       │(Image Build) │       │ (Production) │
└──────────────┘       └──────────────┘       └──────────────┘       └──────────────┘
 Developer pushes        Pulls code &            Packs app into          Runs & scales
 code to GitHub          runs automated          reusable container      containers across
                         tests & builds          image                   cluster nodes
```

---

## 📁 Files Created

| File | Tool | Purpose |
| :--- | :--- | :--- |
| [`Dockerfile`](./Dockerfile) | **Docker** | Recipe to package the Next.js app into a container image. |
| [`.dockerignore`](./.dockerignore) | **Docker** | Prevents large folders like `node_modules` from bloating your image. |
| [`docker-compose.yml`](./docker-compose.yml) | **Docker Compose** | Runs both the Next.js App and MongoDB together with one command. |
| [`Jenkinsfile`](./Jenkinsfile) | **Jenkins** | CI Pipeline script that automates pulling code, linting, and building. |
| [`k8s/deployment.yaml`](./k8s/deployment.yaml) | **Kubernetes** | Tells K8s to keep 2 copies (replicas) of your container running. |
| [`k8s/service.yaml`](./k8s/service.yaml) | **Kubernetes** | Exposes the pods over network port `30080` (NodePort). |
| [`k8s/configmap.yaml`](./k8s/configmap.yaml) | **Kubernetes** | Stores environment variables (`PORT`, `NODE_ENV`). |

---

## 1. 🐳 Docker (Single Container)

### What it does:
Packages the application, Node.js runtime, and dependencies into an isolated container that runs identically on any computer.

### Quick Commands:
```bash
# 1. Build the Docker image
docker build -t notes-app .

# 2. Run the container on port 3000
docker run -p 3000:3000 notes-app

# 3. View running containers
docker ps

# 4. Stop a running container
docker stop <container_id>
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. 🐙 Docker Compose (Multi-Container Stack)

### What it does:
Runs multiple containers (e.g., your Next.js frontend/backend + MongoDB database) defined in [`docker-compose.yml`](./docker-compose.yml) simultaneously.

### Quick Commands:
```bash
# Start all containers in the background (detached mode)
docker compose up -d

# View status of running services
docker compose ps

# View live logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

---

## 3. 🏗️ Jenkins (CI/CD Pipeline)

### What it does:
Automates your workflow. Whenever you commit code, Jenkins checks out the repository, installs dependencies, runs tests/linting, and builds your Docker image.

### Pipeline Stages in [`Jenkinsfile`](./Jenkinsfile):
1. **Checkout Code:** Clones the latest branch from Git.
2. **Install Dependencies:** Executes `npm install`.
3. **Lint Code:** Runs `npm run lint` to catch syntax errors.
4. **Build Project:** Runs `npm run build` to compile Next.js.
5. **Docker Build:** Builds `notes-app:<build_number>` image.

### How to use in Jenkins:
1. Open Jenkins Dashboard (`http://localhost:8080`).
2. Click **New Item** -> Name it `Notes-App-Pipeline` -> Choose **Pipeline** -> Click **OK**.
3. Under **Pipeline Definition**, select **Pipeline script from SCM**.
4. Choose **Git**, paste your repository URL and branch (`main`).
5. Ensure the Script Path is set to `Jenkinsfile`.
6. Click **Save** and **Build Now**.

> **💡 Beginner Tip for Windows Agents:**  
> If your Jenkins runs directly on Windows without a bash shell, replace `sh 'command'` with `bat 'command'` in your `Jenkinsfile`.

---

## 4. ☸️ Kubernetes (Container Orchestration)

### What it does:
Manages containers in production. If one container crashes, Kubernetes automatically restarts it or launches a replacement.

### Core Concepts:
- **Pod:** The smallest unit in K8s (runs 1 or more containers).
- **Deployment:** Manages replica Pods and handles rolling updates.
- **Service:** A stable network endpoint (IP / Port) to access the Pods.

### Quick Commands:
```bash
# 1. Apply all Kubernetes manifests in the k8s directory
kubectl apply -f k8s/

# 2. Check the status of your Pods
kubectl get pods

# 3. Check the status of your Deployment and Service
kubectl get deployments
kubectl get services

# 4. View logs of a specific pod
kubectl logs <pod-name>

# 5. Access the app
# If using Minikube:
minikube service notes-app-service

# Or open in your browser:
# http://localhost:30080 (Docker Desktop / NodePort)

# 6. Delete the resources when done
kubectl delete -f k8s/
```
