import React from "react";
import "./MemberCardTemplate.css";
// Import the logo image file directly into the template asset tree
import TeamShadowsLogo from "./TeamShadowsLogo.png";

function MemberCardTemplate({ member = {} }) {
  const API = "http://localhost:5000";

  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("blob:")) return photo;
    if (photo.startsWith("http")) return photo;
    return `${API}/${photo.replace(/\\/g, "/")}`;
  };

  const photoUrl = getPhotoUrl(member.photo || member.photoPreview);

return (
    <div className="mc-container" id="member-card">
      <div className="mc-card-body">
        
        {/* Top Header Branding Banner Block */}
        <div className="mc-header">
          <div className="mc-club-title">
            <h1 className="mc-single-line-title">SHADOWS RECREATION CLUB</h1>
            <p className="mc-member-card-title">MEMBERSHIP CARD</p>
          </div>

          <div className="mc-logo-image-wrapper">
            <img 
              src={TeamShadowsLogo} 
              className="mc-brand-logo-img" 
              alt="Team Shadows Logo" 
            />
          </div>
        </div>

        {/* Central Left-Aligned Identity Blocks Panel */}
        <div className="mc-profile-row">
          <div className="mc-photo-frame">
            {photoUrl ? (
              <img src={photoUrl} alt="Member ID Profile" />
            ) : (
              <div className="mc-photo-placeholder">PHOTO</div>
            )}
          </div>

          <div className="mc-identity-info">
            <h2 className="mc-member-name-text">{member.name || "NAME GOES HERE"}</h2>
            <h3 className="mc-member-id-value">{member.memberId || "ID-NUMBER"}</h3>
            <h3 className="mc-member-id-value">{member.mobile || "9876543210"}</h3>
          </div>
        </div>

        {/* Base Structural Metadata Footer Node */}
        <div className="mc-footer-meta">
          <div className="mc-phone-block"></div>

          <div className="mc-address-block">
            <span className="mc-footer-label">ADDRESS</span>
            <p className="mc-address-value-text">
              {member.address || "Your Address Text Description Details Layer"}
            </p>
          </div>
        </div>

        {/* PLACED BACK INSIDE: Positioned right above the gold bar layer */}
        <div className="card-footer-property-text">
          This card remains the property of SHADOWS RECREATION CLUB. Present at entry. Non-transferable.
        </div>

        {/* Golden Base Horizontal Strip Accent */}
        <div className="mc-gold-accent-bar"></div>
      </div>
    </div>
  );
}

export default MemberCardTemplate;