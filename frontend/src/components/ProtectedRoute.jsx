import React, { useEffect, useState } from "react";
import { protectedAPI } from "../services/authService";

const ProtectedRoute = () => {
  const [value, setValue] = useState();
  useEffect(() => {
    const call = async () => {
      const res = await protectedAPI();
      setValue(res.message);
    };
    call();
  }, []);
  return (
    <>
      <div>Hello Protected page</div>
      <div>{value}</div>
    </>
  );
};

export default ProtectedRoute;
