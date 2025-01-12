import { useContext } from "react";
import AuthContext from "./authContext";

const useAuthContext = () => {
  return useContext(AuthContext);
};

export default useAuthContext;
