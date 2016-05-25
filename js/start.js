/**
 * Created by mati on 2016-04-11.
 */
$.ajax({
    type: "GET",
    data: {getList: 1},
    url: "start.php",
    success: function(res){
        console.log("RESULT: " + res);
        res = JSON.parse(res);
        showButtons(res);
    }
});
function showButtons(array){
    for (var i = 0; i < array.length; i++){
        var btn = createButton(array[i]);
        btn.appendTo("#buttons");
    }
}
function createButton(string){
    return $('<div class="col-xs-6 col-sm-3 col-md-2 btn-container"><button type="button"' +
        'class="btn btn-warning btn-lg btn-block">'+string+'</button></div>');
}
$(document).on('click', '.btn-lg', function(){
    var txt = $(this).text();
    window.location.href = ("kl/" + txt);
    console.log(window.href);
});