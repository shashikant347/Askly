import { FaArrowAltCircleUp, FaTractor } from "react-icons/fa";
export default function InputButton({ setQuestion, askQuestion, question }) {
  const forEnter = (e) => {
    if (e.key === "Enter") askQuestion();
  };
  return (
    <>
      <div className="bg-zinc-800 w-full md:w-1/2 text-white m-auto border-zinc-400 border flex rounded-3xl">
        <input
          type="text"
          className="w-full outline-none h-full p-2 pl-3 text-sm md:text-base"
          placeholder="Ask me anything"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          onKeyUp={forEnter}
        />
        
        <button
          className="w-10 pr-1 transform transition-transform duration-300 hover:scale-110 cursor-pointer"
          onClick={askQuestion}
        >
          <FaArrowAltCircleUp className="h-full w-full" />
        </button>
      </div>
    </>
  );
}
