# NextJS Library - Books Management System

A modern books management application with CRUD operations, file uploads, and responsive design.

## Features

- Complete books management with CRUD operations
- Book cover image upload and display
- Search and pagination functionality
- Authentication system with protected routes
- Responsive design with light/dark theme support
- Type-safe implementation with TypeScript and Zod validation
- Real-time state management with Redux Toolkit Query

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm (recommended package manager)
- Docker (optional)

### Installation

Clone this repository:

```
git clone https://github.com/nisibz/nextjs-library-tests.git
cd nextjs-library-tests
```

## Development Mode

### Local Setup

1. Install dependencies:

```
   pnpm install
```

2. Copy environment variables:

```
   cp .env.example .env
```

3. Start the development server:

```
   pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Development Setup

1. Create the required Docker network:

```
  docker network create library-network
```

2. Start the development containers:

```
  docker compose up -d
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

To stop the containers:

```
  docker compose down
```

## Production Mode

### Local Production Setup

1. Create an optimized production build:

```
   pnpm build
```

2. Start the production server:

```
   pnpm start
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

### Docker Production Setup

1. Build the production Docker image:

```
   docker build -t nextjs-library:prod -f Dockerfile.prod .
```

2. Run the production container:

```
   docker run -p 3000:3000 --name nextjs-library-prod nextjs-library:prod
```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Additional Commands

- `pnpm lint` - Run ESLint for code linting
- `pnpm format` - Format code with Prettier

## Technology Stack

- Next.js 15 - React framework with App Router and Turbopack
- React 19 - Frontend library
- TypeScript - Type-safe JavaScript
- Redux Toolkit Query - API state management
- Tailwind CSS v4 - Utility-first CSS framework
- shadcn/ui - Modern UI component library
- React Hook Form - Form handling with Zod validation
- Docker - Containerization
