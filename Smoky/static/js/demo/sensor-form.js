document.getElementById("aggiungiButton").onclick = function(){

    let co = 0;
    let smoke = 0;
    let gas = 0;
    let email="a.b@c.it";
    let id = 1;

    riga = document.getElementById("form-row").cloneNode(true);
    riga.getElementsByClassName("card-body")[0].innerHTML=  "<label for=\"name\">ID sensore: "+ id +"</label>" +
        "<br><label>Livello allerta co: "+ co +" ppm</label>" +
        "<br><label>Livello allerta fumo: "+ smoke +" ppm</label>" +
        "<br><label>Livello allerta gas: "+ gas +" ppm</label>" +
        "<br><label>Email notificata: "+ email +"</label>" +
        "<br><button type='button' class='btn btn-danger'>Elimina</button>";
    document.getElementsByClassName("container-fluid")[0].appendChild(riga);


};