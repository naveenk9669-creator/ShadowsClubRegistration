import React from "react";
import "./MembershipFormTemplate.css";

const API = "http://localhost:5000";

function MembershipFormTemplate({ member = {} }) {
  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("blob:") || photo.startsWith("http")) return photo;
    return `${API}/${photo.replace(/\\/g, "/")}`;
  };

  const photoUrl = getPhotoUrl(member.photo || member.photoPreview);

  return (
    <div className="mf-a4-container">
      <div className="mf-a4-sheet" id="membership-form-template">
        <div className="mf-border-frame">
          
          {/* Header Branding Area */}
          <div className="mf-top-flex-panel">
            <div className="mf-header-branding">
              <h1 className="mf-main-title">உறுப்பினர் சேர்க்கை விண்ணப்பம்</h1>
              <div className="mf-club-badge-container">
                <div className="mf-club-badge">★ SHADOWS கிளப் ★</div>
              </div>
              <p className="mf-restriction-text">( உறுப்பினர்கள் மட்டும் அனுமதி )</p>
            </div>
            
            <div className="mf-passport-photo-wrapper">
              {photoUrl ? (
                <img src={photoUrl} className="mf-passport-image" alt="Profile Layout" />
              ) : (
                <div className="mf-passport-placeholder">பாஸ்போர்ட் சைஸ்<br />புகைப்படம்</div>
              )}
            </div>
          </div>

          {/* SECTION 1: Wrapper Panel Box */}
          <div className="mf-section-container-box">
            <div className="mf-section-banner">1. உறுப்பினர் விவரங்கள்</div>
            
            <div className="mf-form-fields-left-panel">
              <div className="mf-grid-form-row">
                <span className="mf-field-label">1. விண்ணப்பதாரர் பெயர்</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-tamil">{member.name}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">2. தந்தை / கணவர் பெயர்</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-tamil">{member.fatherName}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">3. வயது</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-tamil">{member.age}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">4. பிறந்த தேதி</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-tamil">{member.dob}</div>
              </div>

              {/* Multi-line Address Block Layout */}
              <div className="mf-grid-form-row mf-address-block-row">
                <span className="mf-field-label">5. முகவரி</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-address-lines-wrapper">
                  <div className="mf-adr-line">
                    {member.address ? member.address.substring(0, 50) : ""}
                  </div>
                  <div className="mf-adr-line">
                    {member.address ? member.address.substring(50, 100) : ""}
                  </div>
                  <div className="mf-adr-line">
                    {member.address ? member.address.substring(100, 150) : ""}
                  </div>
                </div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">6. கைபேசி எண்</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-numeric">{member.mobile}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">7. மின்னஞ்சல் முகவரி</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline">{member.email}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">8. தொழில் / பணியிடம்</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline">{member.occupation}</div>
              </div>

              <div className="mf-grid-form-row">
                <span className="mf-field-label">9. ஆதார் எண்</span>
                <span className="mf-field-colon">:</span>
                <div className="mf-field-value-underline font-numeric">{member.aadhaarNumber}</div>
              </div>
              <div className="mf-grid-form-row pb-15">
                  <span className="mf-field-label">10. உறுப்பினர் எண்</span>
                  <span className="mf-field-colon">:</span>
                  <div className="mf-field-value-underline font-numeric">{member.memberId}</div>
                </div>
            </div>
          </div>

          {/* SECTION 2: Rules and Conditions Box */}
          <div className="mf-section-container-box">
            <div className="mf-section-banner">2. உறுப்பினர் விதிமுறைகள் மற்றும் நிபந்தனைகள்</div>
            <div className="mf-section-inner-padding">
              <div className="mf-policy-rules-list">
                <p>1. இம்மன்றம் உறுப்பினர்களுக்காக மட்டுமே இயங்கும் தனியார் மனமகிழ் மன்றமாகும்.</p>
                <p>2. உறுப்பினர் அட்டை இல்லாமல் கிளப் வளாகத்தில் அனுமதி வழங்கப்படாது.</p>
                <p>3. உறுப்பினர் தனது நடத்தை, உடை, பேச்சு மற்றும் செயல்களில் ஒழுக்கத்தை கடைபிடிக்க வேண்டும்.</p>
                <p>4. கிளப் வளாகத்தில் சட்டவிரோத செயல்கள், சண்டை, மிரட்டல், ஒழுங்கு குறைவு போன்றவை முற்றிலும் தடைசெய்யப்படுகின்றன.</p>
                <p>5. அரசு விதிமுறைகள், ஆயத்தீர்வைத்துறை விதிகள் மற்றும் கிளப் நிர்வாகத்தின் அறிவுறுத்தல்களை அனைவரும் கடைபிடிக்க வேண்டும்.</p>
                <p>6. உறுப்பினர் தனது விருந்தினர்களின் நடத்தைக்கு முழு பொறுப்பேற்க வேண்டும்.</p>
                <p>7. கிளப் சொத்துக்களுக்கு சேதம் விளைவித்தால், அதற்கான இழப்பீட்டை உறுப்பினர் செலுத்த வேண்டும்.</p>
                <p>8. உறுப்பினர் கட்டணம் மற்றும் புதுப்பிப்பு கட்டணம் நிர்வாகம் நிர்ணயிக்கும் விதிமுறைகளின்படி செலுத்தப்பட வேண்டும்.</p>
                <p>9. கிளப் நிர்வாகத்திற்கு தேவையான சூழ்நிலையில் எந்த உறுப்பினரின் உரிமையையும் இடைநிறுத்த அல்லது ரத்து செய்ய அதிகாரம் உண்டு.</p>
                <p>10. கிளப் வளாகத்தில் பணிபுரிபவர்களிடம் மரியாதையுடன் நடந்து கொள்ள வேண்டும்.</p>
                <p>11. கிளப் நிர்வாகம் தேவையான நேரங்களில் விதிமுறைகளை மாற்ற / திருத்த அதிகாரம் பெற்றுள்ளது.</p>
              </div>
            </div>

            {/* Announcement Block Area */}
            <div className="mf-declaration-wrapper-block">
              <div className="mf-declaration-center-badge">அறிவிப்பு</div>
              <p className="mf-declaration-statement-text">
                மேலே கொடுக்கப்பட்டுள்ள அனைத்து தகவல்களும் உண்மையானவை என்பதை நான் உறுதிப்படுத்துகிறேன். 
                மேலும், கிளப்பின் அனைத்து விதிமுறைகள் மற்றும் நிபந்தனைகளையும் முழுமையாக ஏற்றுக்கொள்கிறேன்.
              </p>
            </div>

            {/* Bottom Footer Signature and Date Section */}
            <div className="mf-signature-flex-row">
              <div className="mf-signature-left-line">
                <span>விண்ணப்பதாரர் கையொப்பம்</span>
              </div>
              <div className="mf-signature-right-date">
                <span>தேதி</span>
                <span className="mf-admin-colon" style={{ margin: '0 4px' }}>:</span>
                <div className="font-numeric">{member.date}</div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Office Administrative Panel Container */}
        <div className="mf-administrative-panel-box">
            <div className="mf-admin-header-title">அலுவலக பயன்பாட்டிற்கு மட்டும்</div>
            <div className="mf-admin-content-columns">
              
              {/* Left Column Section */}
              <div className="mf-admin-col">
                <div className="mf-admin-grid-row">
                  <span className="mf-admin-lbl">உறுப்பினர் எண்</span>
                  <span className="mf-admin-colon">:</span>
                  <div className="mf-admin-underline-val font-numeric">{member.memberId}</div>
                </div>
                <div className="mf-admin-grid-row">
                  <span className="mf-admin-lbl">சேர்க்கை தேதி</span>
                  <span className="mf-admin-colon">:</span>
                  <div className="mf-admin-underline-val font-numeric">{member.joinDate}</div>
                </div>
              </div>

              {/* Right Column Section */}
              {/* Right Column Section */}
<div className="mf-admin-col">
  <div className="mf-admin-grid-row">
    <span className="mf-admin-lbl-right">ஒப்புதல் அளித்தவர்</span>
    <span className="mf-admin-colon">:</span> {/* Added/Verified explicit colon item here */}
    <div className="mf-admin-underline-val"></div>
  </div>
  <div className="mf-admin-grid-row">
    <span className="mf-admin-lbl-right">பதவி</span>
    <span className="mf-admin-colon">:</span>
    <div className="mf-admin-underline-val"></div>
  </div>
</div>

            </div>

            {/* Bottom Signature Line */}
            <div className="mf-admin-plain-text-line">
              <span>கையொப்பம் & முத்திரை</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MembershipFormTemplate;