import MemberCardTemplate from "./templates/MemberCardTemplate";
import { useEffect } from "react";

function MemberCardPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("print") === "true") {
      setTimeout(() => window.print(), 500);
    }
  }, []);

  const member = JSON.parse(localStorage.getItem("selectedMember") || "{}");

  return <MemberCardTemplate member={member} />;
}

export default MemberCardPage;