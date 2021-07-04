import { createContext } from 'react';

type ImageFileContextType = {
  setImageFile:(blob: Blob | File) => void,
}

export const ImageFileContext = createContext<ImageFileContextType>({
  setImageFile: () => {},
});
