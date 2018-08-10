document.addEventListener("deviceready", onDeviceReady, false);

var b = 0;
var test = {};
var pitanja = {};
var limit = 0;

onDeviceReady();


//izvlacenje trenutnog testa iz localStorage-a i ispisivanje pitanja
function onDeviceReady(){
    test = JSON.parse(localStorage.trenutniTest);
    getLQuestions(test.id);
}

function getLQuestions(id)
{
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
            writeTest();
            pitanja = JSON.parse(this.responseText);
            writeQuestions();   
        }
    };
    req.open(
            "GET",
            "https://hippo-tests-2018.000webhostapp.com/php_functions/listening/getQuestions.php?test_id=" + id,
            true
            );
     req.send();
}


//skupljanje odgovora u array koji ce biti iste duzine kao odg
function submitAnswers()
{
    submitedAnswers = [];
    var counter = 0;
    for(var i = 0; i < limit; i++){
        var temp = document.querySelector('input[name="question' + i + '"]:checked');
        if(temp != null){
            //nzm da li da uopste cuvamo date odg, nzm jel nam trebaju kasnije?
            submitedAnswers.push(temp.value);
            if(submitedAnswers[i] == pitanja[i].correct_answer){
                counter++;
            }
        }else{
            submitedAnswers.push('No answer given');
        }
    }
    localStorage.per = perTest(counter, limit);
}


//ispisujemo reading_text i ime(ovde sigurno treba poraditi na izgledu)
function writeTest()
{
    var name = document.getElementById('test_name_text');;
    name.innerText = test.name;
    var play = document.getElementById('play');
    play.setAttribute('onclick', 'playAudio(' + test.id + ');');
    play.setAttribute('class', 'btn hollow btn-block btn-primary');
    showImage(test.id);
}

//ispisivanje svih pitanja i odg
function writeQuestions()
{
    var wrap = document.getElementById('wrapQuestion');
    limit = pitanja.length;
    for(var k = 0; k < limit; k++)
    {
        //za svako pitanje stvaramo novu formu u koju ubacujemo text pitanja
        var form = document.createElement('form');
        form.setAttribute('id', 'multipleChoiceForm');
        form.setAttribute('class', 'forms');
        var div = document.createElement('div');
        div.innerText = pitanja[k].question;
        form.appendChild(div);
        //stavljamo sve odgovore ovih pitanja u formu, dajemo im isto ime
        //da bi mogli da izvucemo vrednost preko querySelectora i da bi ogranicili na samo jedan selectovan radio button
        var odgovori = [];
        //ubacujemo odgovore za jedno pitanje u array, jer posle hocu da dodam random redosled odgovora
        if (pitanja[k].incorrect_answer3 == "") 
        {
            odgovori.push(pitanja[k].correct_answer, pitanja[k].incorrect_answer1, pitanja[k].incorrect_answer2);
            b = 3;
        }
        else
        {
            odgovori.push(pitanja[k].correct_answer, pitanja[k].incorrect_answer1, pitanja[k].incorrect_answer2, pitanja[k].incorrect_answer3);
            b = 4;
        }
        odgovori = shuffle(odgovori);
        for(var i = 0; i < b; i++)
        {
            var input = document.createElement('input');
            var label = document.createElement('label');
            var span = document.createElement('span');
            var br = document.createElement('br');
            input.setAttribute('type', 'radio');
            input.setAttribute('name' , 'question' + k);
            input.setAttribute('value' , odgovori[i]);
            span.innerText = odgovori[i];
            label.appendChild(input);
            label.appendChild(span);
            form.appendChild(label);
            form.appendChild(br);
        }
        wrap.appendChild(form);
    }
}

function playAudio(id) 
{
    var a = new Audio('https://hippo-tests-2018.000webhostapp.com/audio/audio' + id + '.mp3');
    a.play();
    var play = document.getElementById('play');
    play.parentNode.removeChild(play);
}
function showImage(id, button)
{
    var image = document.getElementById('image');

    if (test.image_file == "") 
    {
        image.parentNode.removeChild(image);

    }
    else
    {
        image.setAttribute('src', 'https://hippo-tests-2018.000webhostapp.com/images/image' + id + '.jpg');
        image.setAttribute('width', '80%');
        image.setAttribute('height', '35%');
    }
    
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function perTest(correct, all){
    return Math.round((correct/all)*100);
}