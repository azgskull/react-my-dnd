import { useState } from "react";
import { context } from "./utilities";

export const DnD = ({ children, sortEndHandler }) => {
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
