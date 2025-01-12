import { useState, useEffect } from "react";
import useAuthContext from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // Librería jsPDF para generar PDFs

const DocentePage = () => {
  const navigate = useNavigate();
  const { logout, login, user } = useAuthContext();
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [incidencias, setIncidencias] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // Estado para la fecha seleccionada

  // Estado para manejar el wizard
  const [step, setStep] = useState(1); // Paso actual del wizard
  const [justificanteType, setJustificanteType] = useState(""); // Tipo de justificante
  const [formData, setFormData] = useState({
    dias: "",
    horarios: "",
    motivo: "",
    startDate: "", // Fecha de inicio (para Pago de tiempo)
    endDate: "", // Fecha de fin (para Pago de tiempo)
    newTime: "", // Nuevo horario (para Corrimiento de horario)
  }); // Datos del formulario

  // Funciones de menú
  const handleMenuClick = (option) => {
    setSelectedOption(option);
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Función para manejar la selección del tipo de justificante
  const handleJustificanteSelect = (type) => {
    setJustificanteType(type);
    setStep(2); // Ir al siguiente paso
  };

  // Función para manejar el cambio en los campos del formulario
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para generar el PDF con los datos
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.text(`Reporte de Asistencia - Fecha: ${selectedDate}`, 10, 10);

    // Aquí agregamos los datos según el tipo de justificante
    doc.text(`Tipo de Justificante: ${justificanteType}`, 10, 20);

    if (justificanteType === "Pago de tiempo") {
      doc.text(
        `Fechas seleccionadas: ${formData.startDate} - ${formData.endDate}`,
        10,
        30
      );
    } else if (justificanteType === "Corrimiento de horario") {
      doc.text(`Nuevo horario: ${formData.newTime}`, 10, 30);
    } else if (justificanteType === "Día económico") {
      doc.text(`Motivo: ${formData.motivo}`, 10, 30);
    }

    doc.save(`reporte_asistencia_${selectedDate}.pdf`);
  };

  const handleLogout = () => {
    logout();
    window.history.replaceState(null, "", "/");
    navigate("/");
  };

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
            setIncidencias(data.incidencias);
            login({
              ...user,
              NumEmpleado: data.NumEmpleado,
              Academia: data.Academia,
            });
          } else {
            console.log(data.msj);
          }
        } catch (error) {
          console.error("Error al conectar con el servicio.", error);
        }
      };
      fetchIncidencias();
      console.log(user.NumEmpleado);
      console.log(user.Academia);
    }
  }, []);

  return (
    <div className="w-full flex min-h-screen">
      {/* Barra lateral */}
      <aside className="w-1/4 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-semibold mb-6">Menú de Docente</h2>
        <ul className="space-y-4">
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("dashboard")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("solicitud")}
          >
            Solicitud de incidencias
          </li>
          <li
            className="cursor-pointer hover:bg-blue-600 p-3 rounded-md"
            onClick={() => handleMenuClick("registro")}
          >
            Registro de incidencias
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
          Área de Docente
        </h1>
        <p className="text-lg text-gray-600">
          Bienvenido, aquí puedes gestionar el sistema como docente.
        </p>

        {/* Wizard para control de incidencias */}
        {selectedOption === "solicitud" && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Control de incidencias
            </h2>
            <p className="text-gray-600 mt-2">
              Selecciona una fecha para generar el reporte de asistencia:
            </p>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mt-4 p-2 border rounded-md"
            />

            {/* Paso 1: Selección del tipo de justificante */}
            {step === 1 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  Selecciona el tipo de justificante
                </h3>
                <div className="space-y-2 mt-4">
                  <button
                    className="p-2 bg-blue-500 text-white rounded-md w-full"
                    onClick={() => handleJustificanteSelect("Pago de tiempo")}
                  >
                    Pago de tiempo
                  </button>
                  <button
                    className="p-2 bg-blue-500 text-white rounded-md w-full"
                    onClick={() =>
                      handleJustificanteSelect("Corrimiento de horario")
                    }
                  >
                    Corrimiento de horario
                  </button>
                  <button
                    className="p-2 bg-blue-500 text-white rounded-md w-full"
                    onClick={() => handleJustificanteSelect("Día económico")}
                  >
                    Día económico
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Formulario según tipo de justificante */}
            {step === 2 && (
              <div className="mt-4">
                {justificanteType === "Pago de tiempo" && (
                  <div>
                    <h3 className="text-lg font-semibold">Pago de tiempo</h3>
                    <div className="mt-4">
                      <label className="block">Fecha de inicio:</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        className="p-2 border rounded-md w-full"
                      />
                      <label className="block mt-4">Fecha de fin:</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                        className="p-2 border rounded-md w-full"
                      />
                    </div>
                  </div>
                )}

                {justificanteType === "Corrimiento de horario" && (
                  <div>
                    <h3 className="text-lg font-semibold">
                      Corrimiento de horario
                    </h3>
                    <div className="mt-4">
                      <label className="block">Nuevo horario:</label>
                      <input
                        type="datetime-local"
                        name="newTime"
                        value={formData.newTime}
                        onChange={handleFormChange}
                        className="p-2 border rounded-md w-full"
                      />
                    </div>
                  </div>
                )}

                {justificanteType === "Día económico" && (
                  <div>
                    <h3 className="text-lg font-semibold">Día económico</h3>
                    <div className="mt-4">
                      <label className="block">Motivo de la incidencia:</label>
                      <textarea
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleFormChange}
                        className="p-2 border rounded-md w-full"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={generatePDF}
                  className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                >
                  Generar Reporte PDF
                </button>
              </div>
            )}
          </div>
        )}

        {selectedOption === "registro" && (
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
                  .filter(
                    (incidencia) => incidencia.NumEmpleado === user.NumEmpleado
                  )
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
                        {incidencia.Estado}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {incidencia.FechaSolicitud}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

export default DocentePage;
