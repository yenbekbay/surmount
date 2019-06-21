// node environment
declare const require: (id: string) => any;
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

// HMR
declare const module: {
  hot?: {
    dispose: (callback?: () => void) => void;
    accept: (callback?: () => void) => void;
  };
};
