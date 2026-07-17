# Portfolio Backend & Admin System

A lightweight, secure, and production-ready Express.js and MySQL backend system designed for the [dhiraj-portfolio](https://www.dhirajroy.com) website. Optimized for deployment on Oracle Cloud Always Free VM (Ubuntu, 1 OCPU, 1GB RAM) with automated email notifications, token rotation authentication, and a responsive admin console.

---

## Folder Structure

```text
backend/
├── server.js                  # App runner & Graceful Shutdown handler
├── ecosystem.config.js        # PM2 process configuration for 1GB RAM limits
├── package.json               # Dependencies and scripts
├── .env                       # Local environment variables
├── .env.example               # Environment variables template
├── .gitignore                 # Version control exclusions
│
├── database/
│   ├── schema.sql             # MySQL schema definitions with indexes & constraints
│   └── seed.js                # CLI Seeder for superadmin profile & settings
│
└── src/
    ├── app.js                 # App configuration & security middleware pipeline
    ├── config/
    │   ├── database.js        # Database connection pool (mysql2/promise)
    │   ├── mail.js            # Nodemailer transporter verification
    │   ├── jwt.js             # Token secrets and expiries
    │   ├── cors.js            # Origins whitelist config
    │   └── rateLimit.js       # Action-specific rate limits (express-rate-limit)
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── contact.controller.js
    │   └── dashboard.controller.js
    ├── services/
    │   ├── auth.service.js
    │   ├── contact.service.js
    │   └── email.service.js
    ├── repositories/
    │   ├── admin.repository.js
    │   ├── contact.repository.js
    │   └── reply.repository.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── contact.routes.js
    │   └── admin.routes.js
    ├── middleware/
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   ├── validation.middleware.js
    │   └── requestId.middleware.js
    ├── validators/
    │   ├── contact.validator.js
    │   └── login.validator.js
    └── utils/
        ├── response.js        # Standardized JSend API responses
        └── logger.js          # Request-correlated logger using AsyncLocalStorage
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

| Variable | Description | Example (Development) | Example (Production) |
|---|---|---|---|
| `PORT` | Node server listening port | `5000` | `5000` |
| `NODE_ENV` | Application environment mode | `development` | `production` |
| `CLIENT_URL` | Portfolio domain URL | `http://localhost:5000` | `https://www.dhirajroy.com` |
| `ADMIN_URL` | Admin Panel domain URL | `http://localhost:5000` | `https://admin.dhirajroy.com` |
| `API_URL` | Express API domain URL | `http://localhost:5000` | `https://api.dhirajroy.com` |
| `DB_HOST` | MySQL hostname | `127.0.0.1` | `localhost` |
| `DB_PORT` | MySQL listening port | `3306` | `3306` |
| `DB_NAME` | MySQL database name | `portfolio_db` | `portfolio_db` |
| `DB_USER` | MySQL database user | `root` | `portfolio_user` |
| `DB_PASSWORD` | MySQL database password | `""` (empty) | `your_secure_password` |
| `JWT_SECRET` | Secret key for access token | `dev_access_secret_123` | `use_strong_random_hash_access` |
| `JWT_REFRESH_SECRET` | Secret key for refresh token | `dev_refresh_secret_456` | `use_strong_random_hash_refresh` |
| `SMTP_HOST` | SMTP server address | `smtp.gmail.com` | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` | `587` |
| `SMTP_USER` | SMTP username | `user@gmail.com` | `notifications@dhirajroy.com` |
| `SMTP_PASS` | SMTP app password | `your_app_pass` | `app_specific_secure_pass` |
| `ADMIN_EMAIL` | Admin email to receive messages | `dheerajkumar.ara1111@gmail.com`| `dheerajkumar.ara1111@gmail.com`|

---

## Local Installation Guide

### Prerequisites
- Node.js LTS (v20+)
- MySQL Server (v8+)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Local Database
Launch your MySQL shell and create the database:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Import the schema:
```bash
mysql -u root -p portfolio_db < database/schema.sql
```

### 3. Create Admin Account
Run the interactive CLI seeding script to create the database superadmin and populate site configurations:
```bash
npm run seed
```
You will be prompted to enter the Admin Name, Email, and Password.

### 4. Run Development Server
```bash
npm run dev
```
The server will start on port `5000`. You can visit health check routes:
- Server Check: `http://localhost:5000/api/v1/health`
- Database Check: `http://localhost:5000/api/v1/health/db`
- Email Check: `http://localhost:5000/api/v1/health/mail`

---

## API Documentation

All API responses return the standard JSON format:
- **Success**: `{ "status": "success", "message": "...", "data": { ... } }`
- **Error**: `{ "status": "error", "message": "...", "errors": [ ... ] }`

### Public Endpoints
- **GET** `/api/v1/health` - Check API server status.
- **GET** `/api/v1/health/db` - Check MySQL connection pool.
- **GET** `/api/v1/health/mail` - Check Nodemailer SMTP transport.
- **POST** `/api/v1/contact` - Submit contact form.
  - Body parameters:
    ```json
    {
      "full_name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 555-0199",
      "subject": "System Integration Proposal",
      "message": "Hi Dhiraj, let's collaborate on a Spring Boot project."
    }
    ```

### Admin Auth Endpoints
- **POST** `/api/v1/admin/login` - Authenticate admin credentials. Returns access token in payload and stores rotate refresh token in an HTTP-only cookie.
  - Body: `{ "email": "admin@domain.com", "password": "secure_password" }`
- **POST** `/api/v1/admin/refresh` - Refresh access token using the HTTP-only refresh cookie. Returns new access token.
- **POST** `/api/v1/admin/logout` - Clear refresh cookie and log logout activity.
- **GET** `/api/v1/admin/profile` - Get logged-in admin data. (Requires `Authorization: Bearer <token>`).

### Admin Management Endpoints
All management routes require `Authorization: Bearer <token>` header:
- **GET** `/api/v1/admin/dashboard` - Get counters, periodic volume stats, and 5 recent messages.
- **GET** `/api/v1/admin/messages` - Query, filter, search, and paginate message inbox.
  - Query parameters (optional): `page=1`, `limit=10`, `status=NEW`, `search=John`, `sortBy=created_at`, `sortOrder=DESC`.
- **GET** `/api/v1/admin/messages/:id` - Fetch single contact message details and complete replies thread history. (Automatically marks `NEW` messages as `READ`).
- **PATCH** `/api/v1/admin/messages/:id/read` - Mark message status as `READ`.
- **PATCH** `/api/v1/admin/messages/:id/archive` - Mark message status as `ARCHIVED`.
- **PATCH** `/api/v1/admin/messages/:id/reply` - Send reply email and log history.
  - Body: `{ "reply_message": "Hello, thank you for reaching out! Let's arrange a call." }`
- **DELETE** `/api/v1/admin/messages/:id` - Move message to trash (sets status to `DELETED` and flags `deleted_at`).

---

## cURL Testing Examples

### 1. Submit Public Contact Form
```bash
curl -X POST http://localhost:5000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Freelance Inquiry",
    "message": "Hi, I need a lightweight backend created using Node and Express."
  }'
```

### 2. Admin Login
```bash
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "your_email@gmail.com",
    "password": "your_password"
  }'
```
*(Note: `-c cookies.txt` saves the HTTP-only refresh token cookie locally)*

### 3. Get Dashboard Metrics (Auth Required)
```bash
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Send Email Reply to Visitor (Auth Required)
```bash
curl -X PATCH http://localhost:5000/api/v1/admin/messages/1/reply \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reply_message": "Hello Jane, I would be happy to work with you on this project."
  }'
