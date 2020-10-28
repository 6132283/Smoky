<?php
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
header("access-control-allow-origin: *");

$mysensorID = $_GET['sensorID'];
$conn = new mysqli('localhost', 'u482531304_exab', 'Fumo_123456789');
mysqli_select_db($conn, 'u482531304_exab');
//$stmt2 = $conn->prepare("DELETE FROM MQ2 WHERE sensorID =".$mysensorID."");
//$stmt2->execute();
$stmt = $conn->prepare("DELETE FROM SENSORI WHERE sensorID =".$mysensorID."");
$stmt->execute();
?>