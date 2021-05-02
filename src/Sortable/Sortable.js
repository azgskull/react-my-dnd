import React, { useState } from "react";
import { context } from "../DnD/utilities";

export const Sortable = ({ children, sortEndHandler }) => {
  const [items, setItems] = useState([]);

  return (
    <context.Provider
      value={{
        items,
        setItems,
        sortEndHandler,
      }}
    >
      {children}
    </context.Provider>
  );
};
