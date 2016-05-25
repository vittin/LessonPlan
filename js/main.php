<?php
$host= 'mysql.hostinger.pl';
$user = 'u311937761_mati';
$db = 'u311937761_pl';
$password = '97mateusz';
$dbc = mysqli_connect($host,$user,$password,$db);
$cookie_name = "klasa";
$iscookie = isset($_COOKIE[$cookie_name]);
$cookie_value = $iscookie ? $_COOKIE[$cookie_name] : null;
$querystring = (isset($_GET['kl'])) ? $_GET['kl'] : null;
$isquery = isset($querystring) && $querystring != "";
//FUNCTIONS

$isExist = function($equalsTo, $dbc, $from, $whatEquals)
{
	if (!isset($whatEquals)) {$whatEquals = "nazwa";}
	$q = "SELECT id FROM `{$from}` WHERE {$whatEquals} = '{$equalsTo}'";
	$id = mysqli_fetch_array(mysqli_query($dbc, $q))[0];
	if (!$id)
	{
		return false;
	}
	return $id;
};
$giveArrWithNames = function($dbc, $string){
	$q =  "SELECT nazwa FROM nazwylekcji WHERE nazwa LIKE '{$string}%'";
	$res = mysqli_query($dbc, $q);
	$arr = [];
	$row = mysqli_fetch_array($res, MYSQLI_NUM);
	$k = 0;
	while ($row) {
		$arr[$k] = $row[0];
		$k += 1;
		$row = mysqli_fetch_array($res, MYSQLI_NUM);
	}
	return $arr;
};
$giveMeName = function($id, $dbc)
{
	$q = "SELECT nazwa FROM nazwylekcji WHERE id = {$id}";
	$name = mysqli_fetch_array(mysqli_query($dbc, $q))[0];
	return $name;
};
$addnewlesson = function($name, $dbc){
	$q = "INSERT INTO nazwylekcji VALUES (NULL, '{$name}');";
	$ask = mysqli_query($dbc, $q);
	$id = mysqli_insert_id($dbc);
	return $id;
	
};
$deletelesson = function($id, $dbc){
	$q = "DELETE FROM nazwylekcji WHERE id={$id}";
	return mysqli_fetch_array(mysqli_query($dbc, $q))[0];
};

//END OF FUNCTIONS
if(!$isquery && $iscookie)
{
	$querystring = $cookie_value;
	$_SERVER['QUERY_STRING']= '?'.http_build_query(array($querystring));
} else if(!$isquery && !$iscookie)
{
	$finddefault = "SELECT nazwa FROM klasy WHERE id = 1";
	$class = mysqli_fetch_array(mysqli_query($dbc, $finddefault));
	$defaultclass = $class[0];
	$querystring = $defaultclass;
}
if (!$iscookie || $cookie_value != $querystring)
{
	$cookie_value = $querystring;
	setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/"); // 86400 = 1 day
}
$tab = $querystring;
$save = function($arr, $dbc, $idklasy, $isExist, $addnewlesson){
	$idklasy = isset($idklasy) ? $idklasy : 1;
	$from = "nazwylekcji";
	$lastid = mysqli_fetch_array(mysqli_query($dbc, "SELECT id FROM nazwylekcji ORDER BY id DESC LIMIT 1"));
	for ($i = 0; $i < 5; $i++){
		for ($j = 0; $j < 9; $j++){
			$rowLength = sizeof($arr[$i][$j]);
			$q = "SELECT idLekcji FROM lekcje WHERE idKlasy = {$idklasy} && dzien = {$i} && godzina = {$j}";
			$result = mysqli_query($dbc, $q);
			$recordsExist = [];
			$index = 0;
			if ($result){
				$row = mysqli_fetch_array($result, MYSQLI_NUM);
				while($row) {
					$recordsExist[$index] = $row[0];
					$index += 1;
					$row = mysqli_fetch_array($result, MYSQLI_NUM);
				}
			} else {
				$recordsExist = [];
			}
			$size = sizeof($recordsExist);
		
			for ($k = 0; $k < $rowLength; $k++){
				$row = (isset($arr[$i][$j][$k]) && $arr[$i][$j][$k]) ? $arr[$i][$j][$k] : 0;
				$id = is_numeric($row) ? $row : 0;
				if ($id > 0 && $id < $lastid) {
					$isNew = true;
					for ($m = 0; $m < $size; $m++) {
						if ($id == $recordsExist[$m]) {
							$isNew = false;
							break;
						}
					}
					$q1 = "DELETE FROM lekcje WHERE idKlasy = {$idklasy} && dzien = {$i} && godzina = {$j}";
					$q = "INSERT INTO lekcje VALUES(null, {$idklasy}, {$id}, {$i}, {$j})";
					if ($k == 0){
						$delete = mysqli_query($dbc, $q1);
					}
					$add = mysqli_query($dbc, $q);
				}
			}
		}
	}
	
};
$load = function($dbc, $idklasy)
{
	$loadedarray = [];
	for ($i = 0; $i < 5; $i++){
		for ($j = 0; $j < 9; $j++){
			$sqlquery = "SELECT lekcje.idLekcji, nazwylekcji.nazwa FROM lekcje, nazwylekcji WHERE lekcje.idLekcji = nazwylekcji.id && idKlasy = {$idklasy} && dzien = {$i} && godzina = {$j}";
			$temp = [];
			$sqlObj = mysqli_query($dbc, $sqlquery);
			$row = mysqli_fetch_array($sqlObj);
			if ($row == false) {
				$loadedarray[$i][$j][0] = [1];
				$loadedarray[$i][$j][1] = [""];
				continue;
			}
			$k = 0;
			while ($row){
				$temp[$k] = [$row[0], $row[1]];
				$row = mysqli_fetch_array($sqlObj);
				$k += 1;
			}
			$loadedarray[$i][$j] = $temp;
		}
	};
	return $loadedarray;
};
$validLength = function($string, $allowedLength){
	if (sizeof($string) > $allowedLength){
		echo false;
		return false;
	}
	return true;
};
if (isset($_POST['data']))	
{
	$klasa = array_key_exists('className', $_POST) ? mysqli_real_escape_string($dbc, $_POST['className']) :  null;
	if (!$validLength($klasa, 15)){
		return "Forbidden: Too long string";
	};
	$classid = "SELECT id FROM klasy WHERE nazwa = '{$klasa}' LIMIT 1";
	$quer = mysqli_query($dbc, $classid);
	$idklasy = ($quer) ? mysqli_fetch_array($quer)[0] : NULL;
	
	if (!$idklasy)
	{
	$addclassq = "INSERT INTO klasy VALUES (NULL, '{$klasa}')";
	mysqli_query($dbc, $addclassq);
	$quer = mysqli_query($dbc, $classid);
	$idklasy = mysqli_fetch_array($quer)[0];
	};
	
	$str = array_key_exists('data', $_POST) ? $_POST['data'] :  null;
	$arr = json_decode($str);
	$save($arr,$dbc,$idklasy,$isExist,$addnewlesson);
	echo "200 SUCCESS";
};

