import { createContext, useState } from 'react';

const initialState = {
  pageIndex: -1,
  allPageAttachments: [],
  pageAttachments: [],
};

export const AttachmentContext = createContext(null);

const AttachmentProvider = ({ children }) => {
  const [store, setStore] = useState(initialState);
  return (
    <AttachmentContext.Provider value={{ store, setStore }}>{children}</AttachmentContext.Provider>
  );
};

export default AttachmentProvider;
