# CineStream Backend

This directory contains the backend services for the CineStream application. It is built with Node.js and Express, using Redis for caching and session management, and connects to a MySQL database.

## Tech Stack

-   **Language:** Node.js
-   **Framework:** Express.js
-   **Database:** MySQL (via `mysql2`)
-   **Cache/Session:** Redis (via `ioredis`)
-   **Environment Management:** `dotenv`
-   **Development:** `nodemon`

## Setup Instructions

### Prerequisites

Ensure you have Node.js and npm/Yarn installed. Docker is also recommended for running Redis and MySQL locally.

### 1. Environment Variables

Create a `.env` file in this directory (`backend/.env`) based on the `.env.example` file.

```bash
cp .env.example .env
# Open .env and fill in your specific values, especially for database credentials and API keys.
```

**Important:** Never commit your actual `.env` file to Git! It is already ignored by `.gitignore`.

### 2. Install Dependencies

```bash
npm install # or yarn install
```

### 3. Database Setup

Ensure your MySQL server is running and accessible with the credentials provided in your `.env` file. You will need to create the `cinestream` database if it doesn't already exist.

### 4. Redis Setup

Ensure your Redis server is running. If using Docker Compose, it will be started automatically. For local setup, you can run Redis directly or via Docker.

### 5. Running the Backend

#### Development Mode

```bash
npm run dev
```
This will start the server using `nodemon`, which automatically restarts on file changes.

#### Production Mode

```bash
npm start
```

## API Endpoints

The backend exposes various API endpoints, typically under the `/api` prefix.

### Search Series/Movies

-   **Endpoint:** `GET /api/search`
-   **Description:** Searches for series or movies based on a query.
-   **Query Parameters:**
    -   `type`: (Required) Can be `series` or `movies`.
    -   `query`: (Required) The search term.
-   **Example Request (Frontend perspective):**
    ```
    GET http://localhost:5000/api/search?type=series&query=your_search_term
    ```
-   **Conceptual Backend Implementation (in `src/server.js` or a router file):**

    ```javascript
    // Assuming 'app' is your Express application instance
    // or 'router' if you're using express.Router() and mounting it at '/api'

    // Example if directly in src/server.js:
    // app.get('/api/search', async (req, res) => {

    // Example if using a router (e.g., in src/routes/media.js, then app.use('/api', mediaRouter)):
    // mediaRouter.get('/search', async (req, res) => {

    import express from 'express';
    const app = express(); // Or your existing app/router instance

    app.get('/api/search', async (req, res) => {
      const { type, query } = req.query;

      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required.' });
      }

      try {
        let results = [];
        if (type === 'series') {
          // TODO: Implement actual series search logic here.
          // This might involve:
          // 1. Querying your MySQL database for series matching 'query'.
          // 2. Making a request to an external API (like RapidAPI, using your RAPID_API_KEY).
          // Example placeholder:
          results = [{ id: 101, title: `Search result for series: ${query}`, show_type: 'series' }];
        } else if (type === 'movies') {
          // TODO: Implement actual movie search logic here.
          results = [{ id: 201, title: `Search result for movie: ${query}`, show_type: 'movie' }];
        } else {
          return res.status(400).json({ message: 'Invalid search type. Must be "series" or "movies".' });
        }

        res.json(results);
      } catch (error) {
        console.error('Backend search error:', error);
        res.status(500).json({ message: 'Internal server error during search.' });
      }
    });
    ```

### Other Endpoints

*(Add documentation for other API endpoints here as you develop them, e.g., `/api/movies`, `/api/series/:id`, `/api/auth/login`, etc.)*