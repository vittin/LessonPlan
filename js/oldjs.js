/**
 * Created by mati on 2016-04-02.
 */
var arr = [[],[],[],[],[]];

var hidden = {};
var a = 'glyphicon-ok';
var b = 'glyphicon-remove';
function readClass(){
    var result = "";
    var indexOfQueryString = window.location.href.indexOf('?');
    var cookietxt = getCookie('klasa');
    if (indexOfQueryString > 0) {
        return window.location.href.slice(indexOfQueryString + 1).split('&')[0];
    } else if(cookietxt.length > 0) {
        return cookietxt;
    } else {
        return "3a";
    }
}
function selectClass(clas){
    var resp = $.ajax({
        type: "POST",
        dataType: "text",
        data: {load : clas},
        url: "./main.php"
    });
    resp.done(function(string){
        if(string.length > 0 && string) {
            string = eval(string);
            console.log(string);
            arr = string;
        } else {
            throwError("no-found", clas);
        }
        Plan.f5();
    })
}
function throwError(arg, clas){
    if (arg == "no-found"){
        $("#header").text("Nie istnieje jeszcze plan dla tej klasy: " + clas);
    }
}
/*function changeClass(){
 var menu = $('#changeclass > li > a');
 menu.on('click', function() {
 var name = this.name;
 selectClass(name);
 $(this).addClass('selected');
 Plan.f5();
 });
 }*/
var Custom = {
    ready: function(){
        var active = false;
        Custom.escapehandler();
        $("#selector").on('click', function(){
            active = !active;
            active ? Custom.select() : Custom.save();
        });
    },
    escapehandler: function(){
        $('body').keydown(function(e) {
            var key = e.which;
            if (key === 27) {Custom.save()}
        });
    },
    select: function(){
        $('.rw > span').on('click', function(){
            var txt = $(this).text().replace(/\s/g, '');
            Custom.hide(txt);
        });

    },
    hide: function(txt){
        if(!txt){return}
        var el =$("."+txt);
        var menu = $('#menu');
        $("#div").before('<li><a class="hiddenelem" id=' + txt + '>'+txt+'</a></li>');
        $(".hiddenelem").on('click', function(){
            Custom.restore(this.id);
        });
        $(el).hide();
    },
    restore: function(el){
        $("."+el).show();
        $("#"+el).parent().remove();
    },
    save: function(){
        $('.rw > span').off();
        var el = $(".hiddenelem");
        var l = el.length;
        var cookie = [];
        for (var i = 0; i < l; i++){
            cookie[i] = $(el).eq(i).text();
        }
        var klasa = $("#klasa").text();
        setCookie(klasa, cookie, 180);
    },
    highlight: function() {
        var d = new Date();
        var day = d.getDay() - 1;
        var hour = d.getHours();
        if (hour > 15) {
            day = day + 1
        }
        if (day < 5 && day >= 0) {
            $('#' + day).addClass('highlighted');
        }
    }
};
Custom.ready();
var Plan = {
    date: function(){
        return new Date();
    },
    isWeekEven: function(){
        var d = this.date();
        var day = d.getDate();
        var nameofWeekday = d.getDay();
        var firstday = function(){
            return (day - nameofWeekday) % 7 + 1;
        };
        var nrofWeek = Math.floor((day + firstday()) / 7);
        return (nrofWeek % 2 === 0);
    }
    ,
    f5: function () {
        $('.rw').remove();
        this.plandnia();
        this.rysujPlan();
    },
    //Godziny dzwonkow
    godziny: function () {
        return ['7:10', '8:00', '8:50', '9:40', '10:30', '11:30', '12:25', '13:15', '14:10'];
    },
    //pon-ptk plan
    plandnia: function () {
        return arr;
    },
    //Wyswietlenie planu na stronie
    rysujPlan: function () {
        //Sztywne wartosci, nr+godziny
        for (var r = 0; r < 9; r++) {
            $('<p class="rw">' + r + '</p>').appendTo('#nr');
            $('<p class="rw">' + this.godziny()[r] + '</p>').appendTo('#godz');
        }
        //Dynamiczne wyswietlenie calego planu
        var plan = this.plandnia();
        for (var i = 0; i < plan.length; i++) {
            for (var j = 0; j < 9; j++) {
                var id = plan[i][j][1];
                var lekcja = plan[i][j][0];
                if (typeof(lekcja) == "string"){
                    var el = $('<p class="rw"></p>').appendTo('#' + i);
                    el.append("<span class=" + id + ">" + lekcja + "</span>");
                } else {
                    $('<p class="temp rw"></p>').appendTo('#' + i);
                    for (var k = 0; k < plan[i][j].length; k++) {
                        lekcja = plan[i][j][k][0];
                        id = plan[i][j][k][1];
                        var temp = $('#' + i).find('.temp');
                        temp.append("<span class=" + id + ">" + lekcja + "</span>");
                        if (k == 0){
                            temp.append("<span class='slash'> / </span>");
                        }
                    }
                }
                $('.temp').removeClass('temp');
            }
        }
    }
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}
/*$('#save').one('click', function() {
 var i = 0;
 for(var obj in hidden){
 if(hidden.hasOwnProperty(obj)){
 setCookie(i,obj,30);
 i++;
 }
 }
 $('#save').addClass('glyphicon-saved');
 });
 $('#restore').on('click', function() {
 for(var i=0;i<6;i++){
 var cookie = getCookie(i);
 if (cookie != ''){
 Custom.show($('#'+cookie), cookie);
 setCookie(i,0,0);
 }
 }
 }); */
function start() {
    var clas = readClass();
    $("#klasa").text(clas);
    selectClass(clas);
    var cookie = getCookie(clas).split(',');
    var l = cookie.length;
    if (cookie !== ''){
        for(var i=0; i < l; i++) {
            Custom.hide(cookie[i]);
        }
    }
    else{Plan.f5();}
}

//wywolanie funkcji
$(document).ready(start());
$(document).ready(Custom.highlight());