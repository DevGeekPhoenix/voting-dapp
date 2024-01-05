import { FC } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast: FC = () => {
  return (
    <ToastContainer
      position="top-left"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{ fontFamily: "inherit" }}
    />
  );
};

export default Toast;
