// HMR
declare const module: {
  hot?: {
    dispose: (callback?: () => void) => void;
    accept: (callback?: () => void) => void;
  };
};
