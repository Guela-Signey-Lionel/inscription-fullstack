# 🎓 PKFokam — Plateforme d'Inscription en Ligne

Application Full-Stack : Spring Boot (backend) + React/Vite (frontend) 
Workflow automatisé d'inscription académique avec messagerie, documents, paiement Stripe.

---

## Architecture

```
inscription-backend/    ← Spring Boot 3 (Java 21) — Port 8081
inscription-frontend/   ← React 18 + Vite + TypeScript — Port 3000
```

---

## Démarrage rapide

### 1. Base de données PostgreSQL

```bash
# Créer la base de données
psql -U postgres -c "CREATE DATABASE inscription_db;"
```

### 2. Backend Spring Boot

```bash
cd inscription-backend

# Variables d'environnement (ou modifier application.yml)
export DB_URL=jdbc:postgresql://localhost:5432/inscription_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export MAIL_USERNAME=votre-email@gmail.com
export MAIL_PASSWORD=votre-app-password
export JWT_SECRET=votre-secret-jwt-base64-minimum-32-chars

# Lancer
./mvnw spring-boot:run
# → http://localhost:8082
# → Swagger UI : http://localhost:8082/swagger-ui.html
```

### 3. Frontend React

```bash
cd inscription-frontend

# Installer les dépendances
npm install

# Copier et configurer l'env
cp .env .env.local
# Modifier VITE_API_BASE_URL si nécessaire

# Lancer en développement
npm run dev
# → http://localhost:3000
```

---

## Compte préconfiguré coté Admin

| Rôle      | Email                 | Mot de passe |
|-----------|-----------------------|--------------|
| Admin     | admin@pkfokam.edu     | Admin@1234   |


> Les comptes sont créés via le script SQL de seed ou via l'API `/auth/register`.

---

## API Endpoints principaux

| Module       | Méthode | Endpoint                               | Auth        |
|--------------|---------|----------------------------------------|-------------|
| Auth         | POST    | `/api/v1/auth/login`                   | Public      |
| Auth         | POST    | `/api/v1/auth/register`                | Public      |
| Auth         | POST    | `/api/v1/auth/verify-otp`              | Public      |
| Auth         | GET     | `/api/v1/auth/me`                      | JWT         |
| Auth         | PUT     | `/api/v1/auth/me`                      | JWT         |
| Auth         | POST    | `/api/v1/auth/change-password`         | JWT         |
| Inscriptions | POST    | `/api/v1/inscriptions`                 | CANDIDAT    |
| Inscriptions | PATCH   | `/api/v1/inscriptions/{id}`            | CANDIDAT    |
| Inscriptions | POST    | `/api/v1/inscriptions/{id}/soumettre`  | CANDIDAT    |
| Inscriptions | GET     | `/api/v1/inscriptions/mes-dossiers`    | CANDIDAT    |
| Inscriptions | GET     | `/api/v1/inscriptions`                 | ADMIN       |
| Inscriptions | POST    | `/api/v1/inscriptions/{id}/transition` | ADMIN       |
| Documents    | POST    | `/api/v1/documents/upload`             | CANDIDAT    |
| Documents    | GET     | `/api/v1/documents/inscription/{id}`   | JWT         |
| Documents    | PATCH   | `/api/v1/documents/{id}/statut`        | ADMIN       |
| Messages     | GET     | `/api/v1/messages/mes-conversations`   | CANDIDAT    |
| Messages     | GET     | `/api/v1/messages/conversations`       | ADMIN       |
| Messages     | POST    | `/api/v1/messages/conversations`       | CANDIDAT    |
| Messages     | POST    | `/api/v1/messages/envoyer`             | JWT         |
| Paiements    | POST    | `/api/v1/paiements/intent`             | CANDIDAT    |
| Admin        | GET     | `/api/v1/admin/stats`                  | ADMIN       |
| Admin        | GET     | `/api/v1/admin/export`                 | ADMIN       |
| Admin        | GET     | `/api/v1/admin/utilisateurs`           | SUPER_ADMIN |

---

## Migrations Flyway

| Version | Description |
|---------|-------------|
| V1 | Schéma initial (utilisateurs, inscriptions, documents, paiements, formations) |
| V2 | Module messagerie (conversations, messages) |

---

## Variables d'environnement backend

| Variable            | Description              | Défaut                                            |
|---------------------|--------------------------|---------------------------------------------------|
| `DB_URL`            | URL JDBC PostgreSQL      | `jdbc:postgresql://localhost:5432/inscription_db` |
| `DB_USERNAME`       | Utilisateur DB           | `postgres`                                        |
| `DB_PASSWORD`       | Mot de passe DB          | `postgres`                                        |
| `JWT_SECRET`        | Clé secrète JWT (Base64) | (défaut dev)                                      |
| `MAIL_USERNAME`     | Compte email SMTP        | `noreply@pkfokam.edu`                             |
| `MAIL_PASSWORD`     | Mot de passe SMTP        | `changeme`                                        |
| `STRIPE_SECRET_KEY` | Clé Stripe               | `sk_test_xxxx`                                    |
| `CORS_ORIGINS`      | Origines CORS autorisées | `http://localhost:5173,http://localhost:3000`     |
| `UPLOAD_PATH`       | Répertoire uploads       | `./uploads`                                       |

---

## Workflow des dossiers

```
BROUILLON → SOUMIS → EN_VALIDATION_DOC → DOCS_VALIDES
                                              ↓
                                       EN_VALIDATION_FIN
                                              ↓
                                    APPROUVE / REJETE
                          ↑
                 EN_ATTENTE_COMPLEMENT (retour possible)
```

---

## Technologies

**Backend**
- Spring Boot 3.3 / Java 21
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Flyway (migrations SQL)
- Stripe Java SDK
- Spring Mail (OTP)
- SpringDoc OpenAPI (Swagger)

**Frontend**
- React 18 + TypeScript
- Vite 5
- React Router v6
- Axios (HTTP client)
- React Hook Form + Zod
- Recharts (graphiques)
- TailwindCSS v4

