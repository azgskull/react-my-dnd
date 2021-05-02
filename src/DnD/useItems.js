import React, { createRef, useEffect, useState } from "react";

const useItems = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(
      React.Children.map(children, (child) => {
        const ref = createRef();
        return React.cloneElement(child, { ref });
      })
    );
  }, [children]);

  const getItemHTMLElement = (index) => items[index].ref.current;

  return {
    items,
    getItemHTMLElement,
  };
};

export default useItems;
