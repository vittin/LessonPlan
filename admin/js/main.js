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
            $('<p class="fillable"></p>').appendTo('#' + i);
        }
    }
};
//repair text overflow
function fixFontSize(row, scale){
    var elementsLength = 0;
    var childrens = row.children();
    childrens.each(function(){
        if ($(this).is(':visible')){
            elementsLength += $(this).width();
        }
    });
    var size = parseInt(row.css('font-size'));
    if (row.width() < elementsLength + (2*childrens.length + 4)) {
        row.css({'font-size': (size-1)+"px"});
        fixFontSize(row, 1);
        return;
    }
    if (0.8 * row.width() > elementsLength && size < 14 && !scale) {
        row.css({'font-size': (size+1)+"px"});
        fixFontSize(row);
    }
}
//using for write over existing scheme (created via drawTemplate) - can be used multiply times;
var fillTemplate = function (array) {
    var lessons; //array with id's;
    var arr = array || false; //create empty plan? no problem;
    for (var i = 0; i < 5; i++){
        for (var j = 0; j < 9; j++){
            var elementsLength = 0;
            //for each row in plan, clear and write new text;
            var row = $("#" + i).children().eq(j+1);
            row.empty();
            //create empty;
            if (!arr) {
                lessons = [1];
                AddtoPlan.lesson(row, "default", 1, true);
            } else {
                lessons = array[i][j];
                //k = number of lessons which must be push into 1 row;
                for (var k = 0; k < lessons.length; k++){
                    var id = lessons[k][0];
                    var name = lessons[k][1];
                    //default "no set" lesson, we don't need look for name in database;
                    //otherwise, create temporary empty block with valid id and ask server for name;
                    if (id == 1){
                        //only 1, empty lesson? so create default editable;
                        if (lessons.length == 1){
                            AddtoPlan.lesson(row, "default", 1, true);
                        }
                    } else {
                        var el = AddtoPlan.lesson(row, name, id, false);
                        el.addClass('edited');
                        elementsLength += el.width();
                        if (k + 1 != lessons.length){
                            var slash = AddtoPlan.slash(row, id);
                            elementsLength += slash.width();
                        }
                    }
                }
                if (row.children().last().attr('contenteditable') == "false") {
                    addNextEditable(row.children().last());
                }
            }
        }
    }
};
//predefined html object, call method for directly add elem to DOM;
//always should returned added element;
var AddtoPlan = {
    defaultText: 'Tutaj wpisz lekcje',
    //row - parent of created element, txt - content of element, id - mysql lesson id, editable - true/false;
    lesson: function(row, txt, id, editable) {
        if (txt == "default" || txt == undefined) {txt = this.defaultText;}
        if (editable == undefined){editable = true;}
        if (id == undefined){id = 1;}
        var span = ('<span class="rw" data-id="'+ id +'" contenteditable="' + editable + '">' + txt + '</span>');
        row.append(span);
        fixFontSize(row);
        return row.children().last();
    },
    //(el) id = (el - 1) id;
    slash: function(row, id) {
        if (id == undefined){id = 1;}
        row.append('<span class="slash rw" data-id="'+ id + '"> / </span>');
        return row.children().last();
    }
};
//create new empty field for text and disable editing previous; maybe break single responsibility principle a bit; (!)
function addNextEditable(e) {
    var parent = e.parent();
    if (!e.hasClass('edited')) {
        e.addClass('edited');
    }
    e.attr('contenteditable', false);
    var slash = AddtoPlan.slash(parent, 1);
    slash.hide();
    AddtoPlan.lesson(parent, "");
}
//after click enter;
function focusNext(el){
    var e = el.parent();
    var parentId = e.parent().attr('id');
    var nextEl = e.next();
    //if next el doesn't exist we should go to next day, if next day doesn't exist - focus out;
    if (nextEl.length > 0){
        nextEl.children().eq(0).focus();
    } else if (parentId < 4){
        $("#"+(parseInt(parentId)+1)).children().eq(1).children().eq(0).focus();
    } else {
        e.blur();
    }
}
//set cursor after last char when we back to editing (eg from help-list);
function setCaret(e) {
    var el = e[0];
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], e.text().length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    //el.focus();
}
//event handler, determine actions after focusin and focusout;
function focusInOutHandler(){
    //default labels;
    var txt = 'Tutaj wpisz lekcje';
    var txt2 = '---';

    $(document).on('focus', '.rw', function(){
        var e = $(this);
        //show slash;
        if (e.prev().length > 0){
            $(e).prev().show();
        }
        //deprecated - now always true (can't editing existing fields); (!)
        if($(e).text() === txt || $(e).text() === txt2){
            $(e).text('');
        }
    });
    $(document).on('focusout', '.rw', function() {
        var txtEl = fixTextLength($(this), 20, "", false);
        var e = $(this);
        //gui.hide will check id too; again SRP so much; (!)
        helpGUI.hide(e, txtEl);
        //compare with default labels, if we write nothing we shouldn't change anything;
        if(txtEl === '' || txtEl == txt2 || txtEl == txt ||txtEl == undefined){
            //if element is alone - add txt for encourage user to edit field; else remove txt;
            if(e.prev().length == 0) {
                e.text(txt);
            } else {
                e.text('');
            }
            e.removeClass('edited');
            //hide slash;
            e.prev().hide();
        }
        else {
            addNextEditable(e);
        }
    });
    $(document).on('focusin', '#klasa', function(){
        $(this).text("");
    });
    $(document).on('focusout', '#klasa', function() {
        var nameClass = fixTextLength($(this),15,"", false);
        var name = CurrentClass.getName();
        if (nameClass.length == 0 || nameClass == name){
            $(this).text(name);
        } else if ($(".edited").length < 1){
            window.location.replace(nameClass);
        } else {
            CurrentClass.setName(nameClass);
            CurrentClass.setId(0);
        }
    })
}
//event handler, remove double clicked element;
function clickOnRowHanlder (){
    $(document).on("dblclick", ".rw", function(){
        var e = $(this);
        var p = e.parent();
        //slash is removed too;
        if (e.prev().length > 0) {
            e.prev().remove();
        } else if (e.next().length > 0){
            e.next().remove();
        }
        e.remove();
        if (p.children().length < 3){
            p.empty();
            AddtoPlan.lesson(p, "default", 1, true);
        }
        fixFontSize(p);
    });
    $(document).on("click", ".fillable", function(e){
        var p = $(this);
        if ($(e.target).hasClass('fillable')){ // <33333333
            p.children().last().focus();
        }
    });
    $(document).on("keypress", "#klasa", function(e){
            var elem = $(this);
            var char = String.fromCharCode(e.which);
            var txt = fixTextLength(elem, 15, char, true);
            e.preventDefault();
            if (e.which == 13){
                window.location.replace(txt);
                return;
            }
            setCaret(elem);
        }
    );
}
//important class - used for communication with server;
var PHP = {
    array: [],
    arrReady: false,
    dir: '../../main.php',
    //ask for all names matching user string;
    //return arr[] with all matching names;
    getAdvice: function(string, e) {
        $.get(PHP.dir, {check: string})
            .done(function(data) {
                PHP.array = eval(data);
                PHP.array.sort();
                PHP.arrReady = true;
                helpGUI.show(PHP.array, e);
            });
    },
    //is lesson id in database?;
    //return id or 0 if not found, take lesson name and el, set id as el.data-id;
    checkID: function(string, el) {
        $.get(PHP.dir, {checkID: string})
            .done(function(id) {
                setAttrDataID(id, el);
            });
    },
    //return lesson name, take lesson id and el where this name should be insert;
    checkName: function(id, el) {
        $.get(PHP.dir, {checkName: id})
            .done(function(name) {
                if (name){
                    el.text(name);

                }
            });
    },
    //adding single lesson to db, USE IT ONLY AFTER checkID for avoid doubling records in database;
    //return and take is similar to checkID;
    addToDB: function(string, el) {
        $.get(PHP.dir, {addToDB: string})
            .done(function (id) {
                setAttrDataID(id, el);
            });
    },
    //sibling to checkID, but immediately push id to array which is prepared to send to server;
    finalCheck: function(string, i, j, k, el, callback) {
        $.get(PHP.dir, {finalCheck: string})
            .done(function (id) {
                callback(id, i, j, k, el);
            });
    },
    //send array with lesson to server; NOTE: it is html POST method;
    //take json, void (or return success 200 maybe);
    save: function(json, cName) {
        $.ajax({
            type: "POST",
            data: {data : json, className: cName},
            url: PHP.dir,
            success: function(res){
            }
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
                    callback(arr);
                } else {
                    throw new Error("sthing went wrong");
                }
            }
        })
    },
    checkClassId: function(className, callback){
        $.get(PHP.dir, {kl: className})
            .done(function (id) {
                callback(id, fillTemplate);
            });
    }
};
//take element and set data-id to id;
function setAttrDataID(id, el){
    el.attr("data-id", id);
    var prev = el.prev();
    //slash gain id too, easier way to delete / hide it later;
    if(prev.length > 0) {
        prev.attr("data-id", id);
    }
}
//inside helpGUI events;
var arrowKeys = {
    tempTxt: "",
    down: function(e) {
        var advices = $(".help");
        var active = $(".selected");
        var id = active.index();
        var elem = advices.eq(id);
        var txt;
        if (advices.length > 0) {
            if (active.length < 1) {
                arrowKeys.tempTxt = e.text();
                advices.eq(0).addClass("selected");
                active = $(".selected");
                id = active.index();
                elem = advices.eq(id);
                txt = elem.text();
            } else if (elem.next().length > 0) {
                elem.next().addClass("selected");
                elem.removeClass("selected");
                active = $(".selected");
                txt = elem.next().text();
            }
            if (txt != helpGUI.str){
                helpGUI.addIsFocused = false;
                e.text(txt);
            } else {
                helpGUI.addIsFocused = true;
            }
        }
    },
    up: function(e) {
        var advices = $(".help");
        var active = $(".selected");
        var id = active.index();
        var elem = advices.eq(id);
        var txt;
        var outOfBounds = false;
        if (advices.length > 0 && active.length > 0) {
            if (elem.prev().length > 0) {
                elem.prev().addClass("selected");
                txt = elem.prev().text();
            } else {
                txt = arrowKeys.tempTxt;
                outOfBounds = true;
            }
            elem.removeClass("selected");
            e.text(txt);
            return outOfBounds;
        }
    },
    right: function(e) {
        if (PHP.array[0] !== helpGUI.str) {
            e.text(PHP.array[0]);
        }
    }
};
function fixTextLength($elem, maxlength, lastchar, focused){
    if (lastchar === undefined){lastchar = "";}
    if (focused === undefined){focused = true;}
    var text = $elem.text();
    if (text.length > maxlength){
        text = (text.substring(0, maxlength));
    }
    var realText = text + lastchar;
    if (!focused){
        realText = realText.trim();
    }
    var fixed = realText.replace(/[^A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ\s]/g, "");
    $elem.text("");
    $elem.text(fixed);
    if (focused){
        setCaret($elem);
    }
    return fixed;
}
//in lesson-row events;
function followchanges(){
    $(document).on("keyup", ".rw", function(event){
        var key = event.which;
        var arr = PHP.array;
        var e = $(this);
        var text = e.text();
        var backspaceClicked = false;
        //if user delete all text we couldn't help him, can't read in thoughts :(
        if (text.length == 0){
            helpGUI.hide();
            return;
        }
        //backspace
        if (key == 8){
            backspaceClicked = true;
        }
        //enter
        if (key == 13) {
            //add button;
            if (helpGUI.addIsFocused || PHP.array[0] == helpGUI.str) {
                PHP.addToDB(text.trim(), e);
            } else if (PHP.array.length > 0) {
                var name = e.text();
                PHP.checkID(name, e);
            }
            helpGUI.hide();
            e.blur();
            focusNext(e);
            return;
        }
        //down key
        if (key == 40) {
            if(text.length > 2){
                arrowKeys.down(e);
            }
            return;
        }
        //up key
        if (key == 38) {
            var outOfBounds = arrowKeys.up(e);
            if (outOfBounds) {
                text = e.text();
                setCaret(e);
            }
            return;
        }
        //right key
        if (key == 39) {
            arrowKeys.right(e);
            return;
        }
        //ask server only when user write 3 letter, repeat when he backspace a letter;
        if (text.length == 3 || (text.length >= 3 && backspaceClicked)) {
            PHP.getAdvice(text, e);
            PHP.arrReady = false;
        }
        //default values (---) and (Tutaj wpisz lekcje);
        var str = helpGUI.str;
        //if array is set (except default val);
        if (arr[0] != null){
            if (arr[0][0] != 0 && arr[0][0] != str) {
                for (var i = 0; i < arr.length; i++){
                    var string = arr[i].replace(/\s+/g, '');
                    var noWhiteCharsTxt = text.replace(/\s+/g, '');
                    if (!string.contains(noWhiteCharsTxt)){
                        arr.splice(i, 1);
                        i -= 1;
                    }
                }
            }
        }
        //if not found or all tips was deleted becouse they didn't match the user pattern - show "add" button;
        if (arr[0] == 0 || arr[0] == str || !arr[0]) {
            if (!arr[0]) {
                arr[0] = [str];
            }
            //...but only if text length > 2;
            if (text.length > 2 && PHP.arrReady){
                helpGUI.show(arr, e);
            }
        }
    });
    $(document).on("keypress", ".rw", function(event){
        if(event.which == 13 || event.which == 38) { //second contidion dont work; (!)
            event.preventDefault();
        }
        var char = String.fromCharCode(event.which);
        if (char == " "){
        }
        fixTextLength($(this), 20, char);
        event.preventDefault();
    })
}
var helpGUI = {
    lastclicked: [],
    str: "Nie znaleziono. Dodaj.",
    addIsFocused: false,
    focused: 0,
    show: function(arr, e){
        this.lastclicked[0] = parseInt(e.parent().parent().attr('id'));
        this.lastclicked[1] = e.parent().prevAll().index();
        this.lastclicked[2] = e.index();
        var pos = e.parent().offset();
        var posX = pos.left;
        var posY = pos.top;
        var w = e.parent().width();
        var h = e.parent().height();
        var infobox = $("#infobox");
        if (infobox.length == 0){
            helpGUI.add(w);
            helpGUI.setPosition(posX,posY,w,h);
            infobox = $("#infobox");
        } else if (!infobox.is(':visible')){
            helpGUI.setPosition(posX, posY, w, h);
            infobox.fadeIn(0);
        }
        var infoboxULs = $('#infobox > #scroll > ul');
        infoboxULs.empty();
        for (var i = 0; i < arr.length; i++){
            infoboxULs.append('<li class=help>'+ arr[i] + '</li>');
        }
    },
    add: function(w) {
        $("body").append('<div id=infobox><div id=scroll><ul></ul></div></div>');
        var infobox = $('#infobox');
        infobox.css('width', w);
        helpGUI.click();
        this.focused = 0;
    },
    setPosition: function(x,y,w,h) {
        var infobox = $("#infobox");
        infobox.css("top", y + h + "px");
        infobox.css("left", x + "px");
        infobox.css("width", w + "px");
    },
    hide: function(e, string) {
        $('#infobox').fadeOut(100);
        if (e !== undefined && string !== undefined){
            PHP.checkID(string, e);
        }
    },
    click: function() {
        $(document).on('mousedown', '.help', function(){
            var e = $(this);
            var txt = e.text();
            var obj = helpGUI.lastclicked;
            var target = $("#"+obj[0]).children().eq(obj[1]+1).children().eq(obj[2]);
            if (txt == helpGUI.str) {
                txt = target.text();
                PHP.addToDB(txt.trim(), e);
            }
            target.text(txt);
            PHP.checkID(txt, target);
        })
    }
};

