const scoreText = document.getElementById('score') as HTMLDivElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!; 
const unitSize: number = 25;
const max: number = canvas.width - unitSize;
const min: number = 0;
let direction: Direction;
let intervalId: number;
let score: number = 0;
let running: boolean = true;
const fruit: Point = { x:  0, y: 0 };
const snake: Point[] = [
    { x: unitSize * 3, y: 0},
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
]

enum Direction {
    Right = 1,
    Left,
    Up,
    Down
}

interface Point {
    x: number,
    y: number
}

function updateGame(): void {
    if (running && direction) {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(snake[snake.length - 1].x, snake[snake.length - 1].y, unitSize, unitSize);

        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { ...snake[i - 1]};
        }

        switch (direction) {
            case Direction.Right:
                snake[0].x = snake[0].x + unitSize;
                break;
            case Direction.Left:
                snake[0].x = snake[0].x - unitSize;
                break;
            case Direction.Up:
                snake[0].y = snake[0].y - unitSize;
                break;
            case Direction.Down:
                snake[0].y = snake[0].y + unitSize;
                break;
        }
        snakeEats();
        createSnake();
        endGame();
    }
}

function endGame(): void {
    if (snake[0].x < min || snake[0].x > max || snake[0].y < min || snake[0].y > max) {
        running = false;
        clearInterval(intervalId);
        displayGameOver();
    }

    else {
        const [head, ...body] = snake;
        for (const segment of body) {
            if (segment.x === head.x && segment.y === head.y) {
                running = false;
                clearInterval(intervalId);
                displayGameOver();
                break;
            }
        }
    }
}

function snakeEats(): void {
    if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
        snake.push({ ...snake[snake.length - 1] });
        score += 1;
        scoreText.textContent = score.toString();
        createFruit();
    }
}

function createSnake(): void {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, unitSize, unitSize)
    });
}

function displayGameOver(): void {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, max, max);
    ctx.fillStyle = "black";
    ctx.font = "50px Consolas";
    const text = "Game Over"
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

function createFruit(): void {
    do {
        fruit.x = randomCoordenate();
        fruit.y = randomCoordenate();
    } while (!checkCoordenates());
    ctx.fillStyle = "red";
    ctx.fillRect(fruit.x, fruit.y, unitSize, unitSize);
}

function checkCoordenates(): boolean {
    return snake.every(segment => segment.x != fruit.x || segment.y != fruit.y)
}

function randomCoordenate(): number {
    return Math.floor(Math.random() * (max / unitSize + 1)) * unitSize;
}

resetBtn.onclick = () => {
    location.reload();
}

createSnake();
createFruit();
intervalId = setInterval(updateGame, 70);

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowRight":
            if (direction != Direction.Left) direction = Direction.Right;
            break;
        case "ArrowLeft":
            if (direction != Direction.Right) direction = Direction.Left;
            break;
        case "ArrowUp":
            if (direction != Direction.Down) direction = Direction.Up;
            break;
        case "ArrowDown":
            if (direction != Direction.Up) direction = Direction.Down;
            break;
    }
});
