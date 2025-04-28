# COMP0067_2025_Team3

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Table of Contents

1. [Getting Started (Local Development)](#getting-started-local-development)
2. [SendGrid Integration](#sendgrid-integration)
3. [Azure Deployment](#azure-deployment)
   - [Azure Virtual Machine Setup](#31-azure-virtual-machine-setup)
   - [Azure Blob Storage Setup](#32-azure-blob-storage-setup)
   - [VM Connection and Docker Setup](#33-virtual-machine-connection-and-docker-setup)
   - [Application Deployment](#34-application-deployment)
   - [Verification and Troubleshooting](#35-verification-and-troubleshooting)

## Getting Started (Local Development)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## SendGrid Integration

1. **Create a SendGrid Account**

   - Go to https://sendgrid.com/ and sign up for a free account.

2. **Authenticate a Sender Email**

   - In the SendGrid dashboard, go to Email API > Sender Authentication
   - Under Single Sender Verification, click "Create a Sender"
   - Fill out the form:
     - From Name: (e.g. YourApp Support)
     - From Email: your personal or test email (e.g. you@example.com)
     - Reply-To Email: (can be the same as above)
   - You'll receive a confirmation email — verify it.
   - Note: Until domain authentication is set up (which we don't require for local dev), each teammate needs to use their own verified sender email.

3. **Generate an API Key**

   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Give it a name (e.g., local-dev-key)
   - Select Full Access or at least "Mail Send"
   - Click Create & Copy the key

4. **Add your key and sender email to a .env file**

   - In your project root, create a .env file (if it doesn't exist already), and add:

   ```
   SENDGRID_API_KEY=your-api-key-here
   SENDGRID_SENDER_EMAIL=your-verified-email@example.com
   ```

5. **Restart your dev server**
   - If it's already running, make sure to restart so the environment variables are loaded.

## Azure Deployment

This section provides instructions for deploying the application to Azure.

### 3.1 Azure Virtual Machine Setup

1. Navigate to Azure Portal and search for 'Virtual machine'
2. Click 'Create' and select 'Azure virtual machine'
3. Fill in the project details:
   - Subscription: Select your subscription
   - Resource group: Click 'Create new' to create a new one
4. Configure instance details:
   - Virtual machine name: Choose a name for your VM
   - Leave all other default settings unchanged
5. Set up administrator account:
   - Username: Create a username (make sure to remember this)
   - Password: Create a password that meets requirements (e.g., Team3-Spider!)
6. Configure inbound port rules:
   - Public inbound ports: Select 'Allow selected ports'
   - Select inbound ports: HTTP (80), HTTPS (443), SSH (22)
7. Click 'Review + create', then 'Create' to confirm and deploy


>
> **The Ubutun Sercer should be this:**
> ![Screenshot 2025-04-28 135759](https://github.com/user-attachments/assets/d0fada4c-9f34-4ddf-9cfe-e1a2e1ba7ce7)


> **⚠️ CHECKPOINT:** Record this important information:
>
> - Public IP address: (example: 20.77.24.37)
> - Administrative username: (example: team3)
> - Administrative password: (example: Team3-Spider!)

### 3.2 Azure Blob Storage Setup

1. Navigate to Azure Portal and search for 'Storage accounts'
2. Click 'Create'
3. Fill in the storage account details:
   - Subscription: Same as VM
   - Resource group: Same as VM
   - Storage account name: Choose a unique name (e.g., 0067team3demostorage)
   - Region: Same as VM
   - Use default settings for other options
4. Click 'Review + create', then 'Create' to confirm
5. Once created, navigate to the storage account
6. Create a storage container:
   - Click 'Containers' in the left menu
   - Click '+ Container'
   - Name: Enter a name (e.g., 0067team3demostorage-container)
   - Click 'Create'
7. Get the connection string:
   - Navigate to 'Security + networking' → 'Access keys'
   - Click 'Show' next to a connection string and copy it

> **⚠️ CHECKPOINT:** Record this important information:
>
> - Storage account name: (example: 0067team3demostorage)
> - Storage container name: (example: 0067team3demostorage-container)
> - Connection string: (Your full connection string)

### 3.3 Virtual Machine Connection and Docker Setup

#### Connecting to Your VM

1. Open PowerShell (Windows) or Terminal (macOS/Linux)
2. Connect using SSH with your credentials:
   ```bash
   ssh username@ip_address
   ```
   Replace `username` with your administrative username and `ip_address` with your VM's IP address
3. If connecting for the first time, type 'yes' when asked about host authenticity
4. Enter your password when prompted

#### Docker Installation

Execute the following commands one by one:

1. Remove any conflicting packages:

   ```bash
   for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
   ```

2. Update and install prerequisites:

   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates curl gnupg
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   ```

3. Add the repository to Apt sources:

   ```bash
   echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
   $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

4. Update package index:

   ```bash
   sudo apt-get update
   ```

5. Install Docker and related packages:
   
   ```bash
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose
   ```

    <details> <summary>Possible messages you will see after running the above code (and you can ignore it):</summary> <pre><code> E: Package 'docker-ce' has no installation candidate E: Unable to locate package docker-ce-cli E: Unable to locate package containerd.io E: Couldn't find any package by glob 'containerd.io' E: Couldn't find any package by regex 'containerd.io' E: Unable to locate package docker-buildx-plugin E: Unable to locate package docker-compose-plugin   </code></pre>
    </details>

   ```bash
   sudo apt install docker-compose
   ```

7. Verify installation:
   ```bash
   sudo docker run hello-world
   ```
   If successful, you'll see a message indicating that Docker is working correctly.

### 3.4 Application Deployment

#### Getting the Code

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/UCLComputerScience/COMP0067_2025_Team3.git
   ```

2. Navigate to the project directory:
   ```bash
   cd COMP0067_2025_Team3
   ```

#### Setting Up Environment Variables

1. Download the repository code to your local machine
2. Create a file named `.env.production` in the project root with the following content (replace with your values):

```
NEXT_PUBLIC_APP_URL=https://your-domain-name.cloudapp.azure.com
BASEPATH=
NODE_ENV=production
NEXTAUTH_URL=https://your-domain-name.cloudapp.azure.com/
NEXTAUTH_SECRET=L+tNhw7zwbUJF9OIG6n/xGGYWc0CO6kCIzRR+D3AAw0=

AZURE_STORAGE_ACCOUNT_NAME=your-storage-account-name
AZURE_STORAGE_CONTAINER_NAME=your-storage-container-name
AZURE_STORAGE_CONNECTION_STRING=your-connection-string

SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_SENDER_EMAIL=your-sender-email

POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=spider

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"
```

3. Replace all occurrences of the domain name in the project files:
   - Search for "team3docker.uksouth.cloudapp.azure.com"
   - Replace with your domain name (e.g., "team3demo.uksouth.cloudapp.azure.com")

#### File Transfer to VM

1. Install and set up an SFTP client (e.g., XFTP, FileZilla):

   - Download from [XFTP website](https://www.netsarang.com/en/free-for-home-school/) or your preferred source
   - Create a new session with:
     - Host: Your VM's IP address
     - Username: Your administrative username
     - Password: Your administrative password
   - Connect to the VM

2. Transfer the following files from your local machine to the VM:
   - `docker-compose.yml`
   - `docker-compose-init.yml`
   - `.env.production`
   - The entire `nginx/` folder

#### Deploying the Application

1. Navigate to the project directory on the VM:

   ```bash
   cd COMP0067_2025_Team3
   ```

2. Create the following volumes:

   ```bash
   sudo docker volume create --name=certbot-etc
   sudo docker volume create --name=certbot-www
   ```

3. Run the Docker Compose Init to get the certificate for the website (once success, press Ctrl + C to exit):

   ```bash
   sudo docker-compose -f docker-compose-init.yml up
   ```

4. Put the Docker Compose Init down once successfully get the cerficiate:

   ```bash
   sudo docker-compose -f docker-compose-init.yml down
   ```

5. Run Docker Compose to start the application (might take a long time to build):
   ```bash
   sudo docker-compose up -d --build
   ```

### 3.5 Verification and Troubleshooting

#### Verification

1. Check if containers are running:

   ```bash
   sudo docker ps
   ```

2. Access your application through a web browser:
   ```
   https://your-domain-name.cloudapp.azure.com
   ```

#### Troubleshooting

1. Check container logs:

   ```bash
   sudo docker logs [container_name]
   ```

2. Restart containers if needed:

   ```bash
   sudo docker-compose -f docker-compose.yml restart
   ```

3. Remove and recreate containers:
   ```bash
   sudo docker-compose -f docker-compose.yml down
   sudo docker-compose -f docker-compose.yml up -d
   ```
