<?php
class MQ2{
 public $link='';
 function __construct($sensorID, $gas, $smoke, $co2){
  $this->connect();
  $this->storeInDB($sensorID, $gas, $smoke, $co2);
 }

 function connect(){
  $this->link = mysqli_connect('localhost', 'u482531304_exab', 'Fumo_123456789') or die('Cannot connect to the DB');
  mysqli_select_db($this->link, 'u482531304_exab') or die('Cannot select the DB');
 }

 function storeInDB($sensorID, $gas, $smoke, $co2){
  //$query2 = "SELECT * FROM SENSORI WHERE sensorID =".$sensorID."";
  //$result2 =  mysqli_query($this->link,$query2) or die('Errant query:  '.$query2);
  //if(mysqli_num_rows($result2) != 0) {
      $from = "Smoky";
      $headers .= 'From:'. $from;
      date_default_timezone_set('Europe/Rome');
      $date = date('m/d/Y h:i:s a', time());
      
      $query3 ="SELECT * FROM MQ2 WHERE ID = (SELECT MAX(ID) FROM MQ2 WHERE sensorID =".$sensorID.")";
      $result3 = mysqli_query($this->link,$query3) or die('Errant query:  '.$query3);
      $row3 = mysqli_fetch_assoc($result3);
      
      $query = "insert into MQ2 set co2='".$co2."', smoke='".$smoke."', gas='".$gas."', sensorID='".$sensorID."', date=(SELECT DATE_ADD(NOW(), INTERVAL 1 HOUR))";
      $result = mysqli_query($this->link,$query) or die('Errant query:  '.$query);
      
      $query2 = "SELECT * FROM SENSORI WHERE sensorID =".$sensorID."";
      $result2 =  mysqli_query($this->link,$query2) or die('Errant query:  '.$query2);
      $row = mysqli_fetch_assoc($result2);
      
      if(($row['limitco2'] <= $co2 or $row['limitsmoke'] <= $smoke or $row['limitgas'] <= $gas) 
      and (($row3['co2'] < $row['limitco2']) and ($row3['smoke'] < $row['limitsmoke']) and ($row3['gas'] < $row['limitgas']))) {
            mail(strval( $row['email'] ),'ALLARME SENSORE', 'il tuo sensore '.strval($row['name']).' ha rlevato una concentrazione di CO pari a '.$co2.' ppm, una concentrazione di smoke pari a '.$smoke.' ppm ed una concentrazione di gas pari a '.$gas.' ppm alle ore '.$date.'',$headers);
        }
    //}
 }


}
if($_GET['sensorID'] != '' and $_GET['gas'] != '' and $_GET['smoke'] != '' and $_GET['co2'] != ''){
 $fmgd=new MQ2($_GET['sensorID'], $_GET['gas'],$_GET['smoke'],$_GET['co2']);
}

?>