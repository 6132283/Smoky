<?php
header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
header("access-control-allow-origin: *");

$sensorID = $_POST['sensorID'];
$name = $_POST['name'];
$co2 = $_POST['co2'];
$smoke = $_POST['smoke'];
$gas = $_POST['gas'];
$email = $_POST['email'];
$conn = new mysqli('localhost', 'u482531304_exab', 'Fumo_123456789');
mysqli_select_db($conn, 'u482531304_exab');
if( $name != '' and $co2 > 0 and $smoke > 0 and $gas > 0 and $email != ''){
   $stmt = $conn->prepare("INSERT INTO `SENSORI` (`sensorID`, `name`, `limitco2`, `limitsmoke`, `limitgas`, `email`) VALUES ('".$sensorID."', '".$name."', '".$co2."', '".$smoke."', '".$gas."', '".$email."');");
   $stmt->execute();
}
 

?>
