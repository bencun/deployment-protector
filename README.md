# Deployment Protector

Put a very simple password lock ok your Next.js v15 deployment(s).

**This will not protect you from code and content leaks by any means unlike Vercel's [own deployment protection](https://vercel.com/docs/security/deployment-protection). It's a very basic form of protection that doesn't work on infrastructure level.**

I needed this because I needed to hide the contents of one of my smaller projects on a production domain as well so I decided to build something that can do the job on a very basic level.

# Usage

Install:
```sh
$ pnpm add deployment-protector
```

Create two environment variables to store:
- `DP_SECRET_KEY` - the JWT secret
- `DP_PASSWORD` the password that will be used to auth the users

Consume the component in your root `layout.tsx` (or any other `layout.tsx`, for that matter):

```tsx
//...
import DeploymentProtector from 'deployment-protector';
//...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <DeploymentProtector>
          {children}
        </DeploymentProtector>
      </body>
    </html>
  );
}
```

## Configuration
Check the props that are exposed on `DeploymentProtector`.

## Known issues
Weird type mismatch could happen although `DeploymentProtector` is a valid React component and you might get:
```
Type 'bigint' is not assignable to type 'AwaitedReactNode'.ts(2786)
```
I suspect this is due to typing issues in React 19 or Next.js something (see [this](https://github.com/vercel/next.js/discussions/64753) and [this](https://github.com/vercel/next.js/discussions/67365)). If you run into it just put a `@ts-expect-error` on it or open up an issue/PR if you know how to resolve this.

# How it works etc

It loads up and runs a single server component that performs the followint checks:
- is the cookie there -> yes, does it contain a valid JWT ->yes, render children elements
- else render the login form and bind it to a server action that validates against the password and sets a JWT as a cookie

Maybe this would work better if it was implemented on a middleware level? Maybe I'll revisit it in the future and see about this.