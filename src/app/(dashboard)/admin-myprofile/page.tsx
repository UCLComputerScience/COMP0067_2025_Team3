

import React from "react";
const AdminProfile = () => {
  const MyProfile = () => {
    return <span>You are an admin, and you can manage your profile here!</span>;
  };

  return (
    <div>
      <h1><MyProfile /></h1>
    </div>
  );
};

export default AdminProfile ;
