
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Estas líneas de código obtienen referencias a los elementos HTML con los identificadores 
// board, scoreBoard, start, y gameOver, respectivamente. 

// Game settings
const boardSize = 10; //  tamaño del tablero
const gameSpeed = 100; // velocidad del juego en milisegundos
const squareTypes = { // tipos de cuadrados
    emptySquare: 0,     // cuadrado vacío
    snakeSquare: 1,    // cuadrado de la serpiente
    foodSquare: 2   // cuadrado de la comida de la seerpiente
};
const directions = { // direcciones
    ArrowUp: -10,      // 10 columnas hacia arriba
    ArrowDown: 10,      // 10 columnas hacia abajo
    ArrowRight: 1,      // 1 columna hacia la derecha
    ArrowLeft: -1,          // 1 columna hacia la izquierda
};

// Game variables
let snake;      // serpiente
let score;      // marcador
let direction;      // dirección
let boardSquares;   // cuadrados del tablero
let emptySquares;   // cuadrados vacíos
let moveInterval;   // intervalo de movimiento


// Esta función dibuja la serpiente en el tablero llamando 
//a la función drawSquare para cada posición de la serpiente.
const dibujarSnake = () => {
    snake.forEach((square, index) => {
        if (index === snake.length - 1) {
            dibujarSquare(square, 'snakeHead');  // Cambia 'snakeSquare' a 'snakeHead' para la cabeza
        } else {
            dibujarSquare(square, 'snakeSquare');
        }
    });
}

// La función drawSquare actualiza la representación visual de un cuadrado en el tablero 
//y mantiene la lista de posiciones vacías.
// @parametros
// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const dibujarSquare = (square, type) => {    
    const [ row, column ] = square.split('');  // separa la posición del cuadrado en fila y columna
    boardSquares[row][column] = squareTypes[type];  // actualiza el tipo de cuadrado en la matriz boardSquares
    const squareElement = document.getElementById(square);  // obtiene el elemento HTML del cuadrado
    squareElement.setAttribute('class', `square ${type}`);  // actualiza la clase del elemento HTML

    if(type === 'emptySquare') {               // si el tipo de cuadrado es emptySquare
        emptySquares.push(square);              // agrega la posición del cuadrado a la lista de posiciones vacías
    } else {
        if(emptySquares.indexOf(square) !== -1) {   // si la posición del cuadrado está en la lista de posiciones vacías
            emptySquares.splice(emptySquares.indexOf(square), 1);   // elimina la posición del cuadrado de la lista de posiciones vacías
        }
    }
}

// La función moveSnake mueve la serpiente en la dirección actual.
const movimientoSnake = () => {
    const newSquare = String(                                   // convierte el nuevo cuadrado en una cadena
        Number(snake[snake.length - 1]) + directions[direction])    // obtiene el nuevo cuadrado sumando la dirección actual a la última posición de la serpiente
        .padStart(2, '0');                                      // agrega un cero al principio si el nuevo cuadrado es menor que 10
    const [row, column] = newSquare.split('');                  // separa la posición del nuevo cuadrado en fila y columna


    if( newSquare < 0 ||                                        // si el nuevo cuadrado es menor que 0
        newSquare > boardSize * boardSize  ||                   // o el nuevo cuadrado es mayor que el tamaño del tablero
        (direction === 'ArrowRight' && column == 0) ||          // o la dirección es ArrowRight y la columna es 0
        (direction === 'ArrowLeft' && column == 9 ||                // o la dirección es ArrowLeft y la columna es 9
        boardSquares[row][column] === squareTypes.snakeSquare) ) {  // o el nuevo cuadrado es un cuadrado de la serpiente
        gameOver();                                                     // termina el juego
    } else {                                                    // de lo contrario
        snake.push(newSquare);                                  // agrega el nuevo cuadrado a la serpiente
        if(boardSquares[row][column] === squareTypes.foodSquare) {  // si el nuevo cuadrado es un cuadrado de comida
            añadirComida();                                              // agrega comida
        } else {                                                // de lo contrario
            const emptySquare = snake.shift();                          // elimina el primer cuadrado de la serpiente y lo convierte en un cuadrado vacío
            dibujarSquare(emptySquare, 'emptySquare');             // dibuja el cuadrado vacío
        }
        dibujarSnake();                                        // dibuja la serpiente
    }
}


