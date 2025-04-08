# Setup Instructions for PredictYourDay Appp

This guide explains how to set up the PredictYourDay app, pull its Docker image, serve it locally or on a server, configure a domain, set up a reverse proxy with Nginx, and secure the application with HTTPS using SSL certificates.

---

## **1. Pull the Docker Image and Create a Container**

The Docker image for this app is publicly available on Docker Hub with the name `predictyourday:v1`. Follow these steps to pull the image and create a container:

### **Steps**:
1. Pull the Docker image:
   ```bash
   docker pull predictyourday:v1
   ```

2. Create and run a container:
   ```bash
   docker run -d --restart unless-stopped -p 3000:3000 predictyourday:v1
   ```

3. Verify the container is running:
   ```bash
   docker ps
   ```
   The app will now be accessible at `localhost:3000` or `http://<server-ip>:3000`.

---

## **2. Configure a Domain for the App**

To use a custom domain (e.g., `predictyourday.xyz`) instead of accessing the app via the IP and port, follow these steps:

### **Steps**:
1. **Buy a Domain**:
   - Purchase a domain from a registrar like GoDaddy.

2. **Set DNS Records**:
   - Go to your domain registrar’s DNS management section.
   - Create an **A Record**:
     - **Type**: `A`
     - **Name**: `@`
     - **Points to**: Your server’s public IP address (e.g., `54.91.9.221`).
   - Create a **CNAME Record** (optional for `www` subdomain):
     - **Type**: `CNAME`
     - **Name**: `www`
     - **Points to**: `predictyourday.xyz`.

3. Wait for DNS propagation (this may take up to 24-48 hours, but is often faster).

At this stage, the domain will direct traffic to your server's IP, but the app will still be served on **port 3000** (e.g., `http://predictyourday.xyz:3000`).

---

## **3. Set Up Nginx as a Reverse Proxy**

To make the app accessible on the default HTTP port (**80**) without specifying port 3000 in the URL, configure Nginx as a reverse proxy.

### **Steps**:
1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

2. **Configure Nginx**:
   - Open the default Nginx configuration file or create a new one:
     ```bash
     sudo nano /etc/nginx/conf.d/predictyourday.conf
     ```

   - Add the following configuration:
     ```nginx
     server {
         listen 80;
         server_name predictyourday.xyz www.predictyourday.xyz;

         location / {
             proxy_pass http://localhost:3000;  # Forward traffic to the app
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```

3. **Test and Restart Nginx**:
   - Test the configuration:
     ```bash
     sudo nginx -t
     ```
   - Restart Nginx:
     ```bash
     sudo systemctl restart nginx
     ```

4. Verify that `http://predictyourday.xyz` now serves the app without specifying port 3000.

---

## **4. Add SSL Certificate for HTTPS**

By default, the app serves over HTTP, which is not secure. To secure the app with HTTPS, use **Let’s Encrypt** to obtain a free SSL certificate.

### **Steps**:
1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain an SSL Certificate**:
   Run the following command to obtain a certificate for your domain:
   ```bash
   sudo certbot --nginx -d predictyourday.xyz -d www.predictyourday.xyz
   ```
   - Enter your email address and agree to the terms of service.
   - Certbot will automatically configure Nginx to use HTTPS.

3. **Test the HTTPS Setup**:
   - Visit `https://predictyourday.xyz` to verify that the app is served securely.

4. **Enable Automatic Renewal**:
   - Certbot sets up automatic renewal for the SSL certificate.
   - You can test the renewal process with:
     ```bash
     sudo certbot renew --dry-run
     ```

---

## **Summary of Setup Steps**

1. Pull the Docker image from Docker Hub and run the container on port 3000.
2. Configure a domain with DNS records pointing to the server’s IP.
3. Install Nginx and set up a reverse proxy to forward traffic from port 80 to 3000.
4. Secure the app with HTTPS using Let’s Encrypt and Certbot.

By following these steps, you’ll have the PredictYourDay app running securely with a custom domain.

---

Let me know if you have questions, contact @mrakbg - Telegram, instagram
