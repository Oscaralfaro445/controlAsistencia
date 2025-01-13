<?php

include "connection.php";

// Obtención de los datos enviados por la solicitud
$NumEmpleado = $_REQUEST["NumEmpleado"] ?? '';
$password = $_REQUEST["password"] ?? '';

$respAX = [];
$hoy = date("j M Y / h:i:s");

// Verifica las credenciales utilizando consultas preparadas
$sqlCheckEmpleado = "SELECT login.NumEmpleado, empleados.rol, empleados.Academia FROM login INNER JOIN empleados ON login.NumEmpleado = empleados.NumEmpleado WHERE login.NumEmpleado = ? AND login.password = ?";
$stmt = $conexion->prepare($sqlCheckEmpleado);
$stmt->bind_param("ss", $NumEmpleado, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // Credenciales válidas
    $row = $result->fetch_assoc();
    $rol = $row["rol"];
    $academia = $row["Academia"]; // Obtener la Academia
    $numEmpleado = $row["NumEmpleado"]; // Obtener el NumEmpleado

    // Guarda el ID del usuario y su rol en la sesión
    $_SESSION["NumEmpleado"] = $numEmpleado;
    $_SESSION["rol"] = $rol;

    // Define el mensaje y la redirección según el rol
    $respAX["cod"] = 1;
    $respAX["msj"] = "Bienvenido $rol :)";
    $respAX["icono"] = "success";
    $respAX["extra"] = $hoy;
    $respAX["rol"] = $rol; // Agregar el rol a la respuesta
    $respAX["NumEmpleado"] = $numEmpleado; // Incluir el NumEmpleado en la respuesta
    $respAX["Academia"] = $academia; // Incluir la Academia en la respuesta

} else {
    // Credenciales incorrectas
    $respAX["cod"] = 0;
    $respAX["msj"] = "Error. Credenciales incorrectas. Favor de intentarlo nuevamente.";
    $respAX["icono"] = "error";
    $respAX["extra"] = $hoy;
}

// Devuelve la respuesta en formato JSON
echo json_encode($respAX);

$conexion->close();

?>
