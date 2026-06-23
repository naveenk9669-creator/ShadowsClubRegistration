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

  const downloadCardPdf = async () => {
  const input = document.getElementById("member-card");

  const canvas = await html2canvas(input);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape", "mm", [54, 86]);

  pdf.addImage(imgData, "PNG", 0, 0, 86, 54);

  pdf.save(`${member.memberId}-card.pdf`);
};

  return (
    <MemberCardTemplate member={member} />
  );
}

export default MemberCardPage;