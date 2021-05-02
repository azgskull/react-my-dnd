import { useCallback, useContext } from "react";
import { context } from "./context";

export const useItemsPositions = () => {
  const { items } = useContext(context);

  const resetItemsPositions = useCallback(
    ({ ignoreIndex, transition = true }) => {
      for (let i = 0; i < items.length; i++) {
        if (ignoreIndex >= 0 && i === ignoreIndex) {
          continue;
        }
        const htmlElement = items[i];
        htmlElement.style.transition = transition ? "0.2s ease-in-out" : "none";
        htmlElement.style.transform = `translate(0px, 0px)`;
      }
    },
    [items]
  );

  const calculateItemsPositions = useCallback(() => {
    resetItemsPositions({ transition: false });
    const positions = [];
    items.forEach((item, index) => {
      const boundingRect = item.getBoundingClientRect();
      positions.push(boundingRect);
    });
    return positions;
  }, [items, resetItemsPositions]);

  const placeDraggableInNewPlace = useCallback(
    ({
      draggable,
      indexSort: { indexSource, indexTarget },
      initialItemsPositions,
    }) => {
      const a = initialItemsPositions[indexSource];
      const b = initialItemsPositions[indexTarget];

      const x = b.x - a.x;
      const y = b.y - a.y;
      draggable.style.transition = "none";
      draggable.style.transform = `translate(${x}px, ${y}px)`;
    },
    []
  );

  return {
    calculateItemsPositions,
    resetItemsPositions,
    placeDraggableInNewPlace,
  };
};
