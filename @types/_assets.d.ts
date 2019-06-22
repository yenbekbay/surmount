declare module '*.png' {
  const path: string;

  export = path;
}

declare module '*.svg' {
  const content: string;

  export = content;
}
