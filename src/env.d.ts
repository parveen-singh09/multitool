/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_KLIPY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// These packages ship no bundled type declarations.
declare module '@fontsource/*';
declare module '@fontsource-variable/*';
declare module 'utif';
declare module 'imagetracerjs';
