<?php  
    $connect = mysqli_connect("danu6.it.nuigalway.ie", "mydb2843cc", "xo5teh", "mydb2843");
	$id = $_POST["id"];  
	$text = $_POST["text"];  
	$column_name = $_POST["column_name"];  
	$sql = "UPDATE properties SET ".$column_name."='".$text."' WHERE id='".$id."'";  
	if(mysqli_query($connect, $sql))  
	{  
		echo 'Data Updated';  
	}  
 ?>