import { useEffect } from "react";
import MemberCardTemplate from "./templates/MemberCardTemplate";
import MemberCardPrintTemplate from "./templates/MemberCardPrintTemplate";

function MemberCardPage() {
  const member = JSON.parse(localStorage.getItem("selectedMember") || "{}");

  const isPrint =
    new URLSearchParams(window.location.search).get("print") === "true";

  useEffect(() => {
    if (isPrint) {
      setTimeout(() => window.print(), 800);
    }
  }, [isPrint]);

  if (isPrint) {
    return <MemberCardPrintTemplate member={member} />;
  }

  return <MemberCardTemplate member={member} />;
}

export default MemberCardPage;