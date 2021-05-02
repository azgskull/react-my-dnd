import { useCallback, useContext } from "react";
import { context, useItemsPositions, useIntersection } from "./index";

export const useDnD = () => {
  const { items, sortEndHandler } = useContext(context);
  const { resetItemsPositions, placeDraggableInNewPlace } = useItemsPositions();
  const { getBestIntersection } = useIntersection();

  const move = useCallback(
    (index = 0, itemIndex = 0, initialItemsPositions) => {
      // reset
      resetItemsPositions({ ignoreIndex: itemIndex, transition: true });

      const applyMove = (i, nextItemPosition) => {
        const itemPosition = initialItemsPositions[i];
        const htmlElement = items[i];
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
    [items, resetItemsPositions]
  );

  const sortEnd = useCallback(
    (indexSort, initialItemsPositions) => {
      if (
        indexSort.indexSource >= 0 &&
        indexSort.indexTarget >= 0 &&
        indexSort.indexSource !== indexSort.indexTarget
      ) {
        // a correct sort
        const draggable = items[indexSort.indexSource];
        placeDraggableInNewPlace({
          draggable,
          indexSort,
          initialItemsPositions,
        });
        setTimeout(() => {
          sortEndHandler(indexSort);
          resetItemsPositions({ items, transition: false });
        }, 100);
      } else {
        resetItemsPositions({ items, transition: true });
      }
    },
    [items, placeDraggableInNewPlace, resetItemsPositions, sortEndHandler]
  );

  const dragging = useCallback(
    ({ draggableIndex, draggableShadow, initialItemsPositions, indexSort }) => {
      const bestIntersection = getBestIntersection({
        draggableShadow,
        initialItemsPositions,
      });

      if (bestIntersection.percent > 0) {
        indexSort.indexSource = draggableIndex;
        indexSort.indexTarget = bestIntersection.index;
        move(bestIntersection.index, draggableIndex, initialItemsPositions);
        // sortEnd(indexSort, initialItemsPositions);
      }
    },
    [getBestIntersection, move]
  );

  return {
    sortEnd,
    dragging,
  };
};
