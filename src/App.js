import { useCallback, useState } from "react";
import "./App.css";
import { DnD, Draggable } from "./DnD";
import Grid from "./Grid";
import Item from "./Item";

const array = Array(50)
  .fill("")
  .map((i, index) => index);

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
    const itemMove = itemss.splice(indexSource, 1);
    itemss.splice(indexTarget, 0, itemMove);
    setItems(itemss);
  };

  return (
    <div className="App">
      <Grid>
        <DnD sortEndHandler={sortEndHandler}>
          <Draggable key={0} index={0} span="2">
            <Item index={0} click={click}>
              test 1
            </Item>
          </Draggable>
          <Draggable key={1} index={1}>
            <Item index={1} click={click}>
              test 2
            </Item>
          </Draggable>
          <Draggable key={2} index={2}>
            <Item index={2} click={click}>
              test 3
            </Item>
          </Draggable>
          <Draggable key={3} index={3}>
            <Item index={3} click={click}>
              test 4
            </Item>
          </Draggable>
          {/* {items.map((item, index) => (
            <Draggable key={item} index={index}>
              <Item index={index + 1} click={click}>
                {item}
              </Item>
            </Draggable>
          ))} */}
        </DnD>
      </Grid>
    </div>
  );
}

export default App;
