import { useEffect, useState,useRef  } from "react";
import {
  FiArrowLeft,
  FiSearch,
  FiEye,
  FiDownload,
  FiPrinter,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import "./MembersList.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MembershipFormTemplate from "./templates/MembershipFormTemplate";
import MemberCardTemplate from "./templates/MemberCardTemplate";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';


function MembersList({ onBack }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [pdfMember, setPdfMember] = useState(null);

const formRef = useRef(null);
const cardRef = useRef(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch(`${API}/api/members/view-members`);
    const result = await res.json();

    if (result.success) {
      setMembers(result.data);
    }
  };

  const filteredMembers = members.filter((member) => {
    const text = `${member.name} ${member.aadhaarNumber} ${member.mobile}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };



const showDeletePopup = (member) => {
  setDeleteMember(member);
};

const closeDeletePopup = () => {
  setDeleteMember(null);
};

const confirmDeleteMember = async () => {
  if (!deleteMember) return;

  try {
    const response = await fetch(
      `${API}/api/members/delete-member/${deleteMember.memberId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "Failed to delete member");
      return;
    }

    setMembers((prev) =>
      prev.filter((member) => member.memberId !== deleteMember.memberId)
    );

    setDeleteMember(null);
  } catch (error) {
    alert("Backend not connected");
  }
};



const printForm = (member) => {
  localStorage.setItem(
    "selectedMember",
    JSON.stringify(member)
  );

  window.open("/member-form?print=true", "_blank");
};



const printCard = (member) => {
  localStorage.setItem(
    "selectedMember",
    JSON.stringify(member)
  );

  window.open("/member-card?print=true", "_blank");
};



const viewMember = (member) => {
  localStorage.setItem(
    "selectedMember",
    JSON.stringify(member)
  );

  window.open("/member-document", "_blank");
};

const downloadMemberPdf = async (member) => {
  setPdfMember(member);

  setTimeout(async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const formCanvas = await html2canvas(formRef.current, {
      scale: 2,
      useCORS: true,
    });

    const formImg = formCanvas.toDataURL("image/png");
    pdf.addImage(formImg, "PNG", 0, 0, 210, 297);

    pdf.addPage();

    const cardCanvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
    });

    const cardImg = cardCanvas.toDataURL("image/png");

    pdf.addImage(cardImg, "PNG", 20, 40, 170, 100);

    pdf.save(`${member.memberId}-document.pdf`);

    setPdfMember(null);
  }, 300);
};


  return (
    <div className="members-page">
     <header className="members-header">
  <FiArrowLeft className="back-icon" onClick={onBack} />

  <div>
    <h1>SHADOWS RECREATION CLUB</h1>
    <p>Members · {filteredMembers.length} members</p>
  </div>
</header>

      <main className="members-main">
        <div className="search-box">
          <FiSearch size={30} />
          <input
            placeholder="Search by name, Aadhar or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredMembers.map((member) => (
          <div className="member-card" key={member._id}>
           <div className="member-top">
  <div className="avatar">
    {member.name ? member.name.charAt(0) : "அ"}
  </div>

  <div className="member-info">
    <h2>{member.name}</h2>
    <p>Aadhar: {member.aadhaarNumber}</p>

    <div className="member-meta">
      <span>📱 {member.mobile}</span>
      <span>Joined: {formatDate(member.createdAt)}</span>
    </div>
  </div>
</div>

            <hr />

  <div className="member-actions">
  <button onClick={() => viewMember(member)}>
    <FiEye />
    View
  </button>

  <button
    className="pdf-btn"
    onClick={() => downloadMemberPdf(member)}
  >
    <FiDownload />
    PDF
  </button>

  <button onClick={() => printForm(member)}>
    <FiPrinter />
    Form
  </button>

  <button onClick={() => printCard(member)}>
    <FiPrinter />
    Card
  </button>

  <button
    className="delete-btn"
    onClick={() => showDeletePopup(member)}
  >
    <FiTrash2 />
  </button>
</div>
          </div>
        ))}
      </main>

      {selectedMember && (
        <div className="modal-overlay">
          <div className="member-modal">
            <FiX
              className="modal-close"
              onClick={() => setSelectedMember(null)}
            />

            <h2>{selectedMember.name}</h2>
            <p>Joined: {formatDate(selectedMember.createdAt)}</p>

            <hr />

            <div className="modal-actions">
              <button className="download-btn">
                <FiDownload /> Download PDF
              </button>

              <button className="print-btn">
                <FiPrinter /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteMember && (
  <div className="modal-overlay">
    <div className="member-modal delete-modal">
      <FiX
        className="modal-close"
        onClick={() => setDeleteMember(null)}
      />

      <h2>Delete Member?</h2>

      <p>
        Are you sure you want to delete{" "}
        <strong>{deleteMember.name}</strong>?
      </p>

      <p className="delete-member-id">
        {deleteMember.memberId}
      </p>

      <hr />

      <div className="modal-actions">
        <button
          className="danger-btn"
          type="button"
          onClick={confirmDeleteMember}
        >
          <FiTrash2 /> Delete
        </button>

        <button
          className="print-btn"
          type="button"
          onClick={() => setDeleteMember(null)}
        >
          Cancel
        </button>
        
      </div>
    </div>
  </div>
)}

{pdfMember && (
  <div className="hidden-pdf-area">
    <div ref={formRef}>
      <MembershipFormTemplate member={pdfMember} />
    </div>

    <div ref={cardRef}>
      <MemberCardTemplate member={pdfMember} />
    </div>
  </div>
)}
    </div>
  );
}

export default MembersList;