/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_KLIPY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@fontsource/*';
declare module '@fontsource-variable/*';
declare module 'utif';
declare module 'imagetracerjs';
