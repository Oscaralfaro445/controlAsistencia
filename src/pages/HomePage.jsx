import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/useAuthContext"; // Hook de autenticación
import AdminPage from "../components/AdminPage";
import DocentePage from "../components/DocentePage";
import JefePage from "../components/JefePage";

const HomePage = () => {
  const [error, setError] = useState(null);
  const { login, user } = useAuthContext(); // Combina hooks para login y usuario
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Verifica si hay un usuario en localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        // Si existe, conviértelo en objeto y actualiza el estado y el contexto
        const parsedUser = JSON.parse(storedUser);
        login(parsedUser); // Actualiza el contexto con los datos del usuario desde localStorage
      } else {
        // Si no hay usuario en localStorage, redirige al login
        navigate("/");
      }
    } else {
      // Aquí puedes hacer la lógica de obtener los datos del empleado
      const datosEmpleado = async () => {
        try {
          const response = await fetch(
            "http://localhost/control_Asistencia/php/getEmpleado.php",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              credentials: "include",
            }
          );

          const data = await response.json();
          if (data.cod === 1) {
            setError(null);
            login({
              ...user,
              CURP: data.empleado.CURP,
              Nombre: data.empleado.Nombre,
              PrimerApe: data.empleado.PrimerApe,
              SegundoApe: data.empleado.SegundoApe,
            });
          } else {
            setError(data.msj);
          }
        } catch (error) {
          setError("Error al conectar con el servidor.");
          console.error(error);
        }
      };

      datosEmpleado(); // Llama a la función para cargar los datos del empleado
    }
  }, [user, navigate, login]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-4 shadow-md">
        <img
          src="/imgs/headerMain.jpg"
          alt="Imagen ESCOM"
          className="mx-auto w-full max-w-4xl h-40 object-cover rounded-md"
        />
      </header>

      {/* Contenido principal */}
      <main className="w-full flex flex-col items-center mt-6 flex-1">
        <div className="w-5/6 bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Bienvenido, {user ? user.Nombre : ""}
          </h1>
          {/* Renderiza la página según el rol */}
          {user && user.rol === "Administrador" && <AdminPage />}
          {user && user.rol === "Docente" && <DocentePage />}
          {user && user.rol === "Jefe" && <JefePage />}
        </div>
      </main>

      {/* Mensaje de error si ocurre */}
      {error && (
        <div className="text-center text-red-500 mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
