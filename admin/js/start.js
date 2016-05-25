/**
 * Created by mati on 2016-04-11.
 */
$.ajax({
    type: "GET",
    data: {getList: 1},
    url: "../start.php",
    success: function(res){
        console.log(res);
        res = JSON.parse(res);
        showButtons(res);
    }
});
function showButtons(array){
    for (var i = 0; i < array.length; i++){
        var btn = createButton(array[i]);
        btn.appendTo("#buttons");
    }
    createButton("Dodaj", "add").appendTo("#buttons");

}
function createButton(string, type){
    if (type == "add"){
        return $('<div class="col-xs-6 col-sm-3 col-md-2 btn-container"><input id="inputName" class="input-sm" />' +
            '<button type="button" data-clicked="0" class="btn btn-primary btn-lg btn-block" id="add">'+string+'</button></div>');
    }
    return $('<div class="col-xs-6 col-sm-3 col-md-2 btn-container"><button type="button"' +
        'class="btn btn-warning btn-lg btn-block">'+string+'</button></div>');
}
$(document).on('click', '.btn-lg', function(){
    var btn = $(this);
    var txt;
    if (btn.attr('id') == 'add'){
        var input = $("#inputName");
        if (btn.attr('data-clicked') == 0) {
            btn.animate({
                height: '-=20px',
                'padding-top': 0
            });
            input.show();
            btn.attr('data-clicked', 1);
        } else {
            if (input.val().length == 0) {
                btn.animate({
                    height: '100%',
                    'padding-top': '10px'
                });
                input.hide();
                btn.attr('data-clicked', 0);
            } else {
                txt = input.val();
                window.location.href = ("kl/" + txt);
            }
        }
        return;
    }
    txt = btn.text();
    window.location.href = ("kl/" + txt);
    console.log(window.href);
});