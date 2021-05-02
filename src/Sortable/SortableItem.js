import React from "react";
import useDraggable from "../DnD/useDraggable";
export const SortableItem = ({ children, index }) => {
  const { handler, ref } = useDraggable({ index });

  return (
    <div {...handler} ref={ref}>
      {children}
    </div>
  );
};
