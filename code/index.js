moment.locale('es')

Boolean.prototype.toNumber = function () {
    return this ? 1 : 0;
};

var active = true;

const internet = {
    check: function () {
        if (navigator.onLine) {
            return true;
        } else {
            return false;
        }
    },
    show: {
        off: function () {
            document.getElementById('internet').classList = 'internet visibleI';
        },
        on: function () {
            document.getElementById('internet').classList = 'internet invisibleI';
        },
        nocon: function () {
            result.innerHTML = '<h2>No hay conexión a internet, verifica tu conexión.</h2><hr>';
        }
    },
    checkAndShow: function () {
        if (internet.check()) {
            internet.show.on();
        } else {
            internet.show.off();
        }
    }
}


//cookie manager
function setCookie(cname, cvalue, exdays = 365) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}



var time = {};
/* var monto = document.getElementById('money')
var namess = document.getElementById('name')*/
var butt = document.getElementById('butt') 
var result = document.getElementById('result')
var searcher = document.getElementById('searcher');

searcher.addEventListener('submit', (e) => {
    e.preventDefault()
    var niseI = document.getElementById('niseI').value
    if (niseI.length >= 6 || niseI.length <= 8) {
        pedirN(niseI)
    } else {
        alert('NISE inválido-')
    }
})



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
        
        limit = getCookie('limit')

        if (limit) {
            if (time > limit) {
                var redd = 'class="redmoney"'
            } else {
                var redd = ''
            }
        }
    
        result.innerHTML = `<h2 id="name">${fnam}</h2><hr><h2 id="money" ${redd}>${currency(time, { separator: ' ', symbol: '₡' }).format()}</h2><hr><h2 id="vence">Fecha de vencimiento:<br> ${moment(fven[0], 'YYYY-MM-DD').format('DD/MM/YYYY') + venven}</h2>`
    
    
    } else {
        result.innerHTML = '<h2>No hay recibos pendientes aún</h2><hr>'
    }
    butt.classList = "button"
    butt.blur()
}

function pedirN(nise) {
    if (internet.check()) {
        butt.classList = "button invisible"
        result.innerHTML = '<h2>Espere un momento...</h2>'
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", "https://apps.grupoice.com/FacturaElectrica/api/FactElecICE/?nise=" + nise);
        oReq.send();
    } else {
        internet.show.nocon()
    }
}


function pedir() {
    if (internet.check()){
        var nise = getCookie('nise')
        if (nise != '') {
            pedirN(nise)
        } else {
            result.innerHTML = '<h2>Por favor, ingrese su NISE en ajustes</h2>'
        }
    } else {
        internet.show.nocon()
    }
}

window.onload = function (e){
    if (active) {
        if(internet.check()){
            var nise = getCookie('nise')
            if (nise != '') {
                pedir()
            } else {
                result.innerHTML = '<h2>Por favor, ingrese su NISE en ajustes</h2>'
                var nisef = prompt('Ingrese su NISE', '123456')
                if (nisef) {
                    if (nisef.length >= 6 || nisef.length <= 8) {
                        setCookie('nise', nisef)
                        pedir()
                    } else {
                    }
                }
            }
        } else {
            internet.show.nocon()
        }
    } else {
        //result.innerHTML = '<h2>Deshabilitado por sistema</h2>'
        result.innerHTML = `<h2 id="name">Prueba</h2><hr><h2 id="money">₡ 170 251</h2><hr><h2 id="vence">Fecha de vencimiento:<br> el viernes <b class="red"> (mañana) </b></h2>`
        butt.classList = "button"
        butt.blur()
    }
}

window.addEventListener('online',  function(e) {
    internet.show.on();
});
window.addEventListener('offline',  function(e) {
    internet.show.off();
});

navigator.serviceWorker.register('code/sw.js').then(function(registration) {
    console.log('Service worker registered:', registration);
});

function loaddata() {
    var configNise = document.getElementById('configNise')
    var configLimit = document.getElementById('configLimit')
    configNise.value = getCookie('nise')
    configLimit.value = getCookie('limit')
}
loaddata()



function savedata() {
    var configNise = document.getElementById('configNise').value
    var configLimit = document.getElementById('configLimit').value
    if (configNise.length >= 6 || configNise.length <= 8) {
        setCookie('nise', configNise)
        setCookie('limit', configLimit)
        alert('Guardado')
        location.reload()
    } else {
        alert('NISE inválido')
    }
}