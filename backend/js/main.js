function godziny() {
    return ['7:10', '8:00', '8:50', '9:40', '10:30', '11:30', '12:25', '13:15', '14:10'];
}

function fillarr(array, text) {
    for (var i = 0; i < 5; i++) {
        array[i] = [];
        for (var j = 0; j < 9; j++) {
            if(typeof(text)==='string') {
                array[i][j] = text;
            }
        }
    }
}
var rysujPlan = function () {
    for (var r = 0; r < 9; r++) {
        $('<p><span class="rw">' + r + '</span></p>').appendTo('#nr');
        $('<p><span class="rw">' + this.godziny()[r] + '</span></p>').appendTo('#godz');
    }
    for (var i = 0; i < 5; i++) {
        var dzien = i;
        for (var j = 0; j < 9; j++) {
            $('<p></p>').appendTo('#' + dzien);
        }
    }
};
fillTemplate = function (array) {
    var lekcja;
    var txt = 'Tutaj wpisz lekcje';
    var arr = array || false;
    for (var i = 0; i < 5; i++){
        for (var j = 0; j < 9; j++){
            if (arr){
                lekcja = array[i][j];
            } else {
                lekcja = txt;
            }
            var e = $("#" + i).children().eq(j+1).append('<span class="rw id-1" contenteditable="true">' + lekcja + '</span>');
        }
    }
};
function addNextEditable(e){
    var parent = e.parent();
    e.addClass('highlighted');
    e.attr('contenteditable', false);
    e.removeClass('id-1');
    e.addClass('id-'+getid());

    var a = $('<span class="slash rw" data-id="1"> / </span>');
    parent.append(a);
    a.hide();
    parent.append('<span class="rw id-1" contenteditable="true"></span>');
}
function getid() {
    var id = 0;

    return id;
}
function click(el){
    var txt = 'Tutaj wpisz lekcje';
    var txt2 = '---';
    el.on('focus', function(){
        var e = this;
        $(e).prev().show();
        console.log('clicked');
        if($(e).text() === txt || $(e).text() === txt2){
            $(e).text('');
        }
    });
    el.on('focusout', function() {
        var e = this;
        var txtEl =  $(e).text();
        if(txtEl === '' || txtEl == txt2 || txtEl == txt){
            if($(e).prev().length == 0) {
                $(e).text(txt);
            }
            $(e).removeClass('highlighted');
            $(e).prev().hide();
        }
        else {
            addNextEditable($(e));
            helpGUI.hide();
            restartEvents();

        }
    });
}
function dbclick (el){
    el.dblclick(function(){
        var e = $(this);
        var p = e.parent();
        if (e.prev().length) {
            e.prev().remove();
        } else if (e.next().length){
            e.next().remove();
        }
        e.remove();
        if (p.children().length == 1){
            p.children().eq(0).remove();
            var txt = 'Tutaj wpisz lekcje';
            p.append('<span class="rw id-1" contenteditable="true">' + txt + '</span>');
        }
        restartEvents();
    });
}

function followchanges(el){
    var arr = [];
    el.on("keyup", function(event){
        var lastkey = false;
        if (event.which == 8){
            lastkey = true;
        }
        var e = $(this);
        if (e.text().length == 3 || (e.text().length > 3 && lastkey)) {
            console.log("db connect");
            arr = PHP.getAdvice(e.text());
        } else if (e.text().length >= 3){
            for (var i = 0; i < arr.length; i++){
                if (arr[i].indexOf(e.text()) == -1){
                    arr.splice(i, 1);
                    i -= 1;
                }
            }
            helpGUI.show(arr, e);
        }
    });
}
var PHP = {
    getAdvice: function(string) {
        $.get('/frontend/main.php', {check: string})
            .done(function(data) {
                console.log(data);
                return eval(data);
            });
    }
};
var helpGUI = {
    lastclicked: [],
    show: function(arr, e){
        this.lastclicked[0] = e.parent().parent().attr('id');
        this.lastclicked[1] = e.parent().prevAll().index();
        this.lastclicked[2] = e.index();
        var t = this.lastclicked;
        console.log(t[0], t[1], t[2]);
        var pos = e.parent().offset();
        var posX = pos.left;
        var posY = pos.top;
        var w = e.parent().width();
        var h = e.parent().height();
        if ($("#infobox").length == 0){
            helpGUI.add(w);
        }
        var infobox = $('#infobox');
        infobox.offset({ top: posY + h + 10, left: posX});
        $('#infobox > #scroll > ul').empty();
        for (var i = 0; i < arr.length; i++){
            $("#infobox > #scroll > ul").append('<li class=help>'+ arr[i] + '</li>');
        }
    },
    add: function(w) {
        $("body").append('<div id=infobox><div id=scroll><ul></ul></div></div>');
        var infobox = $('#infobox');
        helpGUI.click();
        infobox.css('width', w);
    },
    hide: function() {
        $('#infobox').fadeOut(100);
    },
    click: function() {
        var el = $("#infobox > #scroll > ul");
        el.on('click', function(event){
            var e = $(this);
            var index = $(event.target).index();
            var txt = e.children().eq(index).text();
            var obj = helpGUI.lastclicked;
            var target = $("#"+obj[0]).children().eq(obj[1]+1).children().eq(obj[2]);
            target.text(txt);
            addNextEditable(target);
            restartEvents();
        })
    }
};

function restartEvents(){
    var elem = $('.rw');
    elem.unbind();
    click(elem);
    dbclick(elem);
    followchanges(elem);
}
$('#save').click(function(){
    for (var i = 0; i < 5; i++) {

    }
    var jsonString = JSON.stringify();
    console.log(jsonString);

    $.ajax({
        type: "POST",
        data: {data : jsonString},
        url: "../main.php",
        success: function(res){
            console.log(res);
        }
    });

});
$('#restore').click(function(){
    $('.rw').remove();
    rysujPlan();
    uzupelnijPlan();
    el = $('.rw');
    click(el);
});
rysujPlan();
uzupelnijPlan();
var el = $('.rw');
click(el);
dbclick(el);
followchanges(el);
