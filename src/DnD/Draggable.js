import React from "react";
import useDraggable from "../DnD/useDraggable";

export const Draggable = React.memo(({ children, index, span }) => {
  const { handler, ref } = useDraggable({ index });

  return (
    <div ref={ref} {...handler} style={{ gridColumn: span && "span 2" }}>
      {children}
    </div>
  );
});
