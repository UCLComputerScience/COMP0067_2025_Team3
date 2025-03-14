

import React from "react";

const ClinicianAllPatients = () => {
  const AllPatients = () => {
    return <span>You are a clinician, and you can see your patient records here!</span>;
  };

  return (
    <div>
      <h1><AllPatients /></h1>
    </div>
  );
};

export default ClinicianAllPatients;
