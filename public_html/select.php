<?php  
 $connect = mysqli_connect("danu6.it.nuigalway.ie", "mydb2843cc", "xo5teh", "mydb2843");
 $output = '';  
 $sql = "SELECT * FROM properties"; //ORDER BY id DESC";  
 $result = mysqli_query($connect, $sql); 


 $output .= '  
      <div class="table-responsive">  
           <table class="table table-bordered">  
                <tr>  
                     <th width="5%">Id</th>  
                     <th width="10%">Name</th>  
                     <th width="35%">Description</th> 
                     <th width="10%">Latitude</th>  
                     <th width="10%">Longitude</th>  
                     <th width="5%">Altitude</th>  
                     <th width="5%">Power</th>  
                     <th width="5%">Gain</th>  
                     <th width="5%">Frequency</th> 
                     <th width="5%">Azimuth</th> 
                     <th width="5%">Delete</th>
                </tr>';  
 $rows = mysqli_num_rows($result);
 if($rows > 0)  
 {  
	  if($rows > 10)
	  {
		  $delete_records = $rows - 10;
		  $delete_sql = "DELETE FROM properties LIMIT $delete_records";
		  mysqli_query($connect, $delete_sql);
	  }
      while($row = mysqli_fetch_array($result))  
      {  
           $output .= '  
                <tr>  
                     <td>'.$row["id"].'</td>  
                     <td class="name" data-id1="'.$row["id"].'" contenteditable>'.$row["name"].'</td>  
                     <td class="description" data-id2="'.$row["id"].'" contenteditable>'.$row["description"].'</td>  
                     <td class="latitude" data-id3="'.$row["id"].'" contenteditable>'.$row["latitude"].'</td>
                     <td class="longitude" data-id4="'.$row["id"].'" contenteditable>'.$row["longitude"].'</td>
                     <td class="altitude" data-id5="'.$row["id"].'" contenteditable>'.$row["altitude"].'</td>
                     <td class="power" data-id6="'.$row["id"].'" contenteditable>'.$row["power"].'</td>
                     <td class="gain" data-id7="'.$row["id"].'" contenteditable>'.$row["gain"].'</td>
                     <td class="frequency" data-id8="'.$row["id"].'" contenteditable>'.$row["frequency"].'</td>
                     <td class="azimuth" data-id9="'.$row["id"].'" contenteditable>'.$row["azimuth"].'</td>
                     <td><button type="button" name="delete_btn" data-id10="'.$row["id"].'" class="btn btn-xs btn-danger btn_delete">x</button></td>  
                </tr>  
           ';  
      }  
      $output .= '  
           <tr>  
                <td></td>  
                <td id="name" contenteditable></td>  
                <td id="description" contenteditable></td>    
                <td id="latitude" contenteditable></td>  
                <td id="longitude" contenteditable></td>
                <td id="altitude" contenteditable></td>  
                <td id="power" contenteditable></td>  
                <td id="gain" contenteditable></td>  
                <td id="frequency" contenteditable></td>  
                <td id="azimuth" contenteditable></td>  
                <td><button type="button" name="btn_add" id="btn_add" class="btn btn-xs btn-success">+</button></td>  
           </tr>  
      ';  
 }  
 else  
 {  
      $output .= '
				<tr>  
					<td></td>  
					<td id="name" contenteditable></td>  
					<td id="description" contenteditable></td>   
                    <td id="latitude" contenteditable></td>  
                    <td id="longitude" contenteditable></td> 
                    <td id="altitude" contenteditable></td>  
                    <td id="power" contenteditable></td>  
                    <td id="gain" contenteditable></td>  
                    <td id="frequency" contenteditable></td>  
                    <td id="azimuth" contenteditable></td>  
					<td><button type="button" name="btn_add" id="btn_add" class="btn btn-xs btn-success">+</button></td>  
			   </tr>';  
 }  
 $output .= '</table>  
      </div>';  

// Write data to json file
 $select = "SELECT * FROM properties";
           $data = mysqli_query($connect, $sql);
           $json_array = array();
           while($row = mysqli_fetch_assoc($data))
           {
                $json_array[] = $row;
           }
$json_data = json_encode($json_array);
file_put_contents("pois.json",$json_data);

$connect->close();


echo $output;  


 ?>