import React from "react";
import Button from "./button";

const AppBar: React.FC = () => {
  return (
    <div className="appbar">
      <span className="title">Card Builder</span>
      <div className="actions"></div>
    </div>
  );
};

export default AppBar;
