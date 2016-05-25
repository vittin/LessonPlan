<?php include("/frontend/main.php") ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>php</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="../css/bootstrap.min.css" charset="UTF-8">
    <link rel="stylesheet" href="./css/main.css" charset="UTF-8">
</head>
<body>
<div class="container row">
    <p class="modal-header h1 col-md-6">Plan klasy: <span id="klasa" contenteditable="false"><?php echo $tab ?></span><p>
</div>
<div class ='choose hide'>
</div>
<div class="container plan row no-gutter">
    <div id="nr" class="col-md-1 hidden-sm hidden-xs">
        <div class="row no-gutter">
            <!-- <div>
                <div>
                    <div data-toggle="dropdown" class="dropdown-toggle glyphicon glyphicon-sort"></div>
                    <ul class="dropdown-menu noclose" id="changeclass">
                        <li class="dropdown-header">Klasa: </li>
                        <li><a class="glyphicon glyphicon-chevron-right" id="kl2a" name="2A" href="?tab=2A"> 2a</a></li>
                        <li><a class="glyphicon glyphicon-chevron-right" id="test" name="6A" href="?"> test</a></li>
                        <li><a class="glyphicon glyphicon-chevron-right" id="kl3a" name="3A" href="?tab=3A"> 3a</a></li>
                    </ul>
                </div>
            </div> -->
            <div><p>nr.</p></div>
        </div></div>
    <div id="godz" class="col-md-1 hidden-sm hidden-xs"><p>Godz</p></div>
    <div id=0 class="col-md-2"><p>Poniedziałek</p></div>
    <div id=1 class="col-md-2"><p>Wtorek</p></div>
    <div id=2 class="col-md-2"><p>Środa</p></div>
    <div id=3 class="col-md-2"><p>Czwartek</p></div>
    <div id=4 class="col-md-2">
        <div class="row no-gutter">
            <p class="col-sm-10">Piątek</p> <div class="col-sm-2" id="settings">
            <div class="btn-group">
                <button data-toggle="dropdown" class="dropdown-toggle glyphicon glyphicon-cog"></button>
                <ul class="dropdown-menu pull-right noclose" id="menu">
                    <li><a class="glyphicon glyphicon-save" id="save">  Zapisz</a></li>
                    <li><a class="glyphicon glyphicon-chevron-left" id="restore">  Przywróć</a></li>
                </ul>
            </div>
        </div>
        </div>
    </div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" charset="UTF-8"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js" charset="UTF-8"></script>
<script src="./js/main.js" charset="UTF-8"></script>
</body>
</html>