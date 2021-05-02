import { useCallback, useContext } from "react";
import { context } from "./context";

export const useIntersection = () => {
  const { items } = useContext(context);

  const intersectionBetween = useCallback(
    (draggableClientRect, itemClientRect) => {
      const draggable_ = {
        x0: draggableClientRect.x,
        x1: draggableClientRect.x + draggableClientRect.width,
        y0: draggableClientRect.y,
        y1: draggableClientRect.y + draggableClientRect.width,
      };

      const item_ = {
        x0: itemClientRect.x,
        x1: itemClientRect.x + itemClientRect.width,
        y0: itemClientRect.y,
        y1: itemClientRect.y + itemClientRect.width,
      };

      const intersection = {
        x: Math.max(
          0,
          Math.min(draggable_.x1, item_.x1) - Math.max(draggable_.x0, item_.x0)
        ),
        y: Math.max(
          0,
          Math.min(draggable_.y1, item_.y1) - Math.max(draggable_.y0, item_.y0)
        ),
      };

      const surfaceDraggable =
        draggableClientRect.width * draggableClientRect.height;
      const surfaceIntersection = intersection.x * intersection.y;

      const percent = (surfaceIntersection * 100) / surfaceDraggable;

      return percent;
    },
    []
  );

  const getBestIntersection = useCallback(
    ({ draggable, initialItemsPositions }) => {
      let bestIntersection = {
        index: null,
        percent: 0,
      };

      const draggableClientRect = draggable.getBoundingClientRect();

      items.forEach((item, indexItem) => {
        const itemClientRect = initialItemsPositions[indexItem];
        const percent = intersectionBetween(
          draggableClientRect,
          itemClientRect
        );
        if (percent > bestIntersection.percent) {
          bestIntersection = {
            index: indexItem,
            percent,
          };
        }
      });

      return bestIntersection;
    },
    [intersectionBetween, items]
  );

  return {
    getBestIntersection,
  };
};
