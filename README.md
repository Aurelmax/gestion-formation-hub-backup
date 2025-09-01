# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/20e0ff7e-5ef7-4b62-b354-231358b6ee6b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/20e0ff7e-5ef7-4b62-b354-231358b6ee6b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment variables

The application uses Prisma with a PostgreSQL database. The following environment variables must be available when running the project:

```bash
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>"

# Configuration NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:5173"

# Configuration JWT pour le backend Express
JWT_SECRET="your-jwt-secret"
PORT=5000
```

Create a `.env` file at the project root with these variables.

## Available Commands

This project includes several npm scripts to help with development and deployment:

```bash
# Start the frontend development server only
npm run dev

# Start both the frontend and backend authentication servers concurrently
npm run dev:auth

# Start only the backend authentication server


# Build the application for production
npm run build

# Build the application for development environment
npm run build:dev

# Run ESLint to check code quality
npm run lint

# Preview the production build locally
npm run preview
```

### Local development database setup

Make sure you have PostgreSQL installed and running locally. Then, set up your database and run the Prisma migrations:

```bash
# Apply the database migrations
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to manage your database
npx prisma studio
```

Prisma Studio provides a visual interface to view and edit your database at `http://localhost:5555`.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/20e0ff7e-5ef7-4b62-b354-231358b6ee6b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.
