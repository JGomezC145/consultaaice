var versions = "https://cdn-jgomezc145.github.io/centrales/code/TSPanel/js/base.json";
let pversion = document.getElementById("version");
let thisversion ="3.45"


//get the latest version
function getVersion() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', versions, true);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        var latestRelease = data.latestRelease;
        var latestBeta = data.latestBeta;
        console.log(latestRelease);
        console.log(latestBeta);
    }
    xhr.send();
}

//set the version in the footer
function setVersion() {
    var xhr = new XMLHttpRequest();
    var latestRelease;
    xhr.open('GET', versions, true);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        latestRelease = data.latestRelease;
        var latestBeta = data.latestBeta;
        //console.log(latestRelease);
        //console.log(latestBeta);
        pversion.innerHTML = "v" + latestBeta;
    }
    xhr.send();

    if (thisversion != latestRelease) {
        pversion.title = "v" + latestRelease;
    }
}

setVersion();