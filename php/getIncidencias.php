<?php

include "connection.php";

if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}

// Consulta a la tabla incidencias
$sqlIncidencias = "
    SELECT 
        ri.ID,
        ri.NumEmpleado,
        ri.TipoIncidencia,
        ri.Estado,
        ri.FechaSolicitud,
        e.Nombre,
        e.Academia
    FROM 
        registroIncidencias ri
    INNER JOIN 
        empleados e ON ri.NumEmpleado = e.NumEmpleado
";
$result = $conexion->query($sqlIncidencias);

if($result->num_rows > 0) {
    $incidencias = [];

    while($incidencia = $result->fetch_assoc()) {
        $incidencias[] = $incidencia;
    }

    echo json_encode([
        "cod" => 1,
        "msj" => "Información de incidencias obtenida correctamente.",
        "icono" => "success",
        "incidencias" => $incidencias
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "No se encontraron incidencias.",
        "icono" => "error"
    ]);
}

$conexion->close();

?> 