// src/types/custom.d.ts
declare module '*.css' {
  interface CSSModule {
    [className: string]: string
  }
  const cssModule: CSSModule
  export default cssModule
}

// Or, a simpler version often sufficient for Next.js global CSS:
// declare module '*.css';