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
      <span className="text-sm md:text-base">{remove}</span>
    ) : heading ? (
      <span className="pt-3 md:pt-5 text-base md:text-lg block">{remove}</span>
    ) : (
      <span className="pl-2 md:pl-4 text-sm md:text-base">{remove}</span>
    )}
  </>
);

}

export default AnswerList;
