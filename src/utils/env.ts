export default function env (name: string, defaultValue?: string): string {
  
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (typeof defaultValue === 'string') {
    return defaultValue;
  }

  throw new TypeError(`Missing process.env.${name}`);

}
