URL Shortener

This project is a URL shortening application built with React.js for the frontend, Node.js with Express for the backend, and MongoDB as the database. The entire project is deployed using Docker Compose.

🛠️ Installation and Running with Docker Compose

✅ Prerequisites

Docker and Docker Compose installed on your machine.

A .env file to store the MongoDB configuration.

📂 Project Structure

/project-root
│── frontend/         # React.js Code
│── backend/          # API with Node.js and Express
│── docker-compose.yml
│── README.md

📌 Installation Steps

1️⃣ Clone the repository

git clone https://github.com/salimdaoues/acrube
cd acrube

2️⃣ Update a .env file for MongoDB (in the root directory url-shortener-backend):

MONGO_URI=mongodb://mongo:27017/urlshortener

3️⃣ Start the application with Docker Compose

docker-compose up --build

4️⃣ Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

5️⃣ Stop the containers

docker-compose down

🖥️ API Endpoints

🔹 Shorten a URL

POST /shorten

Body (JSON):

{
  "originalUrl": "https://example.com",
  "expiredAt": "2025-12-31"
}

Response:

{
  "shortUrl": "http://localhost:5000/abc123"
}

🔹 Redirect to the Original URL

GET /:shortened_id

Example: GET http://localhost:5000/abc123

Redirects to https://example.com

🔹 Error Handling

Invalid URL → 400 Bad Request

URL Not Found → 404 Not Found

URL Expired → 400 Bad Request

🐳 docker-compose.yml Content

version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo:27017/urlshortener

  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:

🔥 Troubleshooting

❌ ERR_CONNECTION_RESET Error

Check if ports are exposed using docker ps

Check if Nginx is running inside the frontend container using docker logs <frontend_container_id>

Try curl -I http://localhost:3000

🎯 Future Improvements

Add a more modern user interface.

Implement an authentication system.

Add link shortening statistics.

🚀 Happy Coding!
