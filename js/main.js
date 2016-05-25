function godziny() {
    return ['7:10', '8:00', '8:50', '9:40', '10:30', '11:30', '12:25', '13:15', '14:10'];
}
//JS plz, it should be predefined default xd;
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
//draw empty scheme - use it only once, at start;
var drawTemplate = function () {
    $('body').attr("spellcheck",false);
    for (var r = 0; r < 9; r++) {
        $('<p><span>' + r + '</span></p>').appendTo('#nr');
        $('<p><span>' + this.godziny()[r] + '</span></p>').appendTo('#godz');
    }
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 9; j++) {
            $('<p></p>').appendTo('#' + i);
        }
    }
};
var getDay = function() {
    var d = new Date();
    var day = d.getDay() - 1;
    var hour = d.getHours();
    if (hour > 15) {
        day = day + 1
    }
    if (day-4 < 5 && day >= 0) {
        return day;
    }
};
function setButtonsPosition(){
    var settings = $('#4').offset();
    var settingsW = $('#4').width();
    //var changeClass = $('#0').offset();
    $('#settings').offset({top: settings.top + 2, left: settings.left + settingsW - 47}).show();
}
//flexible font size, depend of text length;
function fixFontSize(row, downSize){
    const maxsize = 14;
    const minsize = 6;
    var elementsLength = 0;
    var childrens = row.children();
    var visiblechildrens = [];
    var size = 14;
    childrens.each(function(){
        if ($(this).is(':visible')){
            elementsLength += $(this).width();
            visiblechildrens.push($(this));
            size = parseInt($(this).css('font-size'));
        }
    });
    if (!downSize) {
        $(childrens).each(function () {
            $(this).css({'font-size': maxsize});
        });
        fixFontSize(row, true);
    } else if (elementsLength > row.width()){
        console.log(elementsLength);
        $(childrens).each(function () {
            $(this).css({'font-size': (size - 1) + 'px'})
        });
        fixFontSize(row, true);
    }
}
//using for write over existing scheme (created via drawTemplate) - can be used multiply times;
var fillTemplate = function (array) {
    var lessons; //array with id's;
    var arr = array || false; //create empty plan? no problem;
    for (var i = 0; i < 5; i++){
        var highlight = false;
        if (i == getDay()){
            highlight = true;
            $("#" + i + "> p").addClass('highlighted');
        }
        for (var j = 0; j < 9; j++){
            var elementsLength = 0;
            //for each row in plan, clear and write new text;
            var row = $("#" + i).children().eq(j+1);
            row.empty();
            //create empty;
            if (!arr) {
                lessons = [1];
                AddtoPlan.lesson(row, "", 1, false);
            } else {
                lessons = array[i][j];
                //k = number of lessons which must be push into 1 row;
                for (var k = 0; k < lessons.length; k++){
                    var id = lessons[k][0];
                    var name = lessons[k][1];
                    var el = AddtoPlan.lesson(row, name, id, highlight);
                    if (k + 1 != lessons.length) {
                        var slash = AddtoPlan.slash(row, id);
                    }
                }
            }
            fixFontSize(row);
        }
    }
    checkCookie();
};
//predefined html object, call method to directly add elem to DOM;
//always should returned added element;
var AddtoPlan = {
    defaultText: '',
    //row - parent of created element, txt - content of element, id - mysql lesson id, editable - true/false;
    lesson: function(row, txt, id, highlight) {
        if (txt == "default" || txt == undefined) {txt = this.defaultText;}
        if (highlight == undefined){highlight = true;}
        if (id == undefined){id = 1;}
        var span;
        if (highlight){
            span = ('<span class="rw field highlighted" data-id="'+ id + '">' + txt + '</span>');
        } else {
            span = ('<span class="rw field" data-id="'+ id + '">' + txt + '</span>');
        }
        row.append(span);
        return row.children().last();
    },
    //hope id's work well with lesson id's;
    slash: function(row, id) {
        if (id == undefined){id = 1;}
        row.append('<span class="slash rw" data-id-slash="'+ id + '"> / </span>');
        return row.children().last();
    }
};

