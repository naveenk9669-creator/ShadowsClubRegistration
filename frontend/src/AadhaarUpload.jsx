import { useRef, useState } from "react";
import axios from "axios";
import "./AadhaarUpload.css";
import { API_PATH } from "./apiConfig";
import {
  FiArrowLeft,
  FiSearch,
  FiEye,
  FiDownload,
  FiPrinter,
  FiTrash2,
  FiX,
  FiLogOut,
  FiFileText,
  FiCheckCircle,
  FiCamera,
  FiUploadCloud,
  FiUsers
} from "react-icons/fi";
function AadhaarUpload({  onLogout, onViewMembers }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [aadharData, setAadharData] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    aadhaarNumber: "",
    age: "",
    address: "",
    mobile: "",
    email: "",
    occupation: "",
    referrerName: "",
    referrerNumber: "",
    memberId: "",
  });

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


  const showCard = () => {
  const memberData = {
    ...formData,
    memberId: memberId || formData.memberId,
    photo: photoPreview,
  };

  localStorage.setItem("selectedMember", JSON.stringify(memberData));
  window.open("/member-card", "_blank");
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadAadharFile = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/heic",
      "image/heif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, HEIC, or PDF files are allowed");
      return;
    }

    const data = new FormData();
    data.append("aadhaar", file);

    try {
      setLoading(true);
      const response = await axios.post(API_PATH("/api/members/extract-aadhaar"), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        alert(response.data.message || "Failed to scan Aadhaar card");
        return;
      }

      setAadharData(response.data.data);
      setFormData((prev) => ({ ...prev, ...response.data.data }));
      setSuccessMessage("");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
      alert("Failed to scan Aadhaar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadPhotoFile = (file) => {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };


  const handleGoToStep2 = () => {
    if (!aadharData) {
      alert("Please upload Aadhaar card first");
      return;
    }

    if (!formData.memberId && !memberId) {
      alert("Member ID not found. Please upload Aadhaar again.");
      return;
    }

    setMemberId(formData.memberId || memberId);
    setCurrentStep(2);
  };

const showForm = () => {
  const member = {
    ...formData,
    memberId: memberId || formData.memberId,
    photo: photoPreview,
  };

  localStorage.setItem("selectedMember", JSON.stringify(member));
  window.open("/member-form", "_blank");
};
  

  const handleSaveMember = async () => {
    if (!photoFile) {
      alert("Please upload a photo first");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value || "");
      });

      payload.append("memberId", memberId);
      payload.append("photo", photoFile);

      const response = await axios.post(API_PATH("/api/members/submit-data"), payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        alert(response.data.message || "Failed to save member");
        return;
      }

      setSuccessMessage("Member created successfully!");
      setCurrentStep(3);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
      alert("Failed to save member.");
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setCurrentStep(1);
    setAadharData(null);
    setPhotoPreview("");
    setMemberId("");
    setSuccessMessage("");
    setFormData({
      name: "",
      fatherName: "",
      dob: "",
      aadhaarNumber: "",
      age: "",
      address: "",
      mobile: "",
      email: "",
      occupation: "",
      referrerName: "",
      referrerNumber: "",
      memberId: "",
    });
  };

  return (
    <div className="aadhaar-page">
      <header className="top-header">
        <div className="header-content">
          <h1>SHADOWS RECREATION CLUB</h1>
          <p>உறுப்பினர் சேர்க்கை விண்ணப்பம்</p>
        </div>

        <div className="header-icons">
          <FiUsers size={20} onClick={onViewMembers} className="header-action-icon" />
          <FiLogOut size={20} className="logout-icon" onClick={onLogout} />
        </div>
      </header>

      <main className="aadhaar-main">
        <div className="stepper">
          <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "done" : ""}`}>
            <div>{currentStep > 1 ? "?" : "1"}</div>
            <p>AADHAR</p>
          </div>

          <span className={`step-line ${currentStep > 1 ? "active-line" : ""}`} />

          <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "done" : ""}`}>
            <div>{currentStep > 2 ? "?" : "2"}</div>
            <p>DETAILS</p>
          </div>

          <span className={`step-line ${currentStep > 2 ? "active-line" : ""}`} />

          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
            <div>3</div>
            <p>PREVIEW</p>
          </div>
        </div>

        {currentStep === 1 && (
          <section className="upload-card">
            <h2>
              <FiFileText size={20} className="doc-icon" />
              Upload Aadhar Card
            </h2>

            <div className="drop-box" onClick={() => fileInputRef.current.click()}>
              <FiUploadCloud size={42} className="upload-icon" />
              <h3>Drop Aadhar card here</h3>
              <p>JPG, PNG, PDF, HEIC supported</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) => uploadAadharFile(e.target.files[0])}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => uploadAadharFile(e.target.files[0])}
            />

            <button className="camera-btn" type="button" onClick={() => cameraInputRef.current.click()}>
              <FiCamera size={16} />
              Take Photo of Aadhar
            </button>

            {loading && <p className="loading-text">Extracting Aadhaar data...</p>}

            {aadharData && (
              <>
                <p className="success-text">
                  <FiCheckCircle size={16} /> Extracted & translated to Tamil
                </p>

                <div className="form-group">
                  <label>விண்ணப்பதாரர் பெயர் (Name)</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label>தந்தை / கணவர் பெயர் (Father/Husband)</label>
                  <input name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                </div>

                <div className="two-col">
                  <div className="form-group">
                    <label>வயது (Age)</label>
                    <input name="age" value={formData.age} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>பிறந்த தேதி (DOB)</label>
                    <input name="dob" value={formData.dob} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>முகவரி (Address)</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label>ஆதார் எண் (Aadhar)</label>
                  <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} />
                </div>
              </>
            )}

            <div className="card-actions">
              <button className="main-action-btn" type="button" disabled={!aadharData} onClick={handleGoToStep2}>
                Next
              </button>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <>
            <section className="upload-card">
              <h2>
                <FiFileText size={20} className="doc-icon" />
                Passport Photo
              </h2>

              {!photoPreview ? (
                <>
                  <div className="drop-box" onClick={() => photoInputRef.current.click()}>
                    <FiUploadCloud size={42} className="upload-icon" />
                    <h3>Drop photo here</h3>
                    <p>JPG, PNG supported</p>
                  </div>

                  <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={(e) => uploadPhotoFile(e.target.files[0])} />
                  <input ref={selfieInputRef} type="file" accept="image/*" capture="user" hidden onChange={(e) => uploadPhotoFile(e.target.files[0])} />

                  <button className="camera-btn" type="button" onClick={() => selfieInputRef.current.click()}>
                    <FiCamera size={16} />
                    Take Selfie / Photo
                  </button>
                </>
              ) : (
                <div className="photo-preview-box">
                  <p className="success-text">
                    <FiCheckCircle size={16} /> Photo uploaded
                  </p>
                  <img src={photoPreview} alt="Passport Preview" className="photo-preview" />
                  <button className="change-photo-btn" type="button" onClick={() => photoInputRef.current.click()}>
                    Change Photo
                  </button>
                  <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={(e) => uploadPhotoFile(e.target.files[0])} />
                </div>
              )}
            
              <h2>Additional Details</h2>

              <div className="form-group">
                <label> கைபேசி எண் (Mobile)</label>
                <input name="mobile" value={formData.mobile} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>மின்னஞ்சல் (Email)</label>
                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" />
              </div>

              <div className="form-group">
                <label>உறுப்பினர் அடையாளம் (Member ID) *</label>
                <input value={formData.memberId} readOnly className="readonly-field" />
              </div>

              <div className="form-group">
                <label>தொழில் / வேலை (Occupation)</label>
                <input name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Business / Job" />
              </div>

              <div className="form-group">
                <label> பரிந்துரையாளர் பெயர் (Referrer Name)</label>
                <input name="referrerName" value={formData.referrerName} onChange={handleInputChange} placeholder="Referrer's full name" />
              </div>

              <div className="form-group">
                <label>பரிந்துரையாளர் எண்(Referrer Number)</label>
                <input name="referrerNumber" value={formData.referrerNumber} onChange={handleInputChange} placeholder="Member ID" />
              </div>

              <div className="card-actions two-buttons">
                <button className="outline-action-btn" type="button" onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button className="main-action-btn" type="button" onClick={handleSaveMember}>
                  Save
                </button>
              </div>
            </section>
          </>
        )}

        {currentStep === 3 && (
          <section className="preview-card">
            {successMessage && <div className="success-alert"><FiCheckCircle size={16} /> {successMessage}</div>}
            <h2>Membership Form</h2>
            <hr />

 <div className="main-member-actions">
  <button onClick={() => viewMember(formData)}>
    <FiEye />
    View
  </button>

  <button
    className="pdf-btn"
    onClick={() => downloadMemberPdf(formData)}
  >
    <FiDownload />
    PDF
  </button>

  <button onClick={() => printForm(formData)}>
    <FiPrinter />
    Form
  </button>

  <button onClick={() => printCard(formData)}  className="pdf-btn">
    <FiPrinter />
    Card
  </button>

</div>

            <hr />
            <button className="text-action-btn" onClick={resetForm}>Create New Member</button>
<button
  className="text-action-btn orange"
  type="button"
  onClick={onViewMembers}
>
  <FiUsers size={18} /> View All Members
</button>          </section>
        )}
        
      </main>
    </div>
  );
}

export default AadhaarUpload;
