import React from "react";
import TeamShadowsLogo from "./TeamShadowsLogo.png";
import { getPhotoUrl } from "../apiConfig";
import "./MemberCardPrintTemplate.css";

function MemberCardPrintTemplate({ member = {} }) {
  const photoUrl = getPhotoUrl(member.photo || member.photoPreview);

  return (
    <div className="pc-card" id="print-member-card">
      <div className="pc-header">
        <div>
          <h1>SHADOWS RECREATION CLUB</h1>
          <p>MEMBERSHIP CARD</p>
        </div>

        <img src={TeamShadowsLogo} className="pc-logo" />
      </div>

      <div className="pc-body">
        <div className="pc-photo">
          {photoUrl && <img src={photoUrl} alt="Member" />}
        </div>

        <div className="pc-info">
          <h2>{member.name}</h2>
          <p>{member.memberId}</p>
          <p>{member.mobile}</p>
        </div>
      </div>

      <div className="pc-address">
        <span>ADDRESS</span>
        <p>{member.address}</p>
      </div>

      <div className="pc-note">
        This card remains the property of SHADOWS RECREATION CLUB. Present at entry. Non-transferable.
      </div>

      <div className="pc-gold-bar"></div>
    </div>
  );
}

export default MemberCardPrintTemplate;