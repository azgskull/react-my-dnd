import { useContext } from "react";
import { context } from "./utilities/";

const useDraggable = ({ ref, index }) => {
  const { checkIntersection, setItemsPositions, sortEnd } = useContext(context);

  const pointerdown = (edown) => {
    const position = {
      x: edown.clientX,
      y: edown.clientY,
    };

    edown.preventDefault();

    const indexSort = {
      indexSource: null,
      indexTarget: null,
    };

    let didmove = false;
    const initialItemsPositions = setItemsPositions();
    ref.current.style.transition = "none";

    const pointermove = (e) => {
      didmove = true;
      document.body.setPointerCapture(edown.pointerId);

      const currentPosition = { x: e.clientX, y: e.clientY };
      const nexPosition = {
        x: currentPosition.x - position.x,
        y: currentPosition.y - position.y,
      };
      ref.current.style.transform = `translate(${nexPosition.x}px,${nexPosition.y}px)`;
      checkIntersection(index, initialItemsPositions, indexSort);
    };

    document.addEventListener("pointermove", pointermove);
    document.addEventListener(
      "pointerup",
      () => {
        if (didmove) {
          sortEnd(indexSort, initialItemsPositions);
        }
        document.removeEventListener("pointermove", pointermove);
      },
      { once: true }
    );
  };

  return {
    handler: {
      onPointerDown: pointerdown,
    },
  };
};

export default useDraggable;
