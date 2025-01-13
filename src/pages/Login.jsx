import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/useAuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ NumEmpleado: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/control_Asistencia/php/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "include",
          body: new URLSearchParams(formData).toString(),
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.cod === 1) {
        setError(null);
        login({
          NumEmpleado: data.NumEmpleado,
          Academia: data.Academia,
          rol: data.rol,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            NumEmpleado: data.NumEmpleado,
            rol: data.rol,
            Academia: data.Academia,
          })
        );
        navigate(`/homePage/${data.rol}`);
      } else {
        setError(data.msj);
      }
    } catch (error) {
      setError("Error al conectar con el servidor.");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-400 flex justify-center items-center">
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="/imgs/bg_log.jpg"
            alt="Logo"
            className="w-96 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500">Accede a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label
              htmlFor="NumEmpleado"
              className="block text-lg font-medium text-gray-700"
            >
              Número de Empleado
            </label>
            <input
              type="text"
              name="NumEmpleado"
              id="NumEmpleado"
              onChange={handleChange}
              value={formData.NumEmpleado}
              required
              className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
              required
              className="mt-2 block w-full px-6 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-6 text-red-600 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
