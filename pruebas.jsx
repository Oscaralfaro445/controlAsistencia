import { useEffect, useState } from "react";
import useAuthContext from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [empleado, setEmpleado] = useState("");
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]); // Este estado puede contener la lista de empleados
  const [formData, setFormData] = useState({
    NumEmpleado: "",
    CURP: "",
    Nombre: "",
    PrimerApe: "",
    SegundoApe: "",
    Academia: "",
    Rol: "",
  });

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  const handleAccionClick = (accion) => {
    setAccionSeleccionada(accion);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAltaSubmit = async (e) => {
    e.preventDefault();

    const curpRegex = /^[A-Z]{4}[0-9]{6}[A-Z]{7}[0-9]{1}$/;
    if (!curpRegex.test(formData.CURP)) {
      alert("CURP inválido. Verifica los datos ingresados.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/control_Asistencia/php/altaEmpleado.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.cod === 1) {
        alert("Empleado registrado exitosamente.");
        setFormData({
          NumEmpleado: "",
          CURP: "",
          Nombre: "",
          PrimerApe: "",
          SegundoApe: "",
          Academia: "",
          Rol: "",
        });
      } else if (data.cod === 0) {
        alert(data.msj);
      }
    } catch (error) {
      console.error("Error en la conexión al servidor.", error);
    }
  };

  const handleBajaSubmit = () => {
    const empleadoEncontrado = empleados.find(
      (emp) => emp.numEmpleado === empleado
    );

    if (empleadoEncontrado) {
      setEmpleadoSeleccionado(empleadoEncontrado);
    } else {
      setEmpleadoSeleccionado(null);
      alert("Empleado no encontrado. Verifica el número de empleado.");
    }
  };

  const handleLecturaSubmit = async () => {
    setAccionSeleccionada("lectura");
  };

  const handleModificacionSubmit = (numEmpleado, nuevoEmpleado) => {
    // Lógica para modificar la información de un empleado
    setEmpleados(
      empleados.map((emp) =>
        emp.numEmpleado === numEmpleado ? { ...emp, ...nuevoEmpleado } : emp
      )
    );
  };

  const handleLogout = () => {
    logout();
    window.history.replaceState(null, "", "/");
    navigate("/");
  };

  useEffect(() => {
    const fetchEmpelados = async () => {
      try {
        const response = await fetch(
          "http://localhost/control_Asistencia/php/getEmpleados.php",
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
          setEmpleados(data.empleados);
        } else {
          console.log(data.msj);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor.", error);
      }
    };

    fetchEmpelados();
  }, []);

  return (
    <div className="w-full flex min-h-screen">
      {/* Barra lateral */}
      <aside className="w-1/4 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Menú de Administrador</h2>
        <ul className="space-y-4">
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("usuarios")}
          >
            Usuarios
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("configuraciones")}
          >
            Configuraciones
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleLogout()}
          >
            Cerrar sesión
          </li>
        </ul>
      </aside>

      {/* Área de contenido */}
      <section className="flex-1 bg-gray-50 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Área de Administrador
        </h1>
        <p className="text-lg text-gray-600">
          Bienvenido, aquí puedes gestionar el sistema como administrador.
        </p>

        {/* Condicional para mostrar el contenido según la opción seleccionada */}
        {selectedOption === "dashboard" && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Estadísticas
            </h2>
            <p className="text-gray-600 mt-2">
              Aquí se mostrarán las estadísticas generales del sistema.
            </p>
          </div>
        )}

        {selectedOption === "usuarios" && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Gestión de Usuarios
            </h2>
            <p className="text-gray-600 mt-2">
              Aquí puedes realizar las siguientes acciones con los usuarios:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                onClick={() => handleAccionClick("alta")}
              >
                Alta de Empleado
              </button>
              <button
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                onClick={() => handleAccionClick("baja")}
              >
                Baja de Empleado
              </button>
              <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => handleLecturaSubmit()}
              >
                Lista de Empleados
              </button>
              <button
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
                onClick={() => handleLecturaSubmit()}
              >
                Modificación de Empleados
              </button>
            </div>

            {/* Lógica según la acción seleccionada */}

            {accionSeleccionada === "baja" && (
              <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Baja de Empleado
                </h3>
                <div>
                  <label className="pr-4" htmlFor="empleado">
                    Ingresa el número de empleado:
                  </label>
                  <input
                    type="number"
                    name="empleado"
                    id="empleado"
                    className="mt-2 p-2 border rounded-md"
                    placeholder="Número de empleado"
                    value={empleado}
                    onChange={(e) => setEmpleado(e.target.value)}
                  />
                </div>
                <button
                  className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
                  onClick={() => handleBajaSubmit()}
                >
                  Buscar empleado
                </button>
                {empleadoSeleccionado ? (
                  <div className="mt-4">
                    <table className="min-w-full bg-gray-500 border border-gray-300">
                      <thead className="text-white">
                        <tr>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Número de Empleado
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            CURP
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Nombre
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Primer Apellido
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Segundo Apellido
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Academia
                          </th>
                          <th className="px-4 py-2 border border-gray-300 text-center">
                            Rol
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        <tr
                          key={empleadoSeleccionado.CURP}
                          className="bg-gray-50"
                        >
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.NumEmpleado}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.CURP}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.Nombre}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.PrimerApe}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.SegundoApe}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.Academia}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleadoSeleccionado.rol}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
