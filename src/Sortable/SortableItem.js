import React, { forwardRef } from "react";
import useDraggable from "../DnD/useDraggable";
export const SortableItem = forwardRef(({ children, index }, ref) => {
  const { handler } = useDraggable({ ref, index });

  return (
    <div {...handler} ref={ref}>
      {children}
    </div>
  );
});
