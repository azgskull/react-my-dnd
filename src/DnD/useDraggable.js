import { useCallback, useContext, useEffect, useRef } from "react";
import { useItemsPositions, useDnD, context } from "./utilities/";

const useDraggable = ({ index }) => {
  const { setItems } = useContext(context);
  const { checkIntersection, sortEnd } = useDnD();
  const { calculateItemsPositions } = useItemsPositions();

  const ref = useRef();

  useEffect(() => {
    const item = ref.current;
    if (item) {
      setItems((state) => {
        const filteredSame = state.filter((i) => {
          return i !== item;
        });
        filteredSame.splice(index, 0, item);
        return filteredSame;
      });
    }
  }, [ref, setItems, index]);

  const cloneNode = useCallback(() => {
    const boundingRect = ref.current.getBoundingClientRect();
    const shadow = ref.current.cloneNode(true);
    shadow.style.position = "fixed";
    shadow.style.width = boundingRect.width + "px";
    shadow.style.height = boundingRect.height + "px";
    shadow.style.left = boundingRect.x + "px";
    shadow.style.top = boundingRect.y + "px";
    document.body.append(shadow);

    return shadow;
  }, []);

  const pointerdown = useCallback(
    (edown) => {
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
      const initialItemsPositions = calculateItemsPositions();
      ref.current.style.transition = "none";

      const shadowNode = cloneNode();

      const pointermove = (e) => {
        didmove = true;
        shadowNode.setPointerCapture(edown.pointerId);
        ref.current.style.visibility = "hidden";

        const currentPosition = { x: e.clientX, y: e.clientY };
        const nexPosition = {
          x: currentPosition.x - position.x,
          y: currentPosition.y - position.y,
        };
        shadowNode.style.transform = `translate(${nexPosition.x}px,${nexPosition.y}px)`;
        checkIntersection(index, shadowNode, initialItemsPositions, indexSort);
      };

      document.addEventListener("pointermove", pointermove);
      document.addEventListener(
        "pointerup",
        () => {
          if (didmove) {
            sortEnd(indexSort, initialItemsPositions);
          }
          ref.current.style.visibility = "visible";
          shadowNode.remove();
          document.removeEventListener("pointermove", pointermove);
        },
        { once: true }
      );
    },
    [calculateItemsPositions, checkIntersection, cloneNode, index, sortEnd]
  );

  return {
    ref,
    handler: {
      onPointerDown: pointerdown,
    },
  };
};

export default useDraggable;
