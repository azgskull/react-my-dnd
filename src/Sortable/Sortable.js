import React, { useCallback } from "react";
import useItems from "../DnD/useItems";
import {
  context,
  getBestIntersection,
  calculateItemsPositions,
  resetItemsPositions,
  placeDraggableInNewPlace,
} from "../DnD/utilities";

export const Sortable = ({ children, sortEndHandler }) => {
  const { items, getItemHTMLElement } = useItems({ children });

  const setItemsPositions = useCallback(() => calculateItemsPositions(items), [
    items,
  ]);

  const move = useCallback(
    (index = 0, itemIndex = 0, initialItemsPositions) => {
      // reset
      resetItemsPositions({ items, ignoreIndex: itemIndex, transition: false });

      const applyMove = (i, nextItemPosition) => {
        const itemPosition = initialItemsPositions[i];
        const htmlElement = items[i].ref.current;
        const translate = { x: 0, y: 0 };
        if (nextItemPosition) {
          translate.x = nextItemPosition.x - itemPosition.x;
          translate.y = nextItemPosition.y - itemPosition.y;
        }

        htmlElement.style.transition = "0.2s ease-in-out";
        htmlElement.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
      };

      if (itemIndex > index) {
        // update after
        for (let i = index; i < items.length; i++) {
          if (i === itemIndex) {
            return;
          }
          const nextItemPosition = initialItemsPositions[i + 1];
          applyMove(i, nextItemPosition);
        }
      } else {
        // update after
        for (let i = index; i >= 0; i--) {
          if (i === itemIndex) {
            return;
          }
          const nextItemPosition = initialItemsPositions[i - 1];
          applyMove(i, nextItemPosition);
        }
      }
    },
    [items]
  );

  const checkIntersection = useCallback(
    (draggableIndex, initialItemsPositions, indexSort) => {
      const draggable = getItemHTMLElement(draggableIndex);

      const bestIntersection = getBestIntersection({
        draggable,
        items,
        initialItemsPositions,
      });

      if (bestIntersection.percent > 10) {
        indexSort.indexSource = draggableIndex;
        indexSort.indexTarget = bestIntersection.index;
        move(bestIntersection.index, draggableIndex, initialItemsPositions);
      }
    },
    [getItemHTMLElement, items, move]
  );

  const sortEnd = (indexSort, initialItemsPositions) => {
    if (
      indexSort.indexSource >= 0 &&
      indexSort.indexTarget >= 0 &&
      indexSort.indexSource !== indexSort.indexTarget
    ) {
      // a correct sort
      const draggable = getItemHTMLElement(indexSort.indexSource);
      placeDraggableInNewPlace({ draggable, indexSort, initialItemsPositions });
      setTimeout(() => {
        sortEndHandler(indexSort);
        resetItemsPositions({ items, transition: false });
      }, 100);
    } else {
      resetItemsPositions({ items, transition: true });
    }
  };

  return (
    <context.Provider value={{ checkIntersection, setItemsPositions, sortEnd }}>
      {items}
    </context.Provider>
  );
};
