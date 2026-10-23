# 🚀 Task Manager App

A full-stack Task Manager application built using **React, Node.js, Express.js, and MongoDB**. It helps users organize their daily tasks, track progress, and manage their work through a clean and responsive interface.

## ✨ Features

- 🔐 **User Authentication** — Register and log in securely using JWT authentication.
- ➕ **Create Tasks** — Add new tasks with relevant details.
- 📋 **View Tasks** — View and manage your tasks from the dashboard.
- ✏️ **Edit Tasks** — Update existing task information.
- ✅ **Task Status Management** — Mark tasks as completed.
- 🗑️ **Delete Tasks** — Remove tasks you no longer need.
- 🔒 **Protected Routes** — Restrict task access to authenticated users.
- 📱 **Responsive UI** — Designed for a smooth experience across screen sizes.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Axios
- Lucide React
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## 📁 Project Structure

```text
Syntecxhub-Task-Manager-App/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Syntecxhub-Task-Manager-App
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder using `.env.example` as a template.

Configure the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
FRONTEND_URL=http://localhost:5173
```

Replace the example values with your own configuration. Never commit your actual `.env` file or database credentials to GitHub.

Start the backend server:

```bash
npm run dev
```

The API should run at:

`http://localhost:5000`

### 3. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

`http://localhost:5173`

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `FRONTEND_URL` | Frontend URL used by the backend configuration |

## 🔒 Security Notes

- Keep `.env` out of version control.
- Never publish database passwords, JWT secrets, or private credentials.
- Use a strong, unique JWT secret.
- Configure MongoDB Atlas Network Access appropriately.
- Use HTTPS and secure deployment settings when hosting the application.

## 🎯 Project Objective

The objective of this project is to develop a practical full-stack web application that demonstrates frontend development, REST API integration, database management, authentication, and CRUD operations.

## 👩‍💻 Author

**Your Name**

GitHub: [Your GitHub Profile](https://github.com/)

## 📄 License

This project is intended for educational and portfolio purposes. Add a license if you want to specify the terms under which others may use or modify your code.