```

### 5. Refresh Access Token (Cookie Required)
```bash
curl -X POST http://localhost:5000/api/v1/admin/refresh \
  -b cookies.txt \
  -c cookies.txt
```

---

## Production Deployment Guide (Oracle Cloud Ubuntu)

Follow these steps to deploy on a clean Oracle Cloud Free Tier Ubuntu Instance.

### 1. DNS Subdomain Configurations
Configure the following records in your DNS provider (e.g. Cloudflare):
- `www.dhirajroy.com` -> `A` record pointing to VM Public IP
- `admin.dhirajroy.com` -> `A` record pointing to VM Public IP
- `api.dhirajroy.com` -> `A` record pointing to VM Public IP
- `dhirajroy.com` -> `A` record pointing to VM Public IP

### 2. Set Up Ubuntu VM
Connect to your VM using SSH:
```bash
ssh -i key.key ubuntu@YOUR_VM_IP
```
Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Install Node.js LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Verify version:
```bash
node -v
npm -v
```

### 4. Install & Secure MySQL Server
```bash
sudo apt install mysql-server -y
```
Secure the installation:
```bash
sudo mysql_secure_installation
```
Log into MySQL:
```bash
sudo mysql
```
Configure database credentials:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Import schema:
Clone your repository to the VM, navigate to `backend/` and run:
```bash
mysql -u portfolio_user -p portfolio_db < database/schema.sql
```

### 5. Deploy App & Setup Environment
Clone your repository, create `/var/www/dhirajportfolio` and move your files there:
```bash
sudo mkdir -p /var/www/dhirajportfolio
sudo chown -R ubuntu:ubuntu /var/www/dhirajportfolio
```
Under `/var/www/dhirajportfolio/backend`, create `.env` using `.env.example` configurations and fill in details:
```bash
nano .env
```
Run seeder to populate tables and credentials:
```bash
npm run seed
```

### 6. Configure PM2 (Process Manager)
Install PM2 globally:
```bash
sudo npm install pm2 -g
```
Start the application using ecosystem rules:
```bash
pm2 start ecosystem.config.js --env production
```
Configure PM2 to startup automatically on system reboot:
```bash
pm2 startup systemd
```
*(Copy and run the command printed by the terminal to finalize daemon registry)*

Save the active PM2 process list:
```bash
pm2 save
```

### 7. Install & Configure Nginx
```bash
sudo apt install nginx -y
```
Create a virtual host configuration file:
```bash
sudo nano /etc/nginx/sites-available/dhirajroy
```
Paste the following configurations:
```nginx
# 1. Main Static Portfolio
server {
    listen 80;
    server_name dhirajroy.com www.dhirajroy.com;
    root /var/www/dhirajportfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 2. Admin Dashboard Frontend
server {
    listen 80;
    server_name admin.dhirajroy.com;
    root /var/www/dhirajportfolio/admin;
    index login.html;

    location / {
        try_files $uri $uri/ /login.html;
    }
}

# 3. Backend API Gateway
server {
    listen 80;
    server_name api.dhirajroy.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the virtual host:
```bash
sudo ln -s /etc/nginx/sites-available/dhirajroy /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Set Up Let's Encrypt SSL
Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```
Obtain and configure SSL certificates:
```bash
sudo certbot --nginx -d dhirajroy.com -d www.dhirajroy.com -d admin.dhirajroy.com -d api.dhirajroy.com
```
Follow prompts to complete SSL configuration. Certbot automatically schedules cron timers to handle renewal.

### 9. Firewall Configuration (UFW)
Configure VM firewalls to support traffic:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
On the Oracle Cloud console, navigate to your instance Subnet page under **Security Lists** and add ingress rules:
- Destination Port: `80`, Protocol: `TCP`
- Destination Port: `443`, Protocol: `TCP`
