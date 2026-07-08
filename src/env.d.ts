/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_KLIPY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
