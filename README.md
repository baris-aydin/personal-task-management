# TaskFlow – Full-Stack Personal Task Management App

TaskFlow is a full-stack task management web application built with **React + TypeScript** on the frontend and **Node.js/Express + MongoDB** on the backend. It supports **user signup/login** with **JWT authentication**, and stores tasks + lists per user in MongoDB.

## Features

- User registration & login (JWT auth)
- Multiple lists (Inbox, Personal, Work, Shopping + custom lists)
- Create tasks (title + optional notes + optional due date)
- Toggle task completion
- Delete tasks and lists
- Clean separation of frontend UI and backend REST APIs
- Data stored in MongoDB (local dev)

## Tech Stack

**Frontend**
- React + TypeScript + Vite
- React Router
- TanStack Query (provider ready)
- Minimal UI components + toaster

**Backend**
- Node.js + Express (TypeScript)
- MongoDB + Mongoose
- JWT authentication
- Zod validation
- bcrypt password hashing

---
