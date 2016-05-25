<?php
$server= 'mysql.hostinger.pl';
$user = 'u311937761_mati';
$db = 'u311937761_baza1;';
$password = '97mateusz';
$table = array_key_exists('table', $_POST) ? $_POST['table'] : null;
$tab = isset($_GET["tab"])?$_GET["tab"]:'test';
$tablename = ($tab == null) ? 'test' : "{$tab}";
//$tablename = ($table == null) ? 'test' : json_decode(stripslashes($table));
$string = array_key_exists('data', $_POST) ? $_POST['data'] :  null;
$arr = json_decode($string, true);
$arraytosend = [];
$jsonarr;
//FUNCTIONS
//NIE PAMIETAM CO ROBI KTORA FUNKCJAAAAA :/
//BACK
function returnnames(){
    $result = '';
    $names = [];
    for ($i=0; $i<9; $i++){
        $names[$i] = "LEKCJA_{$i}";
        $result = $result . ", " . $names[$i] . " char(35)";
    }
    return $result;
};
function day($d){
    if($d === 0){return "Poniedzialek";}
    else if($d === 1){return "Wtorek";}
    else if($d === 2){return "Sroda";}
    else if($d === 3){return "Czwartek";}
    else if($d === 4){return "Piatek";}
};
function addrecord($arr){
    global $con;
    global $tablename;
    $arr_length = sizeof($arr);
    $sql = '';
    for ($j=0; $j<$arr_length; $j++){
        $dzien = day($j);
        $sqlquery = "INSERT INTO `{$tablename}`(`id`, `DZIEN`) VALUES({$j},'{$dzien}');";
        echo $sqlquery;
        mysqli_query($con, $sqlquery);
        $subarr_length = sizeof($arr[$j]);
        for ($i=0; $i<$subarr_length; $i++){
            if (gettype($arr[$j][$i]) === "array"){
                $sql = "UPDATE `{$tablename}` SET `LEKCJA_{$i}` = '".$arr[$j][$i][0]."; ".$arr[$j][$i][1]."' WHERE id={$j};";
            }
            else{
                $sql = "UPDATE `{$tablename}` SET `LEKCJA_{$i}` = '".$arr[$j][$i]."' WHERE id={$j};";
            }
            mysqli_query($con, $sql);
        }
    }
}
//FRONT
function loop($arr) {
    for ($i = 0; $i < 5; $i++) {
        $arr[$i] = [];
    }
}
loop($arraytosend);
function selectall(){
        global $arraytosend;
        global $jsonarr;
        global $con;
        global $tablename;
        $sql = "SELECT * FROM `{$tablename}`";
        $result = mysqli_query($con, $sql);
        $num_rows = mysqli_num_fields($result);
        for ($i = 0; $i < 5; $i++){
            $dzien = $i;
            $query = "SELECT * FROM `{$tablename}` where id= '{$dzien}'";
            $selectid = mysqli_fetch_array(mysqli_query($con, $query));
            for ($j = 2; $j < $num_rows; $j++){
                $lesson = $selectid[$j];
                $arraytosend[$i][$j-2] = $lesson;
            };
        }
        $jsonarr = json_encode($arraytosend);
}
    //END
$con = mysqli_connect('localhost', 'mati', $password);
if(!$con){
 die('Błąd połączenia: ' . mysqli_error($con));
}
$select = mysqli_select_db($con, 'baza1');

$droptablequery = "DROP TABLE {$tablename}";
//$droptable = mysqli_query($con, $droptablequery);
$res = returnnames();
$querystring = "CREATE TABLE IF NOT EXISTS `{$tablename}`(id int NOT NULL, DZIEN char(25), PRIMARY KEY(id) {$res})";
$createtable = mysqli_query($con, $querystring);
$addrecord = addrecord($arr);
$selectall = selectall();
$script = "<script>var arr = {$jsonarr}; var querystring = '{$tab}';</script>";
echo $script;
mysqli_close($con);
?>