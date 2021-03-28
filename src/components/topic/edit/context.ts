import { createContext } from 'react';

export const ImageFileContext = createContext<{
  setImageFile:(blob: Blob | File) => void;
    }>({
      setImageFile: () => {},
    });