//La función addFood incrementa el puntaje, actualiza el 
//marcador y crea nueva comida en una posición aleatoria.
const añadirComida = () => {                                         
    score++;                // incrementa el marcador
    updateScore();        // actualiza el marcador
    crearComidaRandom();         // crea nueva comida
}

const gameOver = () => {        // termina el juego
    gameOverSign.style.display = 'block';   // muestra el mensaje de game over
    clearInterval(moveInterval)        // limpia el intervalo de movimiento para poder volver a jugar
    startButton.disabled = false;       // habilita el botón de inicio
}

const setDirection = newDirection => {
    direction = newDirection;
}

//maneja los eventos de teclado y actualiza la dirección 
//de la serpiente según la tecla presionada.
const directionEvent = key => {
    switch (key.code) {                                         // actualiza la dirección de la serpiente según la tecla presionada
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)  // si la dirección no es ArrowDown, actualiza la dirección
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)    // si la dirección no es ArrowUp, actualiza la dirección
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code) // si la dirección no es ArrowRight, actualiza la dirección
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)  // si la dirección no es ArrowLeft, actualiza la dirección
            break;
    }
}

// La función createRandomFood crea comida en una posición aleatoria.
const crearComidaRandom = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]; // obtiene una posición aleatoria de la lista de posiciones vacías
    dibujarSquare(randomEmptySquare, 'foodSquare');
}

// La función updateScore actualiza el marcador.
const updateScore = () => {
    scoreBoard.innerText = score;  // actualiza el marcador
}

// La función createBoard crea el tablero.
const crearTablero = () => {
    boardSquares.forEach( (row, rowIndex) => {  // crea el tablero
        row.forEach( (column, columnndex) => {  // crea el tablero
            const squareValue = `${rowIndex}${columnndex}`;     // convierte la posición del cuadrado en una cadena
            const squareElement = document.createElement('div');    // crea un elemento HTML
            squareElement.setAttribute('class', 'square emptySquare');  // actualiza la clase del elemento HTML
            squareElement.setAttribute('id', squareValue);          // actualiza el id del elemento HTML
            board.appendChild(squareElement);                       // agrega el elemento HTML al tablero
            emptySquares.push(squareValue);                        // agrega la posición del cuadrado a la lista de posiciones vacías
        })
    })
}


//La función setGame inicializa las variables del juego, 
//establece la posición inicial de la serpiente y crea el tablero.
const setGame = () => {
    snake = ['00', '01', '02', '03']; // posición inicial de la serpiente
    score = 0;   // puntaje inicial (restado de la longitud inicial de la serpiente)
    direction = 'ArrowRight';   // dirección inicial
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));  // crea una matriz de cuadrados vacíos
    console.log(boardSquares);  // imprime la matriz de cuadrados vacíos
    board.innerHTML = '';   // limpia el tablero
    emptySquares = [];      // limpia la lista de posiciones vacías
    crearTablero();          // crea el tablero
}

const startGame = () => {
    setGame();              // inicializa las variables del juego
    gameOverSign.style.display = 'none';    // oculta el mensaje de game over
    startButton.disabled = true;        // deshabilita el botón de inicio
    dibujarSnake();                        // dibuja la serpiente
    updateScore();                      // actualiza el marcador
    crearComidaRandom();                    // crea comida en una posición aleatoria
    document.addEventListener('keydown', directionEvent);   // agrega un evento de teclado
    moveInterval = setInterval( () => movimientoSnake(), gameSpeed);  // mueve la serpiente cada gameSpeed milisegundos
}

// boton de inicio
startButton.addEventListener('click', startGame);