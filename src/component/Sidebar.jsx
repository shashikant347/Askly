import { MdOutlineAutoDelete } from "react-icons/md";

function Sidebar({ ask, recentHistory, clearHistory }) {
  const removeHestory = () => {
    localStorage.clear();
    clearHistory([]);
  };

  return (
   <div className="bg-zinc-900 h-full md:h-screen p-2 border-zinc-700 border-r-4 md:block hidden">
  <div className="flex justify-between items-center py-3">
    <h4 className="text-xl md:text-2xl text-zinc-300">Recent Search</h4>
    <button onClick={removeHestory} className="text-white">
      <MdOutlineAutoDelete />
    </button>
  </div>
  <ul>
    {(recentHistory || []).map((item, index) => (
      <li
        onClick={() => ask(item)}
        key={index}
        className="p-1 cursor-pointer hover:bg-zinc-700 rounded-2xl px-3 truncate text-sm md:text-base text-zinc-300"
      >
        {item}
      </li>
    ))}
  </ul>
</div>

  );
}

export default Sidebar;
