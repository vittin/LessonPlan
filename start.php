<?php
$host= 'localhost';
$user = 'u311937761_mati';
$db = 'planlekcji';
$password = '97mateusz';
$dbc = mysqli_connect($host,$user,$password,$db);
  if(isset($_GET['getList']) && !empty($_GET['getList'])) {
	$q = "SELECT nazwa FROM klasy";
	$res = mysqli_query($dbc, $q);
	$row = mysqli_fetch_array($res, MYSQLI_NUM);
	$k = 0;
	$array = [];
	while ($row) {
		$array[$k] = $row[0];
		$k += 1;
		$row = mysqli_fetch_array($res, MYSQLI_NUM);
	}
	echo json_encode($array);
    }
	
?>