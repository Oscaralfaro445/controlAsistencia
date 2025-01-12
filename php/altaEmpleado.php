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

// Obtener los datos del POST
$NumEmpleado = $_POST['NumEmpleado'];
$CURP = $_POST['CURP'];
$Nombre = $_POST['Nombre'];
$PrimerApe = $_POST['PrimerApe'];
$SegundoApe = $_POST['SegundoApe'];
$Academia = $_POST['Academia'];
$Rol = $_POST['Rol'];

if(empty($Academia)) {
    $Academia = null;
}

$sqlValidacion = "SELECT * FROM empleados WHERE CURP = ? OR NumEmpleado = ?";
$stmt = $conexion->prepare($sqlValidacion);
$stmt->bind_param("si", $CURP, $NumEmpleado);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
      "cod" => 0, 
      "msj" => "El CURP o el Número de Empleado ya existen."]);
    $stmt->close();
    $conexion->close();
    exit;
}

// Insertar el nuevo empleado
$sqlInsert = "INSERT INTO empleados (NumEmpleado, CURP, Nombre, PrimerApe, SegundoApe, Academia, Rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmtInsert = $conexion->prepare($sqlInsert);
$stmtInsert->bind_param("issssss", $NumEmpleado, $CURP, $Nombre, $PrimerApe, $SegundoApe, $Academia, $Rol);

if ($stmtInsert->execute()) {
    echo json_encode(["cod" => 1, "msj" => "Empleado registrado exitosamente."]);
} else {
    echo json_encode(["cod" => 0, "msj" => "Error al registrar al empleado."]);
}

$stmtInsert->close();
$conexion->close();

?>