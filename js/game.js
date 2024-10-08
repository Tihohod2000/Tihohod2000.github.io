var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//Графические пременные
var bird = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();
var bg = new Image();
bird.src = "image/bird3.png";
bg.src = "image/bg.png";
//pipeBottom.src = "image/pipeBottom.png";
//pipeUp.src = "image/pipeUP.png";

pipeBottom.src = "image/pipeBottom.png";
pipeUp.src = "image/pipeBottom.png";


// Переменные взрыва
var boom = new Image();
var boom2 = new Image();
var boom3 = new Image();
boom.src = "image/Boom.png"
boom2.src = "image/boom/boom2.png"
boom3.src = "image/boom/boom3.png"

// Звуковые эфекты
var bgMusic = new Audio();
var ball_audio = new Audio();
var boom_audio = new Audio();
var game_over = new Audio();
var fly = new Audio();
var othcive = new Audio();

bgMusic.src = "music/bgMusic1.mp3";
ball_audio.src = "music/ball.mp3";
boom_audio.src = "music/boom.mp3";
game_over.src = "music/game_over.mp3";
fly.src = "music/fly.mp3";
othcive.src = "music/othcive.mp3";

//Лучший счёт(Результат)
var top = localStorage.getItem('top');

//Расстояние между препятствиями
var gap = 125;


//Скорость игры
var fps = 8;

//Переменная повышения сложности
var lvl = 0


// Позиция птички
var xPos = 40;
var yPos = 70;

// Гравитация
var grav = 2;

//Скорость
var speed = 2;

// Счёт
var ball = 0;

// Километров в час 
var speed_car = 30;

//Переменная проигрыша
var theEnd = 0;




// Функции полёта
function moveUp() {
    fly.play();
    grav -= 12;
}

function moveDown() {
    grav += 3;
}

// При нажатие на копку
document.onkeypress = function (event) {
    //    console.log(event);
    if (event.code == "KeyW") {
        moveUp();
        bgMusic.play();
    }
    if (event.code == "KeyS") {
        moveDown();
    }
}

//При нажатии на мышь
onclick = function (event) {
    moveUp();
    bgMusic.play()
}




// Звук взрыва
function bomba() {
    boom_audio.play();
}

// Анимация взрыва
function boomz() {
    ctx.drawImage(boom, xPos - 20, yPos - 20);
}

function boomz2() {
    ctx.drawImage(boom2, xPos - 10, yPos - 20);
}

function boomz3() {
    ctx.drawImage(boom3, xPos - 15, yPos - 23);
}


// Массив создания блоков
var pipe = [];
pipe[0] = {
    x: cvs.width,
    y: -200
}


function draw() {
    //    bgMusic.play();

    ctx.drawImage(bg, 0, 0, 800, 450);
    ctx.drawImage(bird, xPos, yPos);

    // Расположение блоков
    for (var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y)
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
        pipe[i].x -= speed;

        // Частота спавна блоков
        if (pipe[i].x == 154 || pipe[i].x == 155) {
            // Позиция блоков
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeBottom.height) - pipeBottom.height
            });
        }


        // Условия проигрыша
        if (xPos + bird.width >= pipe[i].x
            && xPos <= pipe[i].x + pipeUp.width
            && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap)
            || (yPos + bird.height * 1.5 <= 0) || (yPos - bird.height >= cvs.height)) {
                theEnd = 1;
                

                bomba();
                boomz();
                setTimeout(boomz2, 90);
                setTimeout(boomz3, 180);
                setTimeout(end(ball, top), 350);
            
        }


        // Счётчик
        if (pipe[i].x < 5 && pipe[i].x > 2) {
            ball += 20;
            speed_car += 3
            ball_audio.play();
        }
    }
    if (ball % 100 == 0 && ball > 0) {
        othcive.play();
    }


    //Сложность
    if (ball % 100 == 0 && ball > 0 && lvl % 5 == 0) {
        lvl = 1;
        console.log(lvl);
        fps -= 1;
        console.log("Текущий уровень сложности", 9 - fps);
    }

    if (ball % 100 == 20) {
        lvl = 0
        //console.log(lvl)
    }



    // Счёт
    ctx.fillStyle = "#fff";
    ctx.font = "20px Verdana";
    ctx.fillText("Счёт: " + ball, 10, cvs.height - 20);
    // Спидометр
    ctx.fillStyle = "#fff";
    ctx.font = "10px Verdana";
    ctx.fillText("km/h " + speed_car, xPos + 13, yPos - 5);

    // Свободное падение
    yPos += grav;

    if (grav < 2) {
        grav += 1;
    }
    if (grav > 2) {
        grav -= 1;
    }

    // Пределы скорости взлёта и подения или сопротивление воздуха
    if (grav > 8) {
        grav = 8;
    }
    if (grav < -11) {
        grav = -11;
    }

    //Созранение лучшего рузельтата в локальную пямать
    // var top = localStorage.getItem('top');
    // top = JSON.parse(top);
    // if (top < ball) {
    //     localStorage.setItem('top', ball);
    // }
    //Функция конца игры
    function end(ball, top) {
        // Запись лучшего результата 
        var top = localStorage.getItem('top');
        top = JSON.parse(top);
        if (top <= ball) {
            localStorage.setItem('top', ball);
        }
        alert("Ты проиграл! Твой счёт ==> " + ball + "  Лучший результат ==> " + top);
        location.reload();
    }

    
    if (theEnd != 0) {
        return
    }

    // Блок анимарования
    setTimeout(draw, fps);
}
// Запуск функции после загрузки background
bg.onload = draw;
