<?php  

$name = addslashes($_POST["name"]);
$desc = addslashes( $_POST["description"]);
$long =  $_POST["longitude"];
$lat = $_POST["latitude"];
$alt = $_POST["altitude"];
$power = $_POST["power"];
$gain = $_POST["gain"];
$freq = $_POST["frequency"];
$azimuth = $_POST["azimuth"];

$connect = mysqli_connect("danu6.it.nuigalway.ie", "mydb2843cc", "xo5teh", "mydb2843");
$insert = "INSERT INTO properties (name, description, longitude, latitude, altitude, power, gain, frequency, azimuth) VALUES ('$name', '$desc', '$long', '$lat', '$alt', '$power', '$gain', '$freq', '$azimuth')";


if(mysqli_query($connect, $insert))  
{  
     echo 'Data Inserted';  
}  
 ?>