<!DOCTYPE html>
 <html>
      <head>
           <title>Webslesson Tutorial | Convert Data from Mysql to JSON Format using PHP</title>
      </head>
      <body>  
           <?php
           $connect = mysqli_connect("danu6.it.nuigalway.ie", "mydb2843cc", "xo5teh", "mydb2843");
           $sql1 = "SELECT * FROM properties";
           $name = $_POST["name"];
           $desc = $_POST["description"];
	   $long = $_POST["long"];
   	   $lat = $_POST["lat"];
	   $alt = $_POST["alt"];
	   $power = $_POST["power"];
	   $gain = $_POST["gain"];
	   $freq = $_POST["frequency"];
	   $azimuth = $_POST["azimuth"];

	   $sql = "INSERT INTO properties (name, description, longitude, latitude, altitude, power, gain, 
frequency, azimuth)
VALUES ('".addslashes($name)."', '".addslashes($desc)."', '$long', '$lat', '$alt', '$power', '$gain', '$freq', 
'$azimuth')";

//$connect->query($sql);
/*
if ($connect->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $connect->error;
}*/
           mysqli_query($connect, $sql);
           $result = mysqli_query($connect, $sql1);
	   $json_array = array();
           while($row = mysqli_fetch_assoc($result))
           {
                $json_array[] = $row;
           }
          /* echo '<pre>';
           print_r(json_encode($json_array));
           echo '</pre>';*/
           /* $pois = fopen("pois.json", "w") or die("Unable to open file!");
	   $txt = json_encode($json_array);
	   fwrite($pois, $txt);
	   fclose($pois);*/
	   $txt = json_encode($json_array);
  	   file_put_contents("pois.json", $txt);
           echo json_encode($json_array);
           ?>
      </body>
 </html>

