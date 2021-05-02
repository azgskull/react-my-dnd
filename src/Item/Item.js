import React from "react";
import styles from "./item.module.css";

export const Item = React.memo(({ children, index }) => {
  return <div className={styles.item}>{children}</div>;
});
