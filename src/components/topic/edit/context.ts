import { createContext } from 'react';

// tslint:disable-next-line:variable-name
export const ImageFileContext = createContext<{
  setImageFile: (blob: Blob | File) => void,
}>({
  setImageFile: () => {
  },
});
