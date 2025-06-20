import "./app.css";
import { DraggableItem } from "./components/draggable-item";
import { useSelectedItem } from "./context/selectItem-provider";

const items = [
  {
    id: "1",
    name: "待办事项",
    imageUrl: "todoList.png",
  },
  {
    id: "2",
    name: "音乐",
    imageUrl: "music.png",
  },
];

function App() {
  const { setSelectedId } = useSelectedItem();

  const handleClick = () => {
    console.log("Container clicked, deselecting item");
    setSelectedId(null);
  };

  return (
    <div className="w-screen h-screen relative">
      <div className="bg-[url(./assets/bg-img.jpg)] bg-center bg-cover absolute size-full">
        <div className="size-full backdrop-blur-sm flex" onClick={handleClick}>
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              id={item.id}
              name={item.name}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
