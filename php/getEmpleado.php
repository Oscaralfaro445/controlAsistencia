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
$NumEmpleado = $_SESSION["NumEmpleado"];
$sqlEmpleado = "SELECT NumEmpleado, CURP, Nombre, PrimerApe, SegundoApe, Academia FROM empleados WHERE NumEmpleado = ?";
$stmt = $conexion->prepare($sqlEmpleado);
$stmt->bind_param("s", $NumEmpleado);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $empleado = $result->fetch_assoc();

    echo json_encode([
        "cod" => 1,
        "msj" => "Información del empleado obtenida correctamente.",
        "icono" => "success",
        "empleado" => $empleado
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "No se encontró información del empleado.",
        "icono" => "error"
    ]);
}

$stmt->close();
$conexion->close();

?>
