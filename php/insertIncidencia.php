<?php

include "connection.php";

// Verificar si el usuario tiene una sesión activa
if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}

// Obtener datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

// Validar datos recibidos
$NumEmpleado = $data["NumEmpleado"] ?? null;
$TipoIncidencia = $data["TipoIncidencia"] ?? null;
$Estado = $data["Estado"] ?? "Pendiente";
$FechaSolicitud = $data["FechaSolicitud"] ?? null;

if (!$NumEmpleado || !$TipoIncidencia || !$FechaSolicitud) {
    echo json_encode([
        "cod" => 0,
        "msj" => "Datos incompletos. Por favor verifica tu solicitud.",
        "icono" => "error"
    ]);
    exit;
}

// Preparar la consulta para insertar la incidencia
$sqlInsert = "
    INSERT INTO registroIncidencias (NumEmpleado, TipoIncidencia, Estado, FechaSolicitud)
    VALUES (?, ?, ?, ?)
";

$stmt = $conexion->prepare($sqlInsert);
$stmt->bind_param("ssss", $NumEmpleado, $TipoIncidencia, $Estado, $FechaSolicitud);

if ($stmt->execute()) {
    echo json_encode([
        "cod" => 1,
        "msj" => "Incidencia registrada correctamente.",
        "icono" => "success"
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "Error al registrar la incidencia: " . $conexion->error,
        "icono" => "error"
    ]);
}

$conexion->close();

?>
