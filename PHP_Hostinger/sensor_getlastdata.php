<?php
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
header("access-control-allow-origin: *");

$mysensorID = $_GET['sensorID'];
$conn = new mysqli('localhost', 'u482531304_exab', 'Fumo_123456789');
mysqli_select_db($conn, 'u482531304_exab');
$stmt = $conn->prepare("SELECT * FROM MQ2 WHERE ID = (SELECT MAX(ID) FROM MQ2 WHERE sensorID =".$mysensorID.")");
$stmt->execute();
$result = $stmt->get_result();
$outp = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($outp);


?>