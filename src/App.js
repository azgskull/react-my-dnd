import { useCallback, useState } from "react";
import "./App.css";
import Grid from "./Grid";
import Item from "./Item";
import { Sortable, SortableItem } from "./Sortable";

const array = Array(335)
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
        <Sortable sortEndHandler={sortEndHandler}>
          {items.map((item, index) => (
            <SortableItem index={index} key={item}>
              <Item click={click} index={index}>
                {item}
              </Item>
            </SortableItem>
          ))}
        </Sortable>
      </Grid>
    </div>
  );
}

export default App;
