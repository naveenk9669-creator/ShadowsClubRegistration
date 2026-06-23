import MembershipFormTemplate from "./templates/MembershipFormTemplate";
import { useEffect } from "react";

function MemberFormPage() {
  const member = JSON.parse(localStorage.getItem("selectedMember") || "{}");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("print") === "true") {
      setTimeout(() => window.print(), 500);
    }
  }, []);

  return <MembershipFormTemplate member={member} />;
}

export default MemberFormPage;