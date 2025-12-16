# Macrology

A meal prep and macro tracking application with AI-powered meal suggestions.

## Tech Stack

- **Backend**: Node.js, TypeScript, Express, PostgreSQL
- **Frontend**: React, TypeScript, TailwindCSS
- **AI**: OpenAI/Anthropic API for chatbot
- **Cloud**: AWS (planned)

## Architecture

Microservices architecture with separate services for:

- Authentication
- Food Database
- Meal Management
- User Profiles
- AI Chatbot

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

**1. Install PostgreSQL and create database:**

```bash
# Create database
createdb macrology_dev

# Or using psql:
psql -U postgres
CREATE DATABASE macrology_dev;
```

**2. Set up environment variables:**

Create `.env` files in each service folder (`services/auth-service/.env`, etc.):

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/macrology_dev
PORT=3001  # 3002 for food-service, 3003 for meal-service, etc.
NODE_ENV=development
```

**3. Run migrations:**

```bash
cd database
npm install
node migrate.js
```

**4. Seed database with food data:**

```bash
cd database/seeds
node seed.js
```

To add your own foods:

1. Export Excel to CSV with columns: `name,category,protein_per_100g,carbs_per_100g,fat_per_100g,calories_per_100g`
2. Save as `database/seeds/foods.csv`
3. Run: `node csv-to-json.js` to convert to JSON
4. Run: `node seed.js` to insert into database

---

## 📦 Development

### Running Services

**Auth Service:**

```bash
cd services/auth-service
npm install
npm run dev
```

**Food Service:**

```bash
cd services/food-service
npm install
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run tests

---

## Status

🚧 In active development
