import { useState } from "react";
import useAuthContext from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);
  const [empleados, setEmpleados] = useState([]); // Este estado puede contener la lista de empleados
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
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

  const handleAltaSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario de alta de empleado
    console.log("Alta de empleado:", formData);
    // Simulando la adición del nuevo empleado
    setEmpleados([...empleados, formData]);
    setFormData({ nombre: "", apellido: "", email: "" }); // Limpiar formulario
  };

  const handleBajaSubmit = (numEmpleado) => {
    // Lógica para eliminar un empleado (simulada)
    setEmpleados(empleados.filter((emp) => emp.numEmpleado !== numEmpleado));
  };

  const handleLecturaSubmit = async () => {
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
        console.log(empleados);
      } else {
        console.log(data.msj);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor.", error);
    }
    console.log("Mostrando empleados");
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
            onClick={handleLogout}
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
                onClick={() => handleAccionClick("lectura")}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Alta de Empleado
                </h3>
                <form onSubmit={handleAltaSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="NumEmpleado"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre(s)
                    </label>
                    <input
                      type="number"
                      name="NumEmpleado"
                      id="NumEmpleado"
                      value={formData.NumEmpleado}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nombre(s)
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellido Paterno
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="apellido"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Apellido Materno
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      id="apellido"
                      value={formData.apellido}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
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
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Baja de Empleado
                </h3>
                <p>Selecciona el empleado a dar de baja.</p>
                <ul>
                  {empleados.map((emp) => (
                    <li key={emp.email} className="mb-2">
                      {emp.nombre} {emp.apellido}
                      <button
                        onClick={() => handleBajaSubmit(emp.email)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {accionSeleccionada === "lectura" && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Lista de Empleados
                </h3>
                <ul>
                  {empleados.map((empleado) => (
                    <li key={empleado.CURP} className="mb-2">
                      {empleado.NumEmpleado} {empleado.CURP} {empleado.Nombre}
                      {empleado.PrimerApe} {empleado.SegundoApe}
                      {empleado.Academia}
                      {empleado.Email} {empleado.rol}
                    </li>
                  ))}
                </ul>
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
