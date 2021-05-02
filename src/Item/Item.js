import React from "react";
import styles from "./item.module.css";

export const Item = React.memo(({ children, click, index }) => {
  return (
    <div className={styles.item} onClick={(e) => click(index)}>
      {children}
    </div>
  );
});
