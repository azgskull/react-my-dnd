import { useCallback, useState } from "react";
import "./App.css";
import { DnD, Draggable } from "./DnD";
import Grid from "./Grid";
import Item from "./Item";

const array = Array(500)
  .fill("")
  .map((i, index) => ({ span: 1, value: "block " + index }));

// const array = [
//   { span: 1, value: "block 0" },
//   { span: 2, value: "block 1" },
//   { span: 2, value: "block 2" },
//   { span: 3, value: "block 3" },
//   { span: 1, value: "block 4" },
// ];

function App() {
  const [items, setItems] = useState(array);

  const click = useCallback((index) => {
    setItems((state) => {
      const itemss = [...state];
      itemss.splice(index, 1);
      return itemss;
    });
  }, []);

  const sortEndHandler = ({ indexSource, indexTarget }) => {
    const itemss = [...items];
    const itemMove = itemss.splice(indexSource, 1)[0];
    itemss.splice(indexTarget, 0, itemMove);
    setItems(itemss);
  };

  return (
    <div className="App">
      <Grid>
        <DnD sortEndHandler={sortEndHandler}>
          {items.map((item, index) => (
            <Draggable key={item.value} index={index} span={item.span}>
              <Item index={index} click={click}>
                {item.value}
              </Item>
            </Draggable>
          ))}
        </DnD>
      </Grid>
    </div>
  );
}

export default App;