if (isset($_GET['load']))	
{
	$str = array_key_exists('load', $_GET) ? mysqli_real_escape_string($dbc, $_GET['load']) :  null;
	if (!$validLength($str, 15)){
		return "Forbidden: Too long string";
	};
	$from = "klasy";
	$equalsTo = "id";
	if (isset($str)) {
		$id = $isExist($str, $dbc, $from, $equalsTo);
		if($id){
			$result = json_encode($load($dbc, $id));
			echo $result;
		}
	}
	echo false;
};

if (isset($_GET['check']))
{
	$str = array_key_exists('check', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['check']) : null;
	echo json_encode($giveArrWithNames($dbc, $str));	
}
if (isset($_GET['checkID']))
{
	$str = array_key_exists('checkID', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['checkID']) : null;
	if (!$validLength($str, 15)){
		return "Forbidden: Too long string";
	};
	$from = "nazwylekcji";
	$id = $isExist($str, $dbc, $from, null);
	if (!$id) {
		$id = 0;
	}
	echo $id;
}
if (isset($_GET['checkName']))
{
	$id = array_key_exists('checkName', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['checkName']) : null;
	if (!$validLength($id, 9)){
		return "Forbidden: Too long int";
	};
	if (is_numeric($id)) {
		echo $giveMeName($id, $dbc);
	}
}
if (isset($_GET['addToDB']))
{
	$str = array_key_exists('addToDB', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['addToDB']) : null;
	if (!$validLength($str, 15)){
		return "Forbidden: Too long string";
	};
	if ($str) {
		$id = $addnewlesson($str, $dbc);
		echo $id;
		return;
	}
	echo -1;
}
if (isset($_GET['finalCheck']))
{
	$str = array_key_exists('finalCheck', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['finalCheck']) : null;
	if (!$validLength($str, 15)){
		return "Forbidden: Too long string";
	};
	if ($str) {
		$from = 'nazwylekcji';
		$id = $isExist($str, $dbc, $from, null);
		if (!$id){
			$id = $addnewlesson($str, $dbc);
		}
		echo $id;
		return;
	}
	echo 0;
};
if (isset($_GET['kl']))
{
	$str = array_key_exists('kl', $_GET) ?  mysqli_real_escape_string($dbc, $_GET['kl']) : null;
	if (!$validLength($str, 15)){
		return "Forbidden: Too long string";
	};
	if ($str) {
		$from = 'klasy';
		$id = $isExist($str, $dbc, $from, null);
		if (!$id){
			$id = 0;
		}
	} else {
		$id = 0;
	}
	echo "<script> CurrentClass.setName('{$str}');</script>";
	if ($id == 0){
		echo "<script>CurrentClass.setHeader('Nie istnieje plan lekcji dla: '), fillTemplate();</script>";
	} else {
		echo "<script> PHP.load({$id}, fillTemplate); CurrentClass.setId({$id});</script>";
	}
}
?>