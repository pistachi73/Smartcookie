// Re-export server and client loaders

export type { ClientLoaderProps } from "./client-loader";
// For backward compatibility, export the original Loader that auto-detects environment
// Note: This should only be used in client components due to React Aria dependency
export { ClientLoader, ClientLoader as Loader } from "./client-loader";
// Re-export primitives and shared utilities
export { DEFAULT_SPINNER, LOADERS, type LoaderVariant } from "./primitives";
export type { ServerLoaderProps } from "./server-loader";
export { ServerLoader } from "./server-loader";
export { type LoaderVariantProps, loaderStyles } from "./shared/styles";
