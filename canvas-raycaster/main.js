// partially an implementation of the concepts expressed at https://lodev.org/cgtutor/raycasting.html

let requestAnimationFrame = window.requestAnimationFrame; 
let screen = document.getElementById('screen');
let ctx = screen.getContext("2d");


// grid in which non-zero numbers represent different wall colors
// zero represents a tile without a wall
let mapLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,5,5,5,5,5,5,5,5,5,5,5,5],
    [1, 1, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,5],
    [1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,5,5,5,5,5,5,5,5,5,5,0,5],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0, 3, 0, 0, 1, 1,1,1,1,1,1,1,1,1,1,5,0,5],
    [1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,1,1,1,1,1,1,1,1,1,5,0,5],
    [1, 1, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 1, 1,1,1,1,1,1,1,1,1,1,5,0,5],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 1],
    [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
    [1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 1, 1],
    [1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function draw() {
    for (let x = 0; x <= screen.width; x++) {

        const cameraX = 2 * x / screen.width - 1;
        let rayDirX = dirX + planeX * cameraX;
        let rayDirY = dirY + planeY * cameraX;

        let mapX = Math.floor(posX); // map player position to a position on the map
        let mapY = Math.floor(posY);

        let sideDistX;
        let sideDistY;

        let deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
        let deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
        let wallDist;

        let stepX;
        let stepY;

        let hit = 0;
        let side; // used to determine shading of wall based on whether it is
        // east-west or north-south oriented

        if (rayDirX < 0) { // DDA, Digital Differential Analysis, algorithm
            stepX = -1;
            sideDistX = (posX - mapX) * deltaDistX;
        } else {
            stepX = 1;
            sideDistX = (mapX + 1.0 - posX) * deltaDistX;
        }

        if (rayDirY < 0) {
            stepY = -1;
            sideDistY = (posY - mapY) * deltaDistY;
        } else {
            stepY = 1;
            sideDistY = (mapY + 1.0 - posY) * deltaDistY;
        }

        while (hit == 0) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX;
                mapX += stepX;
                side = 0;
            }
            else {
                sideDistY += deltaDistY;
                mapY += stepY;
                side = 1;
            }

            if (mapLayout[Math.floor(mapY)][Math.floor(mapX)] > 0) { hit = 1 };
        }

        if (side == 0) {
            wallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
        } else {
            wallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;
        }

        let lineHeight = Math.floor(screen.height / wallDist);

        let drawStart = -lineHeight / 2 + screen.height / 2;
        if (drawStart < 0) drawStart = 0;
        let drawEnd = lineHeight / 2 + screen.height / 2;
        if (drawEnd >= screen.height) drawEnd = screen.height - 1;

        let shadowColor; // shadow colors arbitrarily selected

        styles = {
            1: { stroke: 'red', shadow: 'darkred' },
            2: { stroke: 'green', shadow: 'darkgreen' },
            3: { stroke: 'white', shadow: 'grey' },
            4: { stroke: 'yellow', shadow: 'darkgoldenrod' },
            5: { stroke: 'blue', shadow: 'darkblue' }
        }

        const color = mapLayout[mapY][mapX];
        ctx.strokeStyle = styles[color].stroke;
        shadowColor = styles[color].shadow;

        if (side == 1) {
            ctx.strokeStyle = shadowColor;
        }

        ctx.beginPath();
        ctx.moveTo(x, drawStart);
        ctx.lineTo(x, drawEnd);
        ctx.stroke();
        ctx.closePath();

    }
}




function update() {
    requestAnimationFrame(update);

    timeNow = performance.now();
    timeDelta = timeNow - timeThen;

    if (timeDelta > timeInterval) {
        timeThen = timeNow - (timeDelta % timeInterval);
        ctx.clearRect(0, 0, screen.width, screen.height);




        draw();
    }
}

// establish controls through an eventListener

let rotSpeed = 0.06; // values chosen arbitrarily
let movSpeed = 0.4; // 

let oldDirX;
let oldPlaneX;

document.addEventListener('keydown', function (event) {

    switch (event.key) {
        case "ArrowUp":
            if (mapLayout[Math.floor(posY)][Math.floor((posX) + dirX * movSpeed)] == 0) posX += dirX * movSpeed;
            if (mapLayout[Math.floor((posY) + dirY * movSpeed)][Math.floor(posX)] == 0) posY += dirY * movSpeed;
            break;

        case "ArrowDown":
            if (mapLayout[Math.floor(posY)][Math.floor((posX) - dirX * movSpeed)] == 0) posX -= dirX * movSpeed;
            if (mapLayout[Math.floor((posY) - dirY * movSpeed)][Math.floor(posX)] == 0) posY -= dirY * movSpeed;
            break;

        case "ArrowLeft":
            oldDirX = dirX;
            dirX = dirX * Math.cos(rotSpeed) - dirY * Math.sin(rotSpeed);
            dirY = oldDirX * Math.sin(rotSpeed) + dirY * Math.cos(rotSpeed);
            oldPlaneX = planeX;
            planeX = planeX * Math.cos(rotSpeed) - planeY * Math.sin(rotSpeed);
            planeY = oldPlaneX * Math.sin(rotSpeed) + planeY * Math.cos(rotSpeed);
            break;

        case "ArrowRight":
            oldDirX = dirX;
            dirX = dirX * Math.cos(-rotSpeed) - dirY * Math.sin(-rotSpeed);
            dirY = oldDirX * Math.sin(-rotSpeed) + dirY * Math.cos(-rotSpeed);
            oldPlaneX = planeX;
            planeX = planeX * Math.cos(-rotSpeed) - planeY * Math.sin(-rotSpeed);
            planeY = oldPlaneX * Math.sin(-rotSpeed) + planeY * Math.cos(-rotSpeed);

        default:
            break;
    }
}, false);

// entry for execution

let posX = 12;//
let posY = 12;// absolute position of the player within the map layout
let dirX = -1;
let dirY = 0;

let planeX = 0;
let planeY = 0.66; // warning, elusive scope: values accessed from draw() which is accessed from update()

// fps control related variables
let fps = 60;
let timeNow = 0;
let timeThen = performance.now();
let timeInterval = 1000 / fps;
let timeDelta = 0;

update();