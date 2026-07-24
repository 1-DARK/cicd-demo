- For create image : docker build -t api .
- Temporary container : docker run -it --rm -p 8080:8080 api

build → make image

run → start app

--rm → auto delete container

- To run the docker compose file : docker compose up -d

STEP 1:

- Create a free account on AWS
- Go to services then EC2 go to launch instance
- name of launch instance , select ubuntu as application and OS
- use free tier from instance type
- key pair Login (Create a new pair,RSA,.pem) and download it and store it
- in network setting add a security group, inbound rules (Custom TCP,8080 ,Source :0.0.0.0)
- Launch the Instance and Copy Public IPv4 address.

STEP 2:

- Go to downloads path in your terminal
- chmod 400 my-key.pem
- ssh -i my-key.pem ubuntu@YOUR_EC2_IP

STEP 3:

```
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow running docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Check it works
docker --version
docker compose version
```

STEP 4: Install Git & Clone Your Repo

```
sudo apt install -y git
git clone https://github.com/yourusername/your-repo.git
cd your-repo
nano .env
PORT=8080
```

STEP 5:

- docker compose up --build -d
- docker ps
- Check on terminal : docker logs cicd-demo-app-1
- http://YOUR_EC2_IPV4 Public address:8080

Manual setup is done. Now let's automate it.

STEP 6:

- On your local machine Terminal : ssh-keygen -t ed25519 -f github-deploy-key -N ""

```
This creates two files:

github-deploy-key (private key — goes into GitHub Secrets)

github-deploy-key.pub (public key — goes onto the server)

```

- cat github-deploy-key.pub
- ssh -i my-key.pem ubuntu@YOUR_EC2_IP "cat >> ~/.ssh/authorized_keys"

```
What to replace

YOUR_EC2_IP → your actual EC2 public IP (like before)

my-key.pem → path to your actual .pem file if it's not in the current folder
```

STEP 7:Add GitHub Secrets

- Repo → Settings → Secrets and variables → Actions → New repository secret

```
Secret Name	Value

VPS_HOST	Your EC2 public IP
VPS_USERNAME	ubuntu
VPS_SSH_KEY	Contents of github-deploy-key (the private key file)
```

- To get the private key content:

```
cat github-deploy-key

Copy everything, including -----BEGIN... and -----END... lines
```

Step 8: Create the GitHub Actions Workflow

- On your local machine, inside your project folder (the same one with index.js, Dockerfile, docker-compose.yml):
- In your repo, create: .github/workflows/deploy.yml

```
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/your-repo
            git pull origin main
            docker compose up --build -d
```

STEP 9:Push and Test

```
git add .
git commit -m "Add CI/CD workflow"
git push origin main
```

Go to your repo's Actions tab - watch the deploy job run.

Then check:

```
# on the server
docker ps
docker logs <container_id>
```
