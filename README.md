This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Deploy

https://next-being.vercel.app/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Prerequisites

This project uses Prisma for database management and Vercel Blob for file storage. Follow the steps below to set up these dependencies.


### Database Setup with Prisma

1. **Install Prisma** (if not already installed):
   ```bash
   npm install prisma @prisma/client
   ```

2. **Set up the database**:
   - This project is configured to use PostgreSQL.
   - Set up your database and obtain the connection URL.
   - Copy `env.example` to `.env.local` and update the `DATABASE_URL` with your PostgreSQL connection string.

3. **Run Prisma migrations**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Test the database connection**:
   - Visit `http://localhost:3000/api/test-db` to verify the setup.

### File Storage with Vercel Blob

1. **Install Vercel Blob** (if not already installed):
   ```bash
   npm install @vercel/blob
   ```

2. **Set up Vercel Blob**:
   - Obtain a `BLOB_READ_WRITE_TOKEN` from your Vercel dashboard (under Storage > Blob).
   - Add the token to your `.env.local` file.

3. **Test the blob storage**:
   - Visit `http://localhost:3000/api/test-blob` to verify the setup.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
