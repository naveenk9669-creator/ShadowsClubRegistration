import MembershipFormTemplate from "./templates/MembershipFormTemplate";
import { useEffect } from "react";

function MemberFormPage() {

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("print") === "true") {
    setTimeout(() => window.print(), 500);
  }
}, []);
  const member = JSON.parse(
    localStorage.getItem("memberFormData") || "{}"
  );

  const downloadPdf = async () => {
  const input = document.getElementById("membership-form");

  const canvas = await html2canvas(input);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

  pdf.save(`${member.memberId}-form.pdf`);
};

  return (
    <MembershipFormTemplate member={member} />
  );
}

export default MemberFormPage;