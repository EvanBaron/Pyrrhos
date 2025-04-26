declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_TOKEN: string;
    TEST_GUILD: string | null;
    NODE_ENV: string;
  }
}
