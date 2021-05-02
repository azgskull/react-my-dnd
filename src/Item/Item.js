import React from "react";
import useDraggable from "../DnD/useDraggable";
import styles from "./item.module.css";

export const Item = React.memo(({ children, click, index }) => {
  const { handler, ref } = useDraggable({ index });
  console.log("render");
  return (
    <div
      ref={ref}
      className={styles.item}
      onClick={(e) => click(index)}
      {...handler}
    >
      {children}
    </div>
  );
});
