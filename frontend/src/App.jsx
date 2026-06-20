import { useState } from "react";

import Login from "./Login";
import AadhaarUpload from "./AadhaarUpload";
import MembersList from "./MembersList";
import MemberCardPage from "./MemberCardPage";
import MemberFormPage from "./MemberFormPage";
import MemberDocumentPage from "./MemberDocumentPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("create");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setPage("create");
  };

 if (window.location.pathname === "/member-card") {
  return <MemberCardPage />;
}

if (window.location.pathname === "/member-form") {
  return <MemberFormPage />;
}

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (page === "members") {
    return <MembersList onBack={() => setPage("create")} />;
  }

  if (window.location.pathname === "/member-document") {
  return <MemberDocumentPage />;
}

  return (
    <AadhaarUpload
      onLogout={handleLogout}
      onViewMembers={() => setPage("members")}
    />
  );
}

export default App;