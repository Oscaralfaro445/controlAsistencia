<?php

include "connection.php";

header('Content-Type: application/json'); // Asegúrate de que la respuesta sea JSON

// Verifica si el usuario tiene la sesión activa
if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit();
}

$NumEmpleado = $_POST['empleado'];

// Asegúrate de que el valor de $NumEmpleado es seguro antes de usarlo en la consulta SQL
$NumEmpleado = $conexion->real_escape_string($NumEmpleado); // Escapar valores para evitar inyecciones SQL

$sql = "DELETE FROM empleados WHERE NumEmpleado = '$NumEmpleado'";

if ($conexion->query($sql) === TRUE) {
    echo json_encode([
        "cod" => 1,
        "msj" => "Empleado eliminado exitosamente.",
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "Error al eliminar el empleado: " . $conexion->error,
    ]);
}

$conexion->close();
?>
