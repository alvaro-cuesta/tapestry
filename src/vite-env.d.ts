/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- we are merging into an interface
interface ImportMetaEnv {
  readonly GIT_COMMIT_SHORT_SHA: string;
}

// From vite.config.ts `define` section
declare const __DEBUG__: boolean;
declare const __PROFILE__: boolean;
