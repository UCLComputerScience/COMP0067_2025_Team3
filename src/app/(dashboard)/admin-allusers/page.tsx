import React from "react";

const AdminAllUsers = () => {
  const AllUsers = () => {
    return <span>You are an admin, and you can see your user records here!</span>;
  };

  return (
    <div>
      <h1><AllUsers /></h1>
    </div>
  );
};

export default AdminAllUsers;
