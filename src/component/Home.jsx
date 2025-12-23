import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import API_URL from "./api"; // api.js me API_URL sahi endpoint ke saath hona chahiye
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
    if (!question && !onhistory) return false;
    setLoding(true);

    const dataToSend = question ? question : onhistory;

    // Save to localStorage
    if (question) {
      const history = [question, ...(JSON.parse(localStorage.getItem("history")) || [])];
      localStorage.setItem("history", JSON.stringify(history));
      setLocal(history);
    }

    // Correct request body for Google Generative API
    const requestBody = {
      prompt: { text: dataToSend },
      maxOutputTokens: 300
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      // Check if response exists
      const instring = result?.candidates?.[0]?.content?.[0]?.text || result?.candidates?.[0]?.content?.text;

      if (!instring || typeof instring !== "string") {
        setAnswer((prev) => [
          ...prev,
          { type: "ans", text: ["API error / No response"] },
        ]);
        setLoding(false);
        return;
      }

      // Split into array if needed
      const answerArray = instring.split("* ").map((item) => item.trim());

      setAnswer((prev) => [
        ...prev,
        { type: "que", text: dataToSend },
        { type: "ans", text: answerArray },
      ]);

      setQuestion("");
      setLoding(false);
    } catch (error) {
      console.error("Error fetching:", error);
      setAnswer((prev) => [
        ...prev,
        { type: "ans", text: ["Something went wrong"] },
      ]);
      setLoding(false);
    }
  };

  useEffect(() => {
    if (onhistory) askQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onhistory]);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  }, [answer]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      <div className="hidden md:block md:col-span-1">
        <Sidebar
          recentHistory={local}
          ask={setOnhistory}
          clearHistory={setLocal}
        />
      </div>

      <div className="col-span-1 md:col-span-3 flex flex-col">
        <div
          ref={scroll}
          className="flex-1 h-[80vh] md:h-[90vh] scrollbar-hide overflow-scroll p-4 md:p-8"
        >
          <div className="text-white">
            <Loder loding={loding} />
            <ul>
              {answer.map((item, index) => (
                <div
                  key={index + Math.random()}
                  className={item.type === "que" ? "flex justify-end" : ""}
                >
                  {item.type === "que" ? (
                    <li className="p-2 md:p-3 bg-zinc-600 rounded-bl-3xl rounded-t-3xl">
                      <AnswerList ans={item.text} id={index} />
                    </li>
                  ) : (
                    Array.isArray(item.text) &&
                    item.text.map((ans, i) => (
                      <li key={i} className="text-left p-1 md:p-2">
                        <AnswerList ans={ans} id={index} />
                      </li>
                    ))
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-2 md:p-4">
          <I
