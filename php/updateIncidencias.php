<?php

include "connection.php";

// Verificar si el usuario tiene la sesión activa
if (!isset($_SESSION["NumEmpleado"])) {
    echo json_encode([
        "cod" => 0,
        "msj" => "No tienes acceso a esta información.",
        "icono" => "error"
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtén los datos de la solicitud POST
    $data = json_decode($_POST['incidencias'], true); // Decodificar el JSON

    // Verificar si el JSON es válido
    if (is_array($data)) {
        foreach ($data as $incidencia) {
            // Extraer la información de cada incidencia
            $id = $incidencia['ID'];
            $estado = $incidencia['Estado'];

            // Verificar si el estado ha cambiado
            $sql = "SELECT Estado FROM incidencias WHERE ID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->bind_result($estado_actual);
            $stmt->fetch();

            // Si el estado ha cambiado, actualizar
            if ($estado_actual !== $estado) {
                $sql = "UPDATE incidencias SET Estado = ? WHERE ID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $estado, $id);

                if (!$stmt->execute()) {
                    echo json_encode(['cod' => 0, 'msj' => 'Error en la actualización']);
                    exit;
                }
            }
        }

        echo json_encode(['cod' => 1, 'msj' => 'Incidencias actualizadas con éxito']);
    } else {
        echo json_encode(['cod' => 0, 'msj' => 'Datos inválidos']);
    }
} else {
    echo json_encode(['cod' => 0, 'msj' => 'Método de solicitud no permitido']);
}

// Cerrar la conexión
$stmt->close();
$conn->close();

?>
