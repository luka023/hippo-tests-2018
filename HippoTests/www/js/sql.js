//ovo sam citao u njihovoj dokumentaciji da treba da se koristi uz sve aplikacije, da ne bi doslo do prevremenog pokretanja
document.addEventListener("deviceready", onDeviceReady, false);

var testovi;
var potrebniTestovi;

onDeviceReady();

function onDeviceReady(){
    checkRURL();
    checkLURL();
}

//izbor nivoa, koji se cuva u localStoragu, ovo bi trebalo da je pristupno svakoj js skripti, ili kao sto sam ja ovde koristio istoj skripti pri promeni str
function selectLevel(level){
    localStorage.level = level;
}


function selectTest(anchorId){
    testovi.forEach(function(test){
        if(test.id == anchorId){
            localStorage.trenutniTest = JSON.stringify(test);
            console.log(localStorage.trenutniTest);
        }
    })
}

//proverava da li se applikacija nalazi na read_show_tests stranici i ako jeste pokrece ispisivanje testova
function checkRURL(){
    var page = location.pathname;
    if(page == '/read_show_tests.html'){
        getRTests(localStorage.level);
    }
}
function checkLURL(){
    var page = location.pathname;
    if(page == '/list_show_tests.html'){
        getLTests(localStorage.level);
    }
}

function getRTests(level)
{
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            testovi = JSON.parse(this.responseText);
            potrebniTestovi = [];
            var div = document.getElementById('choiceForm'); 
            for (var i = testovi.length - 1; i >= 0; i--) 
            {
                //console.log(testovi[i]);
                if (level == testovi[i].level) {
                    //nasao je sve testove ciji je hippo level jednak izabranom i dodaje jedan anchor(tj ono dugme) za svaki takav test
                    potrebniTestovi.push(testovi[i]);
                    //pravljenje novog elementa 
                    var inputDiv = document.createElement('div');
                    inputDiv.setAttribute('class', 'input-group');
                    var colDiv = document.createElement('div');
                    inputDiv.setAttribute('class', 'col-md-6');
                    var anchor = document.createElement('a');
                    //dodavanje atributa
                    anchor.setAttribute('class', 'btn hollow btn-block btn-success');
                    anchor.setAttribute('id', 'choice' + testovi[i].id);
                    anchor.setAttribute('onclick', 'selectTest(' + testovi[i].id + ')');
                    anchor.setAttribute('href', 'read_show_question.html');
                    //promenta teksta u ime testa
                    anchor.innerText = testovi[i].name;
                    //stavlja anchor ispod proslog
                    colDiv.appendChild(anchor);
                    inputDiv.appendChild(colDiv);
                    div.appendChild(inputDiv);
                }
            }
            //u slucaju da nema takvih testova
            if (potrebniTestovi.length == 0) 
            {
                    alert("No tests found!");
            }
        }
    };
    req.open(
            "GET",
            "https://hippo-tests-2018.000webhostapp.com/php_functions/reading/getTests.php",
            true
            );
     req.send();
}


function getLTests(level)
{
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            testovi = JSON.parse(this.responseText);
            potrebniTestovi = [];
            var div = document.getElementById('choiceForm');
            for (var i = testovi.length - 1; i >= 0; i--) {
                //console.log(testovi[i]);
                if (level == testovi[i].level) {
                    //nasao je sve testove ciji je hippo level jednak izabranom i dodaje jedan anchor(tj ono dugme) za svaki takav test
                    potrebniTestovi.push(testovi[i]);
                    //pravljenje novog elementa 
                    var inputDiv = document.createElement('div');
                    inputDiv.setAttribute('class', 'input-group');
                    var colDiv = document.createElement('div');
                    inputDiv.setAttribute('class', 'col-md-6');
                    var anchor = document.createElement('a');
                    //dodavanje atributa
                    anchor.setAttribute('class', 'btn hollow btn-block btn-primary');
                    anchor.setAttribute('id', 'choice' + testovi[i].id);
                    anchor.setAttribute('onclick', 'selectTest(' + testovi[i].id + ')');
                    anchor.setAttribute('href', 'list_show_question.html');
                    //promenta teksta u ime testa
                    anchor.innerText = testovi[i].name;
                    //stavlja anchor ispod proslog
                    colDiv.appendChild(anchor);
                    inputDiv.appendChild(colDiv);
                    div.appendChild(inputDiv);
                }
            }
            if (potrebniTestovi.length == 0) 
            {
                    alert("No tests found!");
            }
        }
    };
    req.open(
            "GET",
            "https://hippo-tests-2018.000webhostapp.com/php_functions/listening/getTests.php",
            true
            );
     req.send();
}