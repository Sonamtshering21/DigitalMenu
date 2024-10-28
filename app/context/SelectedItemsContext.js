'use client';  // Mark this file as a client component

import { createContext, useContext, useState } from 'react';

const SelectedItemsContext = createContext();

export const SelectedItemsProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => useContext(SelectedItemsContext);
