<?php
$connection = mysqli_connect("danu6.it.nuigalway.ie", "mydb2843cc", "xo5teh", "mydb2843");
if (!$connection){
    die("Cannot connect to database - " . mysqli_error($connection));
}
else {
    echo "Connected to database";
}