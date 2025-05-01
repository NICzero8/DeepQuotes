import React, { useState } from "react";
import styles from "./ScrollPicker.module.css";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
];

export const ScrollPicker: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.boxShadow}>
        <div className={styles.scrollContainer}>
          {items.map((item, index) => (
            <button
              key={index}
              className={`${styles.item} ${
                selected === index ? styles.selected : ""
              }`}
              onClick={() => setSelected(index)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
