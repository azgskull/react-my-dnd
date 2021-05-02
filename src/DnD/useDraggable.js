import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useItemsPositions, useDnD, context } from "./utilities/";

const useDraggable = ({ index }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { setItems } = useContext(context);
  const { dragging, sortEnd } = useDnD();
  const { calculateItemsPositions } = useItemsPositions();

  const ref = useRef();

  useEffect(() => {
    const draggable = ref.current;
    if (draggable) {
      setItems((state) => {
        const filteredSame = state.filter((item) => {
          return item !== draggable;
        });
        filteredSame.splice(index, 0, draggable);
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

      setIsDragging(true);

      let didmove = false;
      let initialItemsPositions = calculateItemsPositions();
      ref.current.style.transition = "none";

      const shadowNode = cloneNode();
      shadowNode.style.visibility = "hidden";

      const updateInitialItemsPositions = () => {
        initialItemsPositions = calculateItemsPositions();
        dragging({
          draggableIndex: index,
          draggableShadow: shadowNode,
          initialItemsPositions,
          indexSort,
        });
      };

      window.addEventListener("scroll", updateInitialItemsPositions);

      const pointermove = (e) => {
        didmove = true;
        shadowNode.setPointerCapture(edown.pointerId);
        ref.current.style.visibility = "hidden";
        shadowNode.style.visibility = "visible";

        const currentPosition = { x: e.clientX, y: e.clientY };
        const nexPosition = {
          x: currentPosition.x - position.x,
          y: currentPosition.y - position.y,
        };
        shadowNode.style.transform = `translate(${nexPosition.x}px,${nexPosition.y}px)`;
        dragging({
          draggableIndex: index,
          draggableShadow: shadowNode,
          initialItemsPositions,
          indexSort,
        });
      };

      document.addEventListener("pointermove", pointermove);
      document.addEventListener(
        "pointerup",
        () => {
          if (didmove) {
            sortEnd(indexSort, initialItemsPositions);
          }
          setIsDragging(false);
          ref.current.style.visibility = "visible";
          shadowNode.remove();
          document.removeEventListener("pointermove", pointermove);
          window.removeEventListener("scroll", updateInitialItemsPositions);
        },
        { once: true }
      );
    },
    [calculateItemsPositions, cloneNode, dragging, index, sortEnd]
  );

  return {
    ref,
    isDragging,
    handler: {
      onPointerDown: pointerdown,
    },
  };
};

export default useDraggable;
