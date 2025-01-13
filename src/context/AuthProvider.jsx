import { useState } from "react";
import PropTypes from "prop-types";
import AuthContext from "./authContext";

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Aquí solo tenemos los datos en la memoria

  // Al iniciar sesión
  const login = (userData) => {
    setUser(userData); // Guarda el usuario en el estado
  };

  // Al cerrar sesión
  const logout = () => {
    setUser(null); // Elimina el usuario del estado
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validamos que 'children' sea un nodo (elemento o texto)
};
