# Portfolio Management System

A modern, full-stack developer portfolio website with a secure admin dashboard for managing skills, projects, and certifications.

## Features

- **Public portfolio pages** — Home, About, Skills, Projects, Certifications, Contact
- **Admin dashboard** — JWT authentication with full CRUD for skills, projects, and certifications
- **Cloudinary integration** — Image uploads for projects and certificates
- **MongoDB Atlas** — Persistent data storage with Mongoose
- **Premium UI** — Glassmorphism, animations (AOS), typing effect, dark/light mode
- **Responsive design** — Mobile, tablet, and desktop layouts

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript, EJS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt.js |
| Uploads | Cloudinary, Multer |

## Project Structure

```
portfolio-management-system/
├── server.js
├── config/          # Database & Cloudinary
├── controllers/     # MVC controllers
├── middleware/      # JWT auth middleware
├── models/          # Mongoose schemas
├── routes/          # Public & admin routes
├── public/          # CSS, JS, images
├── views/           # EJS templates
└── scripts/         # Seed scripts
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLOUDINARY_*` | Cloudinary cloud name, API key, secret |
| `ADMIN_*` | Default admin credentials for seeding |

### 3. Seed admin user & sample skills

```bash
npm run seed
```

### 4. Start the server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Visit **http://localhost:3000**

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/about` | About page |
| `/skills` | Skills listing |
| `/projects` | Projects with search |
| `/certifications` | Certifications |
| `/contact` | Contact form |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard with stats |
| `/admin/skills` | Manage skills |
| `/admin/projects` | Manage projects |
| `/admin/certifications` | Manage certifications |

Default admin credentials (after seeding):

- **Email:** `admin@portfolio.com`
- **Password:** `Admin@123`

## Customization

Update site details in `server.js` under `res.locals.site`:

```javascript
res.locals.site = {
  name: 'Your Name',
  role: 'Full Stack Developer',
  email: 'your.email@example.com',
  profileImage: '/images/profile.jpg',
  // ...
};
```

Place your profile photo at `public/images/profile.jpg` and your resume at `public/files/resume.pdf`.

## License

ISC
