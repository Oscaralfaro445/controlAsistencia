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

    // Función para obtener la fecha en español
    const formatDateInSpanish = (date) => {
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };
      // Obtiene la fecha en español con el formato "día mes, año"
      return date.toLocaleDateString('es-ES', options);
    };
    // Extraer la hora de `formData.newTime`
    const timeOnly = formData.newTime.split("T")[1]; // Obtiene "18:30" de "2025-01-14T18:30"
    // Extraer la hora de `formData.newTime`
    const yearOnly = formData.newTime.split("-")[0];

    // Función para generar el PDF con los datos
    const generatePDF = () => {
    const doc = new jsPDF();
    
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        
        const logoSize = 20;
        const margin = 10;
    
        doc.addImage("../imgs/logoIPN.jpg", "JPEG", margin, margin, logoSize, logoSize);
        doc.addImage("../imgs/logoESCOM.jpg", "JPEG", 190 - logoSize, margin, logoSize, logoSize);

        // Muestra un contenido diferente para cada Tipo de Justificante
        if (justificanteType === "Corrimiento de horario"){
          //CORRIMIENTO DE HORARIO
          doc.setTextColor("#9B1003");
          doc.text("INSTITUTO POLITÉCNICO NACIONAL", 105, 20, { align: "center" });
          doc.setTextColor("#0979B0");
          doc.text("ESCUELA SUPERIOR DE CÓMPUTO", 105, 28, { align: "center" });
          doc.setTextColor("black");
          doc.text("SUBDIRECCIÓN ACADÉMICA", 105, 36, { align: "center" });
        
          // Departamento académico (genérico, se puede cambiar dinámicamente)
          doc.setFontSize(12);
          doc.text("[NOMBRE DEL DEPARTAMENTO ACADÉMICO]", 105, 50, { align: "center" });
        
          doc.setFontSize(14);
          doc.text("MEMORANDUM", 105, 70, { align: "center" });
        
          doc.setFontSize(12);

          // Fecha ACTUAL en español
          const currentDate = formatDateInSpanish(new Date());
          doc.text(`${currentDate}`, 140, 87); // Fecha en formato español
        
          // Convertir selectedDate (string) a un objeto Date
          const selectedDateObject = new Date(selectedDate);
    
          // Formatear selectedDate al formato en español
          const formattedSelectedDate = formatDateInSpanish(selectedDateObject);
    
          doc.text(`MEMO/{ID-DEPACADEMICO}/{CONSECUTIVO}(?)/${yearOnly}`, 20, 95);
        
          doc.text(`DE: {NOMBRE DE JEFE ACADÉMICO}`, 20, 115);
          doc.text(`JEFE DE {NOMBRE DEL DEPARTAMENTO ACADÉMICO}`, 20, 123);    
          doc.text(`PARA: {NOMBRE JEFE DCH}`, 20, 140);
          doc.text(`JEFE DEL DEPARTAMENTO DE CAPITAL HUMANO`, 20, 148);
        
          doc.text(`Asunto: ${justificanteType}`, 20, 165);
        
          // Contenido principal
          doc.setFont("helvetica", "normal");
          doc.text(
            "Por medio de la presente solicito a usted tenga a bien considerar que", 20, 180
          );
          doc.text(
            `{nombre del empleado} con número de empleado {núm. empleado} laborará, por`, 20, 188
          );
          doc.text(
            `necesidades de esta unidad, el día ${formattedSelectedDate} en un horario de ${timeOnly}`, 20, 196
          );
    
          doc.text(
            "Quedo a sus órdenes para cualquier duda al respecto y aprovecho para enviarle un cordial", 20, 220
          );
          doc.text("saludo.", 20, 228);
        
          doc.setFont("helvetica", "bold");
          doc.text("ATENTAMENTE", 105, 260, { align: "center" });
      
          doc.save(`CorrimientoHorario_${selectedDate}.pdf`);

        }else if (justificanteType === "Pago de tiempo"){
          // PAGO DE TIEMPO 
          doc.setTextColor("#9B1003");
          doc.text("INSTITUTO POLITÉCNICO NACIONAL", 105, 20, { align: "center" });
          doc.setTextColor("#0979B0");
          doc.text("ESCUELA SUPERIOR DE CÓMPUTO", 105, 28, { align: "center" });
          doc.setTextColor("black");
          doc.text("SUBDIRECCIÓN ACADÉMICA", 105, 36, { align: "center" });
          
          // Departamento académico (genérico, se puede cambiar dinámicamente)
          doc.setFontSize(12);
          doc.text("[NOMBRE DEL DEPARTAMENTO ACADÉMICO]", 105, 50, { align: "center" });
        
          doc.setFontSize(14);
          doc.text("MEMORANDUM", 105, 70, { align: "center" });
        
          doc.setFontSize(12);

          // Fecha ACTUAL en español
          const currentDate = formatDateInSpanish(new Date());
          doc.text(`${currentDate}`, 140, 87); // Fecha en formato español
        
          // Convertir selectedDate (string) a un objeto Date
          const selectedDateObject = new Date(selectedDate);

          // Formatear selectedDate al formato en español
          const formattedSelectedDate = formatDateInSpanish(selectedDateObject);
        
          doc.text(`MEMO/{ID-DEPACADEMICO}/{CONSECUTIVO}(?)/2025`, 20, 95);
        
          doc.text(`DE: {NOMBRE DE JEFE ACADÉMICO}`, 20, 115);
          doc.text(`JEFE DE {NOMBRE DEL DEPARTAMENTO ACADÉMICO}`, 20, 123);    
          doc.text(`PARA: {NOMBRE JEFE DCH}`, 20, 140);
          doc.text(`JEFE DEL DEPARTAMENTO DE CAPITAL HUMANO`, 20, 148);
        
          doc.text(`Asunto: ${justificanteType}`, 20, 165);
        
          // Contenido principal
          doc.setFont("helvetica", "normal");
          doc.text(
            "Por medio de la presente solicito a usted tenga a bien considerar que", 20, 180
          );
          doc.text(
            `{nombre del empleado} con número de empleado {núm. empleado}, el día`, 20, 188
          );
          doc.text(
            `${formattedSelectedDate} con motivo...`, 20, 196
          );
          doc.text(
            `{descripción de la incidencia};`, 20, 204
          );
          doc.text(
            "entonces para reponer estas horas será de la siguiente manera:", 20, 212
          );
          
          //tabla de horas
          doc.text(
            "Fechas seleccionadas.", 20, 225
          );
          doc.text(
            `${formData.startDate} - ${formData.endDate}`, 20, 233
          );

          doc.text(
            "Quedo a sus órdenes para cualquier duda al respecto y aprovecho para enviarle un cordial", 20, 246
          );
          doc.text("saludo.", 20, 254);
        
          doc.setFont("helvetica", "bold");
          doc.text("ATENTAMENTE", 105, 270, { align: "center" });
      
          doc.save(`PagoTiempo_${selectedDate}.pdf`);

        } else if (justificanteType === "Día económico") {
          // DÍA ECONÓMICO
          doc.setTextColor("#9B1003");
          doc.text("INSTITUTO POLITÉCNICO NACIONAL", 105, 20, { align: "center" });
          doc.setTextColor("#0979B0");
          doc.text("ESCUELA SUPERIOR DE CÓMPUTO", 105, 28, { align: "center" });
          doc.setTextColor("black");
          doc.setFontSize(12);
          doc.text("SUBDIRECCIÓN ADMINISTRATIVA", 105, 36, { align: "center" });
          doc.text("DEPARTAMENTO DE CAPITAL HUMANO", 105, 42, { align: "center" });
          doc.text(`Asunto: ${justificanteType}`, 105, 50, { align: "center" });
          
          // Fecha ACTUAL en español
          const currentDate = formatDateInSpanish(new Date());
          doc.text(`Ciudad de México a ${currentDate}`, 110, 67); // Fecha en formato español
        
          // Convertir selectedDate (string) a un objeto Date
          const selectedDateObject = new Date(selectedDate);
          // Formatear selectedDate al formato en español
          const formattedSelectedDate = formatDateInSpanish(selectedDateObject);

          doc.text("[NOMBRE JEFE DCH]", 20, 80);
          doc.text("JEFE DEL DEPARTAMENTO DE CAPITAL HUMANO", 20, 85);
          doc.text("PRESENTE", 20, 95);
        
          // Contenido principal
          doc.setFont("helvetica", "normal");
          doc.text(
            `Nombre del empleado: {Nombre del empleado} \t {ROL}`, 20, 115
          );
          doc.text(
            `Número de empleado: {Número Empleado}`, 20, 123
          );
          doc.text(
            `(?)Área de Adscripción: {(puede ser su departamento)}`, 20, 131
          );
          doc.text(
            `Fecha de incidencia: ${formattedSelectedDate}`, 20, 139
          );
        
          doc.text("Tipo incidencia: {}", 20, 150);
          /*EL PDF MARCA 3 TIPOS DE INCIDENCIA PARA ESTE FORMATO:
          -> RETARDO MENOR
          -> RETARDO MAYOR
          -> DIA ECONOMICO
          */

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);

          doc.text("____________________", 45, 254, { align: "center" });
          doc.text("____________________", 105, 254, { align: "center" });
          doc.text("____________________________", 165, 254, { align: "center" });

          doc.text("INTERESADO", 45, 260, { align: "center" });
          doc.text(`{Nombre Empleado}`, 45, 270, { align: "center" });
          doc.text("JEFE INMEDIATO", 105, 260, { align: "center" });
          doc.text(`{Nombre Jefe}`, 105, 270, { align: "center" });
          doc.text("JEFE DEL DEPARTAMENTO DE", 165, 260, { align: "center" });
          doc.text("DE CAPITAL HUMANO", 165, 264, { align: "center" });
          doc.text(`{Nombre Jefe DCH}`, 165, 270, { align: "center" });
      
          doc.save(`DiaEconomico_${selectedDate}.pdf`);
            }
        
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
