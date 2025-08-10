import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import API_URL from "./api";
import AnswerList from "./AnswerList";
import "../index.css";
import Loder from "./Loder";
import InputButton from "./InputButton";

function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [local, setLocal] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [onhistory, setOnhistory] = useState("");
  const [loding, setLoding] = useState(false);

  const scroll = useRef();

  const askQuestion = async () => {
    if (!question && !onhistory) {
      return false;
    }
    setLoding(true);

    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setLocal(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setLocal([question]);
      }
    }

    const data = question ? question : onhistory;

    const requestBody = {
      contents: [
        {
          parts: [{ text: data }],
        },
      ],
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      let instring = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      instring = instring.split("* ");
      instring = instring.map((item) => item.trim());

      // Gemini response ka text
      if (instring) {
        setAnswer([
          ...answer,
          { type: "que", text: question ? question : onhistory },
          { type: "ans", text: instring },
        ]);

        setQuestion("");
      } else {
        setAnswer((prev) => [
          ...prev,
          { type: "ans", text: "Error fetching data" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setAnswer("Error fetching data");
    }
  };

  useEffect(() => {
    askQuestion();
  }, [onhistory]);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
      setLoding(false);
    }
  }, [answer]);

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-1">
        <Sidebar
          recentHistory={local}
          ask={setOnhistory}
          clearHistory={setLocal}
        ></Sidebar>
      </div>
      <div className="col-span-3 ">
        <div ref={scroll} className="h-130 scrollbar-hide overflow-scroll  p-8">
          <div className="text-white p-3">
            <Loder loding={loding} />

            <ul>
              {answer.map((item, index) => (
                <div
                  key={index + Math.random()}
                  className={item.type === "que" ? "flex justify-end" : ""}
                >
                  {item.type === "que" ? (
                    <li
                      key={`q-${index}`}
                      className=" p-1  pr-3 bg-zinc-600 border-2 border-zinc-600 rounded-bl-3xl rounded-t-3xl  "
                    >
                      <AnswerList ans={item.text} id={index} />
                    </li>
                  ) : (
                    item.text.map((ans) => (
                      <li key={index + Math.random()} className="text-left p-1">
                        <AnswerList ans={ans} id={index} />
                      </li>
                    ))
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
        <InputButton
          setQuestion={setQuestion}
          question={question}
          askQuestion={askQuestion}
        />
      </div>
    </div>
  );
}

export default Home;
