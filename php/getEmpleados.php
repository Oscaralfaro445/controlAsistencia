<?php

include "connection.php";

// Verifica si el usuario tiene la sesión activa
if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}

// Consulta a la tabla empleados
$sqlEmpleado = "SELECT * FROM empleados";
$result = $conexion->query($sqlEmpleado);

if ($result->num_rows > 0) {
    $empleados = [];
    
    // Recorre los resultados y guarda cada empleado en un array
    while ($empleado = $result->fetch_assoc()) {
        $empleados[] = $empleado;
    }

    echo json_encode([
        "cod" => 1,
        "msj" => "Información de empleados obtenida correctamente.",
        "icono" => "success",
        "empleados" => $empleados
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "No se encontraron empleados.",
        "icono" => "error"
    ]);
}

$conexion->close();

?>
