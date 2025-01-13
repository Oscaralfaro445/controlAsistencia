import { useEffect, useState } from "react";
import useAuthContext from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";

const JefePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [incidencias, setIncidencias] = useState([]);
  const [changedStates, setChangedStates] = useState({}); // Almacena los cambios realizados

  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    logout();
    window.history.replaceState(null, "", "/");
    navigate("/");
  };

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch(
          "http://localhost/control_Asistencia/php/getIncidencias.php",
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
          const incidenciasConEstado = data.incidencias.map((incidencia) => ({
            ...incidencia,
            Estado: incidencia.Estado || "Pendiente", // Establece un estado por defecto si está vacío
          }));
          setIncidencias(incidenciasConEstado);
        } else {
          console.log(data.msj);
        }
      } catch (error) {
        console.error("Error al conectar con el servicio.", error);
      }
    };

    fetchIncidencias();
  }, []);

  const handleStateChange = (id, newEstado) => {
    setChangedStates((prev) => ({
      ...prev,
      [id]: newEstado,
    }));

    setIncidencias((prev) =>
      prev.map((item) =>
        item.ID === id ? { ...item, Estado: newEstado } : item
      )
    );
  };

  const handleFinalize = async () => {
    console.log(changedStates);
    if (confirm("¿Desea actualizar almacenar los cambios en los estados?")) {
      try {
        const response = await fetch(
          "http://localhost/control_Asistencia/php/updateIncidencias.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(changedStates),
          }
        );

        /*  const result = await response.json(); */
        const text = await response.text(); // Obtener la respuesta como texto
        console.log(text); // Ver la respuesta antes de convertirla a JSON

        // Intentar convertir la respuesta a JSON
        const result = JSON.parse(text);
        if (result.cod === 1) {
          alert("Los cambios se guardaron correctamente.");
          setChangedStates({});
        } else if (result.cod === 0) {
          alert("Hubo un problema al guardar los cambios." + result.msj);
        }
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      }
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      <aside className="w-1/4 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">
          Menú de Jefe de Departamento
        </h2>
        <ul className="space-y-4">
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("solicitudes")}
          >
            Solicitudes de incidencias
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={handleLogout}
          >
            Cerrar sesión
          </li>
        </ul>
      </aside>

      <section className="flex-1 bg-gray-50 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Área de Jefe de Departamento
        </h1>
        <p className="text-lg text-gray-600">
          Bienvenido, aquí puedes gestionar el sistema como jefe de
          departamento.
        </p>

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

        {selectedOption === "solicitudes" && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-center text-xl font-semibold text-gray-800">
              Revisión de solicitudes de incidencias
            </h2>
            <table className="my-6 min-w-full bg-gray-500 border border-gray-300">
              <thead className="text-white">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Número de Empleado
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Nombre
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Academia
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Tipo de incidencia
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Estado
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-center">
                    Fecha de solicitud
                  </th>
                </tr>
              </thead>
              <tbody className="text-center">
                {incidencias
                  .filter((incidencia) => incidencia.Academia === user.Academia)
                  .map((incidencia) => (
                    <tr key={incidencia.ID} className={"bg-gray-50"}>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.NumEmpleado}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.Nombre}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.Academia}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.TipoIncidencia}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        <select
                          value={incidencia.Estado}
                          onChange={(e) =>
                            handleStateChange(incidencia.ID, e.target.value)
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.FechaSolicitud}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <button
              className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-lg"
              onClick={handleFinalize}
            >
              Finalizar
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JefePage;
