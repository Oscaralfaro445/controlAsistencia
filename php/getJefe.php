<?php

include "connection.php";

header("Content-Type: application/json");

// Verifica si el usuario tiene acceso
if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}

// Validar la academia recibida por POST
$academia = $_POST["academia"] ?? "";

if (!$academia) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No se proporcionó la academia."
    ]);
    exit;
}

// Definir el rol buscado
$rol = "Jefe";

// Consulta preparada para obtener al jefe de la academia
$sqlJefe = "
    SELECT 
        empleados.Nombre AS NombreJefe, 
        empleados.PrimerApe, 
        empleados.SegundoApe, 
        academias.Nombre AS NombreAcademia
    FROM 
        empleados
    INNER JOIN 
        academias ON academias.ID = empleados.Academia
    WHERE 
        empleados.rol = ? AND academias.ID = ?
    LIMIT 1
";

$stmt = $conexion->prepare($sqlJefe);

// Asociar los valores a los placeholders
$stmt->bind_param("ss", $rol, $academia);

// Ejecutar la consulta
$stmt->execute();
$result = $stmt->get_result();

// Verificar si se encontró un registro
if ($result->num_rows === 1) {
    $jefe = $result->fetch_assoc();
    echo json_encode([
        "cod" => 1,
        "msj" => "Información del jefe obtenida correctamente.",
        "jefe" => [
            "nombre" => $jefe["NombreJefe"] . " " . $jefe["PrimerApe"] . " " . $jefe["SegundoApe"],
            "nombreAcademia" => $jefe["NombreAcademia"]
        ]
    ]);
} else {
    echo json_encode([
        "cod" => 0,
        "msj" => "No se encontró un jefe para la academia proporcionada."
    ]);
}

// Cerrar conexiones
$stmt->close();
$conexion->close();

?>
