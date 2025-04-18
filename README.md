# Travel Card App

This is a personal project that allows users to manage their travel cards, add new ones, update existing ones, and delete them. The app is built with a React frontend and a Node.js backend.

## Tech Stack
- **Frontend:** React, Axios
- **Backend:** Node.js, Express.js, MySQL
- **Authentication:** JWT (JSON Web Token)

## Features
- **User-specific content:** The app fetches user data from the backend using JWT to display user-specific travel cards.
- **Travel card management:** Users can add, update, and delete travel cards.
- **Image upload:** Users can upload images while adding or updating travel cards.

## Setup

### Backend Setup (`api` folder)
1. Install dependencies:
    ```bash
    cd api
    npm install
    ```

2. Run the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup (`web` folder)
1. Install dependencies:
    ```bash
    cd web
    npm install
    ```

2. Run the frontend server:
    ```bash
    npm run dev
    ```

## Current Issues
- **JWT Authentication:** The app fetches user-specific data using JWT for authentication, but the token is not being properly passed or verified in certain cases.

## To-do
- Fix the issue with JWT token validation not properly showing authenticated content.
