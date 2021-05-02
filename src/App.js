import { useCallback, useState } from "react";
import "./App.css";
import { DnD } from "./DnD";
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
          {items.map((item, index) => (
            <Item key={item} click={click} index={index}>
              {item}
            </Item>
          ))}
        </DnD>
      </Grid>
    </div>
  );
}

export default App;
