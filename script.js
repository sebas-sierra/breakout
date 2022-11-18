let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// Estas dos variables marcan el origen desde el que comienza el movimiento de la pelotita
let x = canvas.width / 2;
let y = canvas.height - 5;

//Con esta variables agregamos un pequenio valor a x e y para simular el movimiento de la pelotita
let dx = 2;
let dy = -2;

const ballRadius = 5;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

//controls
let rightPressed = false;
let leftPressed = false;

//variables para la definicion de los ladrillos
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 2;
const brickOffsetTop = 28;
const brickOffsetLeft = 8;

const bricks = [];
for (let c  = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

let score = 0;
let lives = 3;

//Esta funcion dibuja la pelotita que rebota dentro del canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle= "#fff";
    ctx.fill();
    ctx.closePath();
}
//Esta funcion dibuja la barra que permite hacer rebotar la pelota
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
//Esta funcion dibuja la pared de ladrillos
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095dd";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw(){
    //Este metodo clearRect limpia el contenido del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    //console.log(bricks);
    drawBall();    
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection(); 
    //Este pequenio incremento en los valores de los ejes 'x' e 'y' generan el efecto de desplazamiento de la pelotita
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            lives--;
            if (!lives) {
                alert("Game Over");
                document.location.reload();
                clearInterval(interval);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    x += dx;
    y += dy;

    //Este condicional controla el movimiento de la barrita
    if (rightPressed) {
        paddleX = Math.min(paddleX +2, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX -2, 0);
    };

}
//La funcion draw() function sera ejecutada dentro de la funcion setInterval cada 10 milisegundos
const interval = setInterval(draw, 5);

//Definicion de los listeners de los btns
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("Ganaste, Felicitaciones!");
                        document.location.reload();
                        clearInterval(interval);

                    }
                }    
            }
            
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}