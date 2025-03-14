import React from "react";

const ResearcherProfile = () => {
  const MyProfile = () => {
    return <span>You are a researcher, and you can manage your profile here!</span>;
  };

  return (
    <div>
      <h1><MyProfile /></h1>
    </div>
  );
};

export default ResearcherProfile;
