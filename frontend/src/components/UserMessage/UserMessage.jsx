import React from "react";
import "./UserMessage.css";

const UserMessage = ({ message, type, messageShow }) => {
  if (!messageShow) return null;

  return <div className={`user-message ${type}`}>{message}</div>;
};

export default UserMessage;
