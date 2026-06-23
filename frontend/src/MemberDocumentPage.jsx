import MembershipFormTemplate from "./templates/MembershipFormTemplate";
import MemberCardTemplate from "./templates/MemberCardTemplate";
import { useEffect } from "react";
import "./MemberDocumentPage.css";

function MemberDocumentPage() {
    useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("print") === "true") {
    setTimeout(() => window.print(), 800);
  }

  if (params.get("download") === "true") {
    setTimeout(() => downloadPDF(), 800);
  }
}, []);
const member = JSON.parse(localStorage.getItem("selectedMember") || "{}");



  return (
    <div className="document-page">
     

      <div className="doc-page">
        <MembershipFormTemplate member={member} />
      </div>

      <div className="page-break"></div>

      <div className="doc-page">
        <MemberCardTemplate member={member} />
      </div>
    </div>
  );
}

export default MemberDocumentPage;