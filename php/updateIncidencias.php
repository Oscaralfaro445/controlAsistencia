<?php   

include "connection.php";

if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}// Verificar si el usuario tiene la sesión activa


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer el cuerpo de la solicitud
    $input = file_get_contents('php://input');
    $data = json_decode($input, true); // Decodificar el JSON

    // Verificar si el JSON es válido
    if (is_array($data)) {
        $errores = [];
        foreach ($data as $id => $estado) {
            // Verificar si el estado ha cambiado
            $sql = "SELECT Estado FROM incidencias WHERE ID = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->bind_result($estado_actual);
            $stmt->fetch();
            $stmt->close();

            // Si el estado ha cambiado, actualizar
            if ($estado_actual !== $estado) {
                $sql_update = "UPDATE incidencias SET Estado = ? WHERE ID = ?";
                $stmt_update = $conexion->prepare($sql_update);
                $stmt_update->bind_param("si", $estado, $id);

                if (!$stmt_update->execute()) {
                    $errores[] = "Error al actualizar la incidencia con ID $id";
                }

                $stmt_update->close();
            }
        }

        if (empty($errores)) {
            echo json_encode(['cod' => 1, 'msj' => 'Incidencias actualizadas con éxito']);
        } else {
            echo json_encode(['cod' => 0, 'msj' => implode(", ", $errores)]);
        }
    } else {
        echo json_encode(['cod' => 0, 'msj' => 'Datos inválidos']);
    }
} else {
    echo json_encode(['cod' => 0, 'msj' => 'Método de solicitud no permitido']);
}

// Cerrar la conexión
$conexion->close();

?>