var PlanArray = {
    array: new Array(5),
    callbackcounter: 0,
    ready: function() {
        return (this.callbackcounter == 0);
    },
    addTask: function() {
        this.callbackcounter += 1;
    },
    endTask: function() {
        this.callbackcounter -= 1;
    },
    set: function(i,j,k, val){
        this.array[i][j][k] = val;
    },
    get: function(){
        return this.array;
    },
    create: function(size, index, index2){
        if (index2 == undefined){
            this.array[index] = new Array(size);
        } else {
            this.array[index][index2] = new Array(size);
        }
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
$('#save').click(function(){
    for (var i = 0; i < 5; i++) {
        var column = $("#" + i).children();
        PlanArray.create(9, i);
        for (var j = 0; j < 9; j++){
            var row = column.eq(j+1).children();
            var arrLength = Math.max(((row.length - 1) / 2), 1); //simply but clever
            PlanArray.create(arrLength, i, j);
            var c = 0;
            for (var k = 0; k < arrLength; k++) {
                var el = row.eq(2*k);
                var id = el.attr('data-id');
                if (id == 0){
                    var text = el.text();
                    PlanArray.addTask();
                    PHP.finalCheck(text.trim(), i, j, c, el, function(index, i, j, c, el){
                        PlanArray.set(i,j,c,index);
                        setAttrDataID(index, el);
                        PlanArray.endTask();
                    });
                    c += 1;
                    continue;
                }
                PlanArray.set(i,j,c,id);
                c += 1;
            }
        }
    }
    function check() {
        if (PlanArray.ready()){
            sendToServer();
        } else {
            setTimeout(check, 100);
        }
    }
    check();
    function sendToServer(){
        var JSONarray = JSON.stringify(PlanArray.get());
        var string = $("#klasa").text().trim();
        if (string == "wpisz"){return}
        PHP.save(JSONarray, string); //TODO: IMPORTANT: validate className (dropTable etc);
    }
});
function setButtonsPosition(){
    var settings = $('#4').offset();
    var settingsW = $('#4').width();
    //var changeClass = $('#0').offset();
    $('#settings').offset({top: settings.top + 2, left: settings.left + settingsW - 47}).show();
}
$('#restore').click(function(){
    if (CurrentClass.getId() > 0){
        PHP.load(CurrentClass.getId(), fillTemplate);
    } else {
        PHP.checkClassId(CurrentClass.getName(), PHP.load);
    }
});
$('#reset').click(function(){
    fillTemplate();
});
(function initiate(){
    drawTemplate();
    focusInOutHandler();
    clickOnRowHanlder();
    followchanges();
    setButtonsPosition();
    console.log('admin');
})();

