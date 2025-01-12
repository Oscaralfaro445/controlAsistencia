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
      (emp) => emp.NumEmpleado === empleado
    );

    if (empleadoEncontrado) {
      setEmpleadoSeleccionado(empleadoEncontrado);
    } else {
      setEmpleadoSeleccionado(null);
      alert("Empleado no encontrado. Verifica el número de empleado.");
    }
  };

  const handleDeleteEmpleado = async () => {
    if (
      confirm("¿Estás seguro de que deseas elemirar al empleado del resgitro?")
    ) {
      try {
        const response = await fetch(
          "http://localhost/control_Asistencia/php/deleteEmpleado.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ empleado }),
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log(data);
        if (data.cod === 1) {
          alert("Empleado eliminado exitosamente.");
          setEmpleado("");
        } else {
          alert("No se pudo eliminar el empleado. " + data.msj);
        }
      } catch (error) {
        console.error("Error en la conexión al servidor.", error);
      }

      setEmpleado("");
      setEmpleadoSeleccionado(null);
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
            {accionSeleccionada === "alta" && (
              <div className="mt-6">
                <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
                  Alta de Empleado
                </h3>
                <form onSubmit={handleAltaSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="NumEmpleado"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de Empleado
                    </label>
                    <input
                      type="number"
                      name="NumEmpleado"
                      id="NumEmpleado"
                      value={formData.NumEmpleado || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <div className="mb-4">
                      <label
                        htmlFor="CURP"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CURP
                      </label>
                      <input
                        type="text"
                        name="CURP"
                        id="CURP"
                        value={formData.CURP || ""}
                        onChange={handleFormChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="Nombre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre(s)
                    </label>
                    <input
                      type="text"
                      name="Nombre"
                      id="Nombre"
                      value={formData.Nombre || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="PrimerApe"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      name="PrimerApe"
                      id="PrimerApe"
                      value={formData.PrimerApe || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="SegundoApe"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="SegundoApe"
                      id="SegundoApe"
                      value={formData.SegundoApe || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="Academia"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Academia
                    </label>
                    <select
                      name="Academia"
                      id="Academia"
                      value={formData.Academia || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Selecciona una academia
                      </option>
                      <option value="null">
                        No pertenece a alguna de las opciones
                      </option>
                      <option value="ACB">Academia de Ciencias Básicas</option>
                      <option value="ACC">
                        Academia de Ciencias de la Comunicación
                      </option>
                      <option value="ACD">Academia de Ciencia de Datos</option>
                      <option value="ACS">Academia de Ciencias Sociales</option>
                      <option value="AFSE">
                        Academia de Fundamentos de Sistemas Electrónicos
                      </option>
                      <option value="AIA">
                        Academia de Inteligencia Artificial
                      </option>
                      <option value="AIS">
                        Academia de Ingeniería de Software
                      </option>
                      <option value="APETD">
                        Academia de Proyectos Estratégicos y Toma de Decisiones
                      </option>
                      <option value="ASDIG">
                        Academia de Sistemas Digitales
                      </option>
                      <option value="ASDIS">
                        Academia de Sistemas Distribuidos
                      </option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="Rol"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rol
                    </label>
                    <select
                      name="Rol"
                      id="Rol"
                      value={formData.Rol}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Selecciona el rol
                      </option>
                      <option value="Administrador">Administrador</option>
                      <option value="Docente">Docente</option>
                      <option value="Jefe">Jefe</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            )}

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
                    <div className="mt-8">
                      <button
                        className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
                        onClick={() => handleDeleteEmpleado()}
                      >
                        Eliminar empleado
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {accionSeleccionada === "lectura" && (
              <div className="mt-6">
                <h3 className="text-lg text-center font-semibold text-gray-800 mb-4">
                  Lista de Empleados
                </h3>
                <div className="overflow-x-auto">
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
                      {empleados.map((empleado) => (
                        <tr key={empleado.CURP} className={"bg-gray-50"}>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.NumEmpleado}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.CURP}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.Nombre}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.PrimerApe}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.SegundoApe}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.Academia}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {empleado.rol}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {accionSeleccionada === "modificacion" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Modificación de Empleado
                </h3>
                <p>Selecciona el empleado a modificar.</p>
                <ul>
                  {empleados.map((emp) => (
                    <li key={emp.email} className="mb-2">
                      {emp.nombre} {emp.apellido}
                      <button
                        onClick={() =>
                          handleModificacionSubmit(emp.email, {
                            nombre: "Nuevo Nombre",
                          })
                        }
                        className="ml-4 text-yellow-600 hover:text-yellow-800"
                      >
                        Modificar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {selectedOption === "configuraciones" && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Configuraciones del Sistema
            </h2>
            <p className="text-gray-600 mt-2">
              Aquí puedes gestionar las configuraciones generales del sistema.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
