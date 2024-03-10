## Thank you for visiting Blendy!

Blendy is a website built with Next.js 14.

React + Tailwind 🎨🍃  
Prisma 🧊 
Clerk authentication 🐾
Firebase Storage 🔥

You may find the deployed production build by clicking the link in the about section (top-right of this page).

I named it Blendy because Blender is a great software and I don't have any brilliant ideas...

## Run Dev Server Locally

Fork / clone this repository to your own local environment. Or just download the files.

You will need to create a local .env file with the following variables:
```ini
# refer to: https://www.prisma.io/docs/orm/reference/connection-urls
# I'm using Supabase / Postgres, please change this accordingly
DATABASE_URL='your_url'
DIRECT_URL='your_url'

# Change this if you want to use a different port
NEXT_PUBLIC_BASE_URL=http://localhost:3000


# Change these two
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=get_this_from_clerk
CLERK_SECRET_KEY=get_this_from_clerk

# Don't touch
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboard
```

Then, run the development server (You will need to have Node.js installed of course, this is developed on Node v20.10.0):

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
