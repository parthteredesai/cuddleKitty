# 🐾 Cuddle Kitty

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-success?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/FastAPI-AI-009688?style=for-the-badge&logo=fastapi">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb">
  <img src="https://img.shields.io/badge/Google-Gemini-blue?style=for-the-badge&logo=google">
  <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render">
</p>

<p align="center">
An AI-powered cat adoption platform that helps users find their ideal feline companion through intelligent matchmaking, AI-generated adoption descriptions, and an interactive chatbot.
</p>

---

# ✨ Features

- 🐱 Browse adoptable cats
- 🤖 PawBot AI chatbot powered by Google Gemini
- ❤️ AI-powered cat matchmaking questionnaire
- 📝 AI-generated adoption descriptions
- 🔐 Secure user authentication
- 📱 Responsive user interface
- ☁️ MongoDB Atlas integration
- ⚡ FastAPI AI microservice
- 🚀 Render cloud deployment

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- EJS Templates

## Backend

- Node.js
- Express.js

## AI Service

- FastAPI
- Google Gemini API

## Database

- MongoDB Atlas
- Mongoose

## Deployment

- Render

---

# 🧠 AI Features

## 🤖 PawBot AI Chatbot

PawBot helps users with:

- Cat care guidance
- Breed recommendations
- Adoption advice
- Feeding information
- General pet-related queries

---

## ❤️ AI Matchmaking

Users complete a lifestyle questionnaire.

The AI compares:

- Personality
- Lifestyle
- Home environment
- Budget
- Experience with pets
- Presence of children
- Existing pets

and recommends the **Top 5 most compatible cats**.

---

## 📝 AI Description Generator

Shelter owners can automatically generate attractive adoption descriptions using Google Gemini AI.

---

# 📂 Project Structure

```text
CuddleKitty/
│
├── controllers/
├── models/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── routes/
├── views/
│
├── python_scripts/
│   ├── app.py
│   ├── prompts.py
│   ├── requirements.txt
│   └── .env
│
├── server.js
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone the repository

```bash
git clone https://github.com/<your-username>/cuddlekitty.git

cd cuddlekitty
```

---

## Install Node.js dependencies

```bash
npm install
```

---

## Install Python dependencies

```bash
pip install -r python_scripts/requirements.txt
```

---

## Configure Environment Variables

### Node.js (.env)

```env
MONGO_URL=your_mongodb_connection
SESSION_SECRET=your_secret
FASTAPI_URL=http://127.0.0.1:8000
```

---

### FastAPI (.env)

```env
GEMINI_API_KEY=your_api_key
```

---

## Start Express Server

```bash
npm start
```

---

## Start FastAPI Server

```bash
cd python_scripts

uvicorn app:app --reload
```

---

# 💻 Screenshots

### Home Page

> Add screenshot here

---

### Kitty Listings

> Add screenshot here

---

### PawBot Chatbot

> Add screenshot here

---

### AI Matchmaking

> Add screenshot here

---

### Kitty Details

> Add screenshot here

---

# 📌 Future Improvements

- 💖 Wishlist / Favorites
- 📧 Email notifications
- 📊 Admin Dashboard
- 🐱 Image-based breed detection
- ❤️ Adoption request tracking
- 🌙 Dark Mode
- 🔔 Real-time notifications
- 📱 Progressive Web App (PWA)

---

# 📚 Tech Highlights

- MVC Architecture
- REST APIs
- Express.js Routing
- FastAPI AI Microservice
- Google Gemini Integration
- MongoDB Atlas
- Responsive Design
- Session-based Authentication


<p align="center">
Made with ❤️ for helping every kitty find a loving home 🐾
</p>
