import React from "react";

const ClinicianProfile = () => {
  const MyProfile = () => {
    return <span>You are a clinician, and you can manage your profile here!</span>;
  };

  return (
    <div>
      <h1><MyProfile /></h1>
    </div>
  );
};

export default ClinicianProfile ;
