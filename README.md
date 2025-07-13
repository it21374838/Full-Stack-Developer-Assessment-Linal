# Full-Stack-Developer-Assessment-Linal
Role based online learning platform developed with MERN Stack technology
# Online Learning Platform – MERN Stack Learning Platform with GPT Integration

Online Learning Platform is a full-featured online learning platform built with the **MERN stack** and enhanced with **ChatGPT integration**. It allows students to discover and enroll in courses while enabling instructors to manage content and track enrollments. Students can also get personalized course suggestions using OpenAI's GPT API.

---

## 📚 Features

### 👨‍🎓 Students
- 🔐 Register/Login
- 📘 View all available courses
- ✅ Enroll in courses
- 🧾 Track enrolled courses


### 👩‍🏫 Instructors
- 🔐 Register/Login
- ➕ Create new courses
- ✏️ Edit or delete existing courses
- 📋 View enrolled students per course
- 📊 Dashboard with statistics

## ⚙️ Project Setup

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/it21374838/Full-Stack-Developer-Assessment-Linal.git
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# server/.env
MONGO_URI=mongodb+srv://linaldaksitha48:yXbWNQEryynwGbUp@onlineplatform.uslarjm.mongodb.net/?retryWrites=true&w=majority&appName=OnlinePlatform
JWT_SECRET=supersecretjwtkey
PORT=5000

#to run Backend
cd server
npm run dev
#to run frontend
cd client
npm start




