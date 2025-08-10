import { useState } from "react";
import { useEffect } from "react";

function AnswerList({ ans, id }) {
  const [heading, setHeading] = useState(false);
  const [remove, setRemove] = useState(ans);
  useEffect(() => {
    if (headingCheck(ans)) {
      setHeading(true);
      setRemove(removeStars(remove));
    }
  }, []);

  function headingCheck(data) {
    return /^(\*)(\*)(.*)\*$/.test(data);
  }
  function removeStars(stars) {
    return stars.replace(/^(\*)(\*)|(\*)$/g, "");
  }

  return (
    <>
      {id === 0 ? (
        <span className="">{remove}</span>
      ) : heading ? (
        <span className="pt-5 text-lg block">{remove}</span>
      ) : (
        <span className="pl-4 text-sm">{remove}</span>
      )}
    </>
  );
}

export default AnswerList;
