export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      REACT_APP_API_BASE_URL: string;
    }
  }
}
