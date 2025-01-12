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

// Obtención de los datos enviados por la solicitud
$NumEmpleado = $_REQUEST["NumEmpleado"] ?? '';
$password = $_REQUEST["password"] ?? '';

$respAX = [];
$hoy = date("j M Y / h:i:s");

// Verifica las credenciales utilizando consultas preparadas
$sqlCheckEmpleado = "SELECT login.NumEmpleado, empleados.rol FROM login INNER JOIN empleados ON login.NumEmpleado = empleados.NumEmpleado WHERE login.NumEmpleado = ? AND login.password = ?";
$stmt = $conexion->prepare($sqlCheckEmpleado);
$stmt->bind_param("ss", $NumEmpleado, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // Credenciales válidas
    $row = $result->fetch_assoc();
    $rol = $row["rol"];

    // Guarda el ID del usuario y su rol en la sesión
    $_SESSION["NumEmpleado"] = $NumEmpleado;
    $_SESSION["rol"] = $rol;

    // Define el mensaje y la redirección según el rol
    $respAX["cod"] = 1;
    $respAX["msj"] = "Bienvenido $rol :)";
    $respAX["icono"] = "success";
    $respAX["extra"] = $hoy;
    $respAX["rol"] = $rol; // Agregar el rol a la respuesta

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
