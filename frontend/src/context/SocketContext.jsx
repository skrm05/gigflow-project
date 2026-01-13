import { createContext, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const SocketContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socket = io(backendUrl);
export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.emit("setup", user._id);
    }
    const handleHired = (data) => {
      if (user && data.freelancerId === user._id) {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    };

    socket.on("hired-notification", handleHired);
    return () => {
      socket.off("hired-notification", handleHired);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
