'use server';

import React, { CSSProperties } from 'react';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type StylableElements = 'form' | 'heading' | 'message' | 'input' | 'button';

const DefaultStyles: Record<StylableElements, CSSProperties> = {
  form: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  button: {
    padding: '8px',
  },
  heading: {},
  input: {},
  message: {},
};

type Props = {
  children: React.ReactNode
  secretKey: string;
  password: string;
  // Defaults to true
  secure?: boolean;
  // Defaults to 'none' if 'secure === true', otherwise to 'lax'
  sameSite?: true | false | "lax" | "strict" | "none" | undefined;
  // Defaults to 'deployment-protector'
  cookieName?: string;
  // Defaults to 86400 (24h). Value in seconds.
  maxAge?: number;
  // styling of elements
  styles?: Partial<Record<StylableElements, CSSProperties>>;
  classNames?: Partial<Record<StylableElements, string>>;
};
export default async function DeploymentProtector({
  children,
  secretKey,
  password,
  cookieName = 'deployment-protector',
  secure = true,
  sameSite = secure ? 'none' : 'lax',
  maxAge = 86400,
  styles = {},
  classNames = {},
}: Props) {
  const c = await cookies();

  console.log({sameSite, secure})
  
  if (c.has(cookieName)) {
    const {value} = c.get(cookieName)!;
    try {
      const token = jwt.verify(value, secretKey);
      if (token) {
        return children;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // nothing to handle
    }
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const pw = formData.get('password');
    if (typeof pw === 'string') {
      const trimmedPw = pw.trim();
      if (trimmedPw === password) {
        const c = await cookies();
        const jwtString = jwt.sign({}, secretKey, {expiresIn: maxAge});
        c.set(cookieName, jwtString, {httpOnly: true, secure, sameSite, maxAge});
      }
    }
    return redirect('/');
  }
 

  const finalStyles: Record<StylableElements, CSSProperties> = {
    form: styles.form ??
      (classNames.form ? {} : DefaultStyles.form),
    heading: styles.heading ??
      (classNames.heading ? {} : DefaultStyles.heading),
    message: styles.message ??
      (classNames.message ? {} : DefaultStyles.message),
    input: styles.input ??
      (classNames.input ? {} : DefaultStyles.input),
    button: styles.button ??
      (classNames.button ? {} : DefaultStyles.button),
  };
  
  return <form action={handleSubmit} style={finalStyles.form} className={classNames.form}>
    <h1 style={finalStyles.heading} className={classNames.heading}>Deployment Protected</h1>
    <p style={finalStyles.message} className={classNames.message}>You are unauthorized</p>
    <input style={finalStyles.input} className={classNames.input} type="text" name="password" id="password"></input>
    <button type="submit" style={finalStyles.button} className={classNames.button}>Submit</button>
  </form>
}