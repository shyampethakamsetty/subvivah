# Subvivah.com

A Next.js-based matrimonial platform with advanced features including AI-powered matchmaking and Google authentication.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd subvivah.com
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_database_url

# Other configurations
NODE_ENV=development
```

### Google Authentication Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Configure the OAuth consent screen
6. Add the following authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/google`
   - For production: 
     - `https://subvivah.com/api/auth/google`
     - `https://www.subvivah.com/api/auth/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure

```
subvivah.com/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable components
│   ├── lib/         # Utility functions and configurations
│   └── types/       # TypeScript type definitions
├── public/          # Static assets
└── prisma/         # Database schema and migrations
```

## Features

- Google Authentication
- AI-Powered Matchmaking
- Profile Management
- Real-time Chat
- Horoscope Matching
- Face Verification
- Premium Membership

## Deployment

The application is configured for deployment on various platforms:

### Production Deployment

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm run start:prod
# or
yarn start:prod
```

Make sure to set the appropriate environment variables in your production environment.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/docs) - Database ORM
- [TailwindCSS](https://tailwindcss.com/docs) - Styling

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