//event handler, remove double clicked element;
function clickOnRowHanlder (){
    $(document).on("dblclick", ".rw", function(){
        var e = $(this);
        var p = e.parent();
        HiddenMenu.add(e);
    });
}
var HiddenMenu = {
    add: function(el){
        var id = el.attr("data-id");
        var lesson = el.text();
        var li = "<li><a data-hiddenId=" + id + ">" + lesson + "</a></li>";
        $("#menu").append(li);
        var e = $('[data-id='+id+']').hide();
        var that = this;
        $(e).each(function(){
            that.switchSlash($(this));
        });
        this.updateCookie();
    },
    restore: function(id, el) {
        el.remove();
        var e = $("[data-id=" + id + "]").show();
        var that = this;
        $(e).each(function(){
            that.switchSlash($(this));
        });
        this.updateCookie();
    },
    switchSlash: function(e){
        var index = e.index();
        var els = e.parent().children();
        var l = els.length;
        var nextVisible = this.searchClosestVisible(els, index+1, l, index);
        var prevVisible = this.searchClosestVisible(els, 0, index, index);
        if (nextVisible !== false){
            if($(els[nextVisible]).hasClass('slash')) {
                $(els[nextVisible]).hide();
            } else {
                $(els[index + 1]).show();
            }
        } else if (prevVisible !== false){
            if ($(els[prevVisible]).hasClass('slash')){
                $(els[prevVisible]).hide();
            } else {
                $(els[index - 1]).show();
            }

        }
        fixFontSize(e.parent());
    },
    searchClosestVisible: function(table, start, stop, compareTo){
        if (table[start] === undefined || table[stop-1] === undefined){
            return false;
        }
        var closest = false;
        var difference = 100;
        for (var i = start; i < stop; i++){
            if ($(table[i]).is(':visible') && difference > Math.abs(compareTo - i)){
                closest = i;
                difference = Math.abs(compareTo - i);
            }
        }
        return closest;
    },
    updateCookie: function(){
        var ids = [];
        var list = $('#menu a[data-hiddenid]');
        $(list).each(function(){
            ids.push($(this).attr('data-hiddenid'));
        });
        var data = JSON.stringify(ids);
        setCookie('hidden', '', 1);
        setCookie('hidden',data, 12*30*24*60*60);
    }
};
//important class - used for communication with server;
var PHP = {
    dir: '../main.php',
    //is lesson id in database?;
    //return id or 0 if not found, take lesson name and el, set id as el.data-id;
    checkID: function(string, el) {
        $.get(PHP.dir, {checkID: string})
            .done(function(id) {
                setAttrDataID(id, el);
            });
    },
    //take class id and callback - probably you should use fillTemplate as callback because
    //return arr[day][hour][lesson] or arr[d][h][lesson1, lesson2, ...] if more than 1 lesson to push to one field;
    load: function(classid, callback) {
        $.ajax({
            type: "GET",
            data: {load: classid},
            url: PHP.dir,
            success: function(res){
                if (res) {
                    if (res.length < 12){
                        callback();
                        return
                    }
                    var arr = JSON.parse(res);
                    console.log(arr);
                    callback(arr);
                } else {
                    throw new Error("sthing went wrong");
                }
            }
        })
    }
};
var CurrentClass = {
    id: 0,
    name: "",
    setId: function(id) {
        this.id = id;
    },
    getId: function(){
        return this.id;
    },
    setName: function(name){
        this.name = name;
        $('#klasa').text(name);
    },
    getName: function(){
        return this.name;
    },
    setHeader: function(text){
        if (text == "default"){
            text = "Plan klasy: "
        }
        $("#header").text(text);
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
function checkCookie(){
    var JSONstring = getCookie('hidden');
    console.log(JSONstring);
    if (JSONstring !== ""){
        var cookie = JSON.parse(JSONstring);
        cookie.forEach(function(id){
            var el = $('[data-id='+id+']');
                HiddenMenu.add($(el[0]));
        });
    }
}
$('#menu').on('click', 'a', function(){
    var e = $(this);
    var id = e.attr('data-hiddenId');
    var el = e.parent();
    HiddenMenu.restore(id, el);
});
(function initiate(){
    drawTemplate();
    clickOnRowHanlder();
    setButtonsPosition();
})();

