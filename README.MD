# Skillova Form Task

A full-stack Django web application with React frontend where users can register, authenticate, and submit forms (feedback and contact). All application metrics — form submissions, uptime, user counts, request rates — are visualized in a live Grafana dashboard. The entire stack is containerized with Docker Compose and served via Caddy as a reverse proxy.

## Architecture

| Service    | Technology             | Role                                      |
|------------|------------------------|-------------------------------------------|
| Backend    | Django 5.2 + DRF       | REST API, JWT auth, Prometheus metrics    |
| Frontend   | React 18 + Vite        | SPA with Tailwind CSS                     |
| Caddy      | Caddy 2.8              | Reverse proxy, automatic HTTPS            |
| Prometheus | Prometheus v2.53       | Metrics scraping and storage              |
| Grafana    | Grafana 11.1           | Metrics visualization dashboards          |

## Features

- User registration and JWT-based authentication (access + refresh tokens)
- Two form types: Feedback (with rating and category) and Contact (with priority)
- Submission history per user
- Django admin panel for managing users and submissions
- Custom Prometheus metrics: submission counts, registered users gauge, API error tracking
- Pre-provisioned Grafana dashboard with 8 panels (request rate, latency percentiles, error rate, submissions, user counts)
- Caddy reverse proxy routing all services under a single port

## Project Structure

```
skillova-form-task/
├── backend/                  # Django application
│   ├── core/                 # Project settings and root URLs
│   │   └── settings/
│   │       ├── base.py       # Shared settings (apps, middleware, JWT config)
│   │       └── dev.py        # Development settings (SQLite, DEBUG=True)
│   ├── accounts/             # User model, registration, login, logout
│   ├── submissions/          # Feedback and Contact form models/views
│   ├── metrics/              # Custom Prometheus metrics, signals, exception handler
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React SPA
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── caddy/
│   └── Caddyfile             # Reverse proxy routing rules
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml    # Scrape config targeting Django backend
│   └── grafana/
│       ├── provisioning/     # Datasource and dashboard provider configs
│       └── dashboards/       # Pre-built dashboard JSON
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Local Setup (Docker Compose)

### Prerequisites

- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd skillova-form-task
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` as needed. Required variables:

   | Variable               | Description                          | Default                    |
   |------------------------|--------------------------------------|----------------------------|
   | `SECRET_KEY`           | Django secret key                    | `django-insecure-dev-key-change-in-production` |
   | `ALLOWED_HOSTS`        | Comma-separated allowed hosts        | `localhost,127.0.0.1`      |
   | `CORS_ALLOWED_ORIGINS` | Frontend origin for CORS             | `http://localhost:5173`    |

3. **Start all services**

   ```bash
   docker compose up -d
   ```

   This builds and starts all five services (Caddy, Frontend, Backend, Prometheus, Grafana) on a shared Docker network.

4. **Run database migrations** (first time only)

   ```bash
   docker compose exec backend python manage.py migrate
   ```

5. **Create a superuser** (optional, for admin access)

   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

