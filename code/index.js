moment.locale('es')


var time = {};
/* var monto = document.getElementById('money')
var namess = document.getElementById('name')*/
var butt = document.getElementById('butt') 
var result = document.getElementById('result')

function reqListener() {
    var temp = JSON.parse(this.response)
    if (temp.error.code == 0 ) {
        time = temp.data[0].mfacturado;
        var fnam = temp.data[0].nombre;
        var fven = (temp.data[0].fevencimiento).split(' ');
    
    
        if (moment(fven[0], 'YYYY-MM-DD').isBefore(moment())) {
            var venven = '  <b class="red">(' + moment(fven[0], 'YYYY-MM-DD').fromNow() + ') </b>'
        } else {
            var venven = '  (' + moment(fven[0], 'YYYY-MM-DD').fromNow() + ')'
        }
    
    
        result.innerHTML = `<h2 id="name">${fnam}</h2><hr><h2 id="money">${currency(time, { separator: ' ', symbol: '₡' }).format()}</h2><hr><h2 id="vence">Fecha de vencimiento:<br> ${moment(fven[0], 'YYYY-MM-DD').format('DD/MM/YYYY') + venven}</h2>`
    
    
    } else {
        result.innerHTML = '<h2>No hay recibos pendientes aún</h2><hr>'
    }
    butt.classList = "button"
    butt.blur()
}

function pedir() {
    butt.classList = "button invisible"
    result.innerHTML = '<h2>Espere un momento...</h2>'
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "https://apps.grupoice.com/FacturaElectrica/api/FactElecICE/?nise=869108");
    oReq.send();
}


/* window.addEventListener('onload', () => {
    console.log('cargado')
}) */
window.onload = function (e){
    pedir()
}