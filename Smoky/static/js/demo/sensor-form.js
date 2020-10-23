document.addEventListener("DOMContentLoaded", function () {

    $.ajax({
        method: 'GET',
        url: 'http://smokysmokysmoky.com/get_all_sensors.php',
        dataType: 'json',

        success: (res) => {
            for (var i = 0; i < res.length; i++) {
                create(res[i].sensorID, res[i].name, res[i].limitco2, res[i].limitsmoke, res[i].limitgas, res[i].email);
            }

        }
    })
})

function delete_configuration(sensorID){
    $.ajax({
        method: 'GET',
        url: 'http://smokysmokysmoky.com/delete_sensor.php',
        dataType: 'json',
        data : {
                sensorID: sensorID,
        }
    });
}

function create(ID, name, limitco2, limitsmoke, limitgas, email){
     riga = document.getElementById("form-row").cloneNode(true);
     riga.getElementsByClassName("titolo")[0].textContent = name;
     //var x = riga.getElementsByClassName("col-lg-12")[0];
     //riga.className = "col-lg-6";
     riga.getElementsByClassName("card-body")[0].innerHTML=  "<label for=\"name\">ID sensore: "+ ID +"</label>" +
            //"<br><label>Nome sensore: "+ name +" </label>" +
            "<br><label>Livello allerta co: "+ limitco2 +" ppm</label>" +
            "<br><label>Livello allerta fumo: "+ limitsmoke +" ppm</label>" +
            "<br><label>Livello allerta gas: "+ limitgas +" ppm</label>" +
            "<br><label>Email da notificare: "+ email +"</label>" +
            "<br><button type='button' class='btn btn-danger'>Elimina</button>";
     riga.getElementsByClassName("btn-danger")[0].onclick = async function () {
            if (confirm("Sei sicuro di voler cancellare questo sensore e tutti i suoi relativi dati?")) {
            delete_configuration(ID);
            location.reload();
            }
     }
     document.getElementsByClassName("container-fluid")[0].appendChild(riga);
}


$("#form").on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        type: $(this).prop('method'),
        url : $(this).prop('action'),
        data: $(this).serialize()
    }).done(function() {
        location.reload();
    });
});
