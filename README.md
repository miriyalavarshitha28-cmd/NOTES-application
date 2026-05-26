# Notes Application

A full-stack Notes Management Application built using Angular, NestJS, PostgreSQL, and TypeORM. The application allows users to create, edit, delete, search, and pin notes while providing a modern and responsive user interface with dark mode support and speech-to-text functionality.

---

## Features

### Authentication

* User Registration
* User Login
* User Logout
* User Profile Management

### Notes Management

* Create Notes
* View Notes
* Edit Notes
* Delete Notes
* Pin and Unpin Notes
* Search Notes
* Notes sorted with pinned notes appearing first

### User Experience

* Responsive Design
* Dark Mode / Light Mode Toggle
* Modern UI with Gradient Styling
* Real-Time Updates
* Speech-to-Text Note Creation using Web Speech API

### Backend Features

* RESTful API Architecture
* NestJS Framework
* PostgreSQL Database
* TypeORM Integration
* DTO-Based Validation
* Modular Backend Structure

---

## Tech Stack

### Frontend

* Angular 21
* TypeScript
* Angular Signals
* Angular Router
* Angular Forms
* HTML5
* CSS3

### Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* bcrypt

### Tools

* Git
* GitHub
* VS Code
* Postman

---

## Project Architecture

### Frontend Structure

src/

├── login/

├── signup/

├── notes/

├── note/

├── profile/

├── settings/

├── services/

├── app.routes.ts

└── main.ts

### Backend Structure

backend/src/

├── users/

├── notes/

│ ├── dto/

│ ├── note.entity.ts

│ ├── notes.controller.ts

│ ├── notes.service.ts

│ └── notes.module.ts

├── app.module.ts

└── main.ts

---

## Database Schema

### Users Table

| Column   | Type   |
| -------- | ------ |
| id       | UUID   |
| name     | String |
| email    | String |
| password | String |

### Notes Table

| Column | Type    |
| ------ | ------- |
| id     | UUID    |
| userId | UUID    |
| text   | String  |
| date   | String  |
| pinned | Boolean |


## API Endpoints

### Users

POST /users

POST /users/login

GET /users

GET /users/email/:email

### Notes

POST /notes

GET /notes?userId=:userId

GET /notes/:id

PUT /notes/:id

DELETE /notes/:id

## Installation

### Frontend

```bash
npm install
ng serve
```

Application runs on:

```text
http://localhost:4200
```

### Backend

```bash
cd backend

npm install

npm install bcrypt

npm install --save-dev @types/bcrypt

npm run start:dev
```

Backend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

Create a .env file inside the backend folder.

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Kavya@2004
DB_NAME=notesapp
```

---

## Future Enhancements

* Categories and Tags
* Note Sharing
* File Attachments
* Rich Text Editor
* Email Notifications
* Note Export to PDF
* Real-Time Collaboration

---

## Security

* Passwords are securely stored using bcrypt hashing before being saved to the database.

## Learning Outcomes

This project demonstrates:

* Full-Stack Development
* Angular Standalone Components
* Angular Signals
* NestJS Architecture
* REST API Development
* PostgreSQL Integration
* TypeORM ORM Mapping
* Authentication Workflows
* CRUD Operations
* Responsive UI Design
* Speech-to-Text Integration

---
GitHub:
https://github.com/miriyalavarshitha28-cmd
