import { toast } from "react-toastify";

export const notify = (message) => {
  
  
    
    toast.info(message, {
      position: "top-center",
      autoClose: 8000,
      className: "need-to-drink-toast",
    });
  
};