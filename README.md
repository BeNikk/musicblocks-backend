# musicblocks-backend

Empowering students with Git through Musicblocks

> **This project is being developed as part of Sugar Labs Google Summer of Code (GSoC) 2025.**

## Overview

**musicblocks-backend** is a Node.js/Express backend that enables users to create and manage Musicblocks projects, leveraging GitHub repositories for storage and collaboration. It automates repository creation, metadata management, and secure access using GitHub Apps.

## Features

- **Create Musicblocks Projects:** Automatically creates a new GitHub repository for each project.
- **Metadata & Project Data:** Stores project data and metadata as JSON files in the repository.
- **Secure Access:** Uses GitHub App authentication and JWT for secure API access.
- **REST API:** Simple endpoints for project creation and management.
- **TypeScript:** Written in TypeScript for type safety and maintainability.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A registered [GitHub App](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app)
- A GitHub organization to own the repositories

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/BeNikk/musicblocks-backend.git
   cd musicblocks-backend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   GITHUB_APP_ID=your_github_app_id
   GITHUB_APP_CLIENT_ID=your_github_app_client_id
   ORG_NAME=your_github_org_name
   GITHUB_INSTALLATION_ID=your_github_installation_id
   ```

   Place your GitHub App's private key as `src/config/private-key.pem`.

4. **Build the project:**

   ```sh
   npm run build
   ```

5. **Start the server:**

   ```sh
   npm start
   ```

   The server will run on the port specified in `.env` (default: 3000).

## API Endpoints

### Create a Project

**POST** `/api/github/create`

**Request Body:**

```json
{
  "repoName": "my-musicblocks-project",
  "projectData": { ... },
  "theme": "art"
}
```

**Response:**

```json
{
  "success": true,
  "key": "generated-access-key"
}
```

- Creates a new repository in your GitHub organization.
- Stores `projectData.json` and `metaData.json` in the repo.
- Returns a unique access key for the project.

## Project Structure

```
src/
  config/         # GitHub App config and private key
  controllers/    # Express route handlers
  middleware/     # (for future use)
  routes/         # Express routers
  services/       # GitHub API integration
  types/          # TypeScript types
  utils/          # Utility functions (JWT, hashing, etc.)
dist/             # Compiled output
```

## Development

- **Linting:**  
  Uses ESLint with TypeScript support.

  ```sh
  npx eslint .
  ```

- **Building:**  
  Compiles TypeScript to `dist/`.
  ```sh
  npm run build
  ```

## Security

- **Private Key:**  
  Never commit your GitHub App private key. It should be in `src/config/private-key.pem` and listed in `.gitignore`.

- **Environment Variables:**  
  Store sensitive credentials in `.env`.

## License

Music Blocks Git backend is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html), which means it will always be free to copy, modify, and hopefully improve. We respect your privacy: This project does not and will never access these data for purposes other than to restore your session and will never share these data with any third parties.

---

**Contributions welcome!**  
Feel free to open issues or pull requests to improve this project.
