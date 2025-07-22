import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './toast.css';

// Define the types for the props
interface ErrorToastProps {
  message: string;
  closeToast?: () => void; // Optional in case you want to handle close action later
}

interface ToasterProps {
  message: {
    error?: string;
    success?: string;
  };
}

// ErrorToast component with type annotations
const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => (
  <div>
    {message.split("\n").map((line, index) => (
      <p key={index}>{line}</p>
    ))}
  </div>
);

// Toaster component with type annotations
const Toaster: React.FC<ToasterProps> = ({ message = {} }) => {
  useEffect(() => {
    if (message?.error) {
      toast.error(<ErrorToast message={message.error} />, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } else if (message?.success) {
      toast.success(message.success, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        className: "toast-success",
        progress: undefined,
      });
    }
  }, [message]);

  return <ToastContainer />;
};

export default Toaster;