6. **Access the application** — see [Accessing Services](#accessing-services) below.

### Stopping

```bash
docker compose down
```

To also remove volumes (resets all data):

```bash
docker compose down -v
```

## Local Development (Without Docker)

For iterating on code without rebuilding containers:

1. **Backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The Vite dev server proxies `/api` requests to `http://localhost:8000`.

3. **Makefile shortcuts**

   ```bash
   make install    # Install all dependencies
   make migrate    # Run Django migrations
   make seed       # Seed sample data
   make test       # Run Django tests
   ```

## Live Deployment

### Prerequisites

- A VPS or cloud instance (e.g., DigitalOcean, AWS EC2, Hetzner)
- A domain or subdomain with DNS pointing to the server's IP
- Docker and Docker Compose installed on the server

### Steps

1. **SSH into the server and clone the repo**

   ```bash
   ssh user@your-server-ip
   git clone <repository-url>
   cd skillova-form-task
   ```

2. **Configure environment for production**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file:
   - Set `SECRET_KEY` to a strong random value
   - Set `ALLOWED_HOSTS` to your domain (e.g., `app.yourdomain.com`)
   - Set `CORS_ALLOWED_ORIGINS` to `https://app.yourdomain.com`

3. **Update the Caddyfile for your domain**

   Edit `caddy/Caddyfile` and replace the site address with your domain:

   ```
   app.yourdomain.com {
       # ... existing route rules ...
   }
   ```

   Caddy will automatically provision and renew HTTPS certificates via Let's Encrypt.

4. **Update Grafana root URL**

   In `docker-compose.yml`, update the Grafana environment variable:

   ```yaml
   - GF_SERVER_ROOT_URL=https://app.yourdomain.com/grafana/
   ```

5. **Open required ports**

   Ensure ports 80 and 443 are open in your firewall for Caddy's HTTPS:

   ```bash
   ufw allow 80
   ufw allow 443
   ```

6. **Start the stack**

   ```bash
   docker compose up -d
   ```

7. **Run migrations**

   ```bash
   docker compose exec backend python manage.py migrate
   ```

8. **Create admin user**

   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

### Production Considerations

- **Database**: For production, swap SQLite to PostgreSQL by creating a `core/settings/prod.py` that overrides the database config:
  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': os.environ.get('DB_NAME', 'skillova'),
          'USER': os.environ.get('DB_USER', 'postgres'),
          'PASSWORD': os.environ.get('DB_PASSWORD'),
          'HOST': os.environ.get('DB_HOST', 'db'),
          'PORT': os.environ.get('DB_PORT', '5432'),
      }
  }
  ```
  Then set `DJANGO_SETTINGS_MODULE=core.settings.prod` in the compose file.

- **Static files**: Run `python manage.py collectstatic` and configure Caddy to serve them directly.

- **Security**: Set `DEBUG=False`, configure `SECURE_SSL_REDIRECT=True`, and use strong secrets.

## Accessing Services

All services are accessible through Caddy on a single port (80 locally, 443 in production):

| Service          | Local URL                          | Description                          |
|------------------|------------------------------------|--------------------------------------|
| Frontend (App)   | http://localhost/                   | React SPA — registration, login, forms |
| Django API       | http://localhost/api/               | REST API endpoints                   |
| Django Admin     | http://localhost/admin/             | Admin panel for managing data        |
| Grafana          | http://localhost/grafana/           | Metrics dashboard                    |
| Prometheus       | http://localhost/prometheus/        | Raw metrics query interface          |
| Prometheus Metrics | http://localhost/metrics          | Raw metrics endpoint (scraped by Prometheus) |

### Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| Grafana | admin    | admin    |

### API Endpoints

| Endpoint                      | Method | Description              | Auth Required |
|-------------------------------|--------|--------------------------|---------------|
| `/api/auth/register/`         | POST   | Register a new user      | No            |
| `/api/auth/login/`            | POST   | Login, get JWT tokens    | No            |
| `/api/auth/logout/`           | POST   | Logout, blacklist token  | Yes           |
| `/api/auth/token/refresh/`    | POST   | Refresh access token     | No            |
| `/api/auth/me/`               | GET    | Get current user info    | Yes           |
| `/api/submissions/feedback/`  | POST   | Submit feedback form     | Yes           |
| `/api/submissions/contact/`   | POST   | Submit contact form      | Yes           |
| `/api/submissions/my/`        | GET    | List user's submissions  | Yes           |
| `/api/submissions/my/<id>/`   | GET    | Get submission detail    | Yes           |

## Grafana Dashboard

The pre-provisioned dashboard ("Skillova Overview") includes:

1. **Request Rate** — HTTP requests per second by method
2. **Response Status Codes** — Breakdown of 2xx, 4xx, 5xx responses
3. **Request Latency** — p50, p95, p99 percentiles
4. **Submissions Created** — Counter by form type (feedback/contact)
5. **Total Registered Users** — Current gauge
6. **New Users Rate** — Registration rate over time
7. **API Errors by View** — Error count per endpoint
8. **Error Rate vs Total Requests** — Error ratio visualization

The dashboard JSON is committed at `monitoring/grafana/dashboards/skillova-overview.json` and auto-provisions on startup.

## Custom Prometheus Metrics

| Metric                        | Type    | Labels              | Description                    |
|-------------------------------|---------|---------------------|--------------------------------|
| `submissions_created_total`   | Counter | `type`              | Total form submissions         |
| `users_registered_total`      | Counter | —                   | Total user registrations       |
| `api_errors_total`            | Counter | `view`, `status_code` | API error count              |
| `registered_users_count`      | Gauge   | —                   | Current number of registered users |

## Tech Stack

- **Backend**: Python 3.12, Django 5.2, Django REST Framework, SimpleJWT, django-prometheus
- **Frontend**: React 18, Vite, Tailwind CSS 4, React Hook Form, Axios, React Router
- **Infrastructure**: Docker, Docker Compose, Caddy 2.8, Prometheus, Grafana
