export const calculateItemsPositions = (items) => {
  const positions = [];
  items.forEach(({ ref }, index) => {
    const boundingRect = ref.current.getBoundingClientRect();
    positions.push(boundingRect);
  });
  return positions;
};

export const resetItemsPositions = ({
  items,
  ignoreIndex,
  transition = true,
}) => {
  for (let i = 0; i < items.length; i++) {
    if (ignoreIndex >= 0 && i === ignoreIndex) {
      continue;
    }
    const htmlElement = items[i].ref.current;
    htmlElement.style.transition = transition ? "0.2s ease-in-out" : "none";
    htmlElement.style.transform = `translate(0px, 0px)`;
  }
};

export const placeDraggableInNewPlace = ({
  draggable,
  indexSort: { indexSource, indexTarget },
  initialItemsPositions,
}) => {
  const a = initialItemsPositions[indexSource];
  const b = initialItemsPositions[indexTarget];

  const x = b.x - a.x;
  const y = b.y - a.y;
  draggable.style.transition = "0.2s ease-in-out";
  draggable.style.transform = `translate(${x}px, ${y}px)`;
};
