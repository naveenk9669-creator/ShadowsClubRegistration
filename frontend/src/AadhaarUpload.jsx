import { useRef, useState } from "react";
import axios from "axios";
import "./AadhaarUpload.css";
import MemberCardTemplate from "./templates/MemberCardTemplate";
import { FiUsers, FiLogOut, FiUploadCloud, FiCamera, FiCheckCircle, FiFileText } from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/';

function AadhaarUpload({  onLogout, onViewMembers }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [aadharData, setAadharData] = useState(null);
  const [aadharPath, setAadharPath] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPath, setPhotoPath] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [memberId, setMemberId] = useState("");
  const [formPreviewUrl, setFormPreviewUrl] = useState("");
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

  const showCard = () => {
  const memberData = {
    name: formData.name,
    memberId: memberId,
    mobile: formData.mobile,
    address: formData.address,
    photo: photoPreview,
  };

  localStorage.setItem(
    "memberCardData",
    JSON.stringify(memberData)
  );

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
      const response = await axios.post(`${API}/api/members/extract-aadhaar`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        alert(response.data.message || "Failed to scan Aadhaar card");
        return;
      }

      setAadharData(response.data.data);
      setAadharPath(file.name);
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
    setPhotoPath(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };


  const handleGoToStep2 = async () => {
       setLoading(true);
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
   setLoading(false);
};

const showForm = () => {
  const member = {
    name: formData.name,
    fatherName: formData.fatherName,
    age: formData.age,
    dob: formData.dob,
    address: formData.address,
    mobile: formData.mobile,
    email: formData.email,
    occupation: formData.occupation,
    aadhaarNumber: formData.aadhaarNumber,
    memberId: memberId,
    photo: photoPreview, 
  };

  localStorage.setItem(
    "memberFormData",
    JSON.stringify(member)
  );

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

      const response = await axios.post(`${API}/api/members/submit-data`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        alert(response.data.message || "Failed to save member");
        return;
      }

      setSuccessMessage("Form created successfully!");
      setFormPreviewUrl(photoPreview);
      setCurrentStep(3);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
      alert("Failed to save member.");
    } finally {
      setLoading(false);
    }
  };

  const openPreviewWindow = () => {
    const previewWindow = window.open("", "_blank");
    if (!previewWindow) return null;

    const html = `
      <html>
        <head>
          <title>Membership Form Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { font-size: 24px; margin-bottom: 16px; }
            .row { margin-bottom: 12px; }
            .label { font-weight: bold; }
            img { max-width: 240px; display: block; margin-top: 16px; }
          </style>
        </head>
        <body>
          <h1>Membership Form Preview</h1>
          <div class="row"><span class="label">Name:</span> ${formData.name}</div>
          <div class="row"><span class="label">Father/Husband:</span> ${formData.fatherName}</div>
          <div class="row"><span class="label">Age:</span> ${formData.age}</div>
          <div class="row"><span class="label">DOB:</span> ${formData.dob}</div>
          <div class="row"><span class="label">Aadhaar Number:</span> ${formData.aadhaarNumber}</div>
          <div class="row"><span class="label">Address:</span> ${formData.address}</div>
          <div class="row"><span class="label">Mobile:</span> ${formData.mobile}</div>
          <div class="row"><span class="label">Email:</span> ${formData.email}</div>
          <div class="row"><span class="label">Occupation:</span> ${formData.occupation}</div>
          <div class="row"><span class="label">Referrer:</span> ${formData.referrerName} ${formData.referrerNumber ? `(${formData.referrerNumber})` : ""}</div>
          <div class="row"><span class="label">Member ID:</span> ${memberId}</div>
          ${photoPreview ? `<img src="${photoPreview}" alt="Member Photo" />` : ""}
        </body>
      </html>
    `;

    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
    return previewWindow;
  };

  const handleDownloadPDF = () => {
    const win = openPreviewWindow();
    if (!win) return;
    win.focus();
    win.print();
  };

  const handlePrint = () => {
    const win = openPreviewWindow();
    if (!win) return;
    win.focus();
    win.print();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setAadharData(null);
    setAadharPath("");
    setPhotoPath("");
    setPhotoPreview("");
    setMemberId("");
    setFormPreviewUrl("");
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
        <div>
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
            <button
  className="main-action-btn"
  type="button"
 onClick={showCard}>
  Generate Card
</button>
<button className="main-action-btn" type="button" onClick={showForm}>
  Generate Form
</button>
            <button className="main-action-btn" type="button" onClick={() => alert("Generate Form is not available yet.")}>Generate Form</button>
            <button className="main-action-btn" type="button" onClick={() => alert("Generate Card is not available yet.")}>Generate Card</button>
            <button className="outline-action-btn" type="button" onClick={handleDownloadPDF}>Download PDF</button>
            <button className="outline-action-btn" type="button" onClick={handlePrint}>Print Form</button>
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
