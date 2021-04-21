let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let markedField=document.querySelector('.marked');
let mf = document.querySelector('.how-much-marked');
let btn = document.querySelector('button');
let stat = document.querySelector('.status');

ctx.font = '30px Verdana';

const grid = 40;
const height = 400;
const width = 400;

play();

btn.addEventListener('click', play);


function play(){
let mineX = [];
let mineY = [];
let counts = [];
let isOpened = [];
let isMarked = [];
let countMarked = 0;
let countOpened = 0;
let endGame = false;
markedField.textContent='0';
stat.textContent=' ';

ctx.fillStyle = 'rgb(200, 250, 240)';
ctx.fillRect(0, 0, width, height);

ctx.lineWidth = 1;
ctx.strokeStyle = 'rgb(0, 0,0)';

for (let i = 1; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(grid * i, 0);
    ctx.lineTo(grid * i, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, grid * i);
    ctx.lineTo(width, grid * i);
    ctx.stroke();

}

function countAround(i, j) {
    let count = 0;
    for (let a = i - 1; a < i + 2; a++) {
        for (let b = j - 1; b < j + 2; b++) {

            for (let l = 0; l < 10; l++) {
                if (mineX[l] == a && mineY[l] == b) {
                    count++;
                }
            }
        }
    }
    return count;
}

function openSafe(x, y) {
    //console.log('works');
    if (counts[x][y] == 0) {
        for (let c = x - 1; c < x + 2; c++) {
            for (let d = y - 1; d < y + 2; d++) {
                if (c >= 0 && c <= 9 && d >= 0 && d <= 9 && isOpened[c][d] == false) {

                    isOpened[c][d] = true;
                    countOpened++;
                    drawCountsAndBg(c, d);
                    openSafe(c, d);
                }

            }
        }
    }
}


for (let i = 0; i < 10; i++) { // объявление мин
    mineX[i] = Math.trunc(Math.random() * 10);
    mineY[i] = Math.trunc(Math.random() * 10);
}
for (let g = 0; g < 10; g++) { // в случае совпадения мин
    for (let h = g + 1; h < 10; h++) {
        if (mineX[g] == mineX[h] && mineY[g] == mineY[h]) {
            mineX[h] = Math.trunc(Math.random() * 10);
            mineY[h] = Math.trunc(Math.random() * 10);
            g = 0;
            h = 1;
            console.log('was 9');
        }
    }
}
for (let i = 0; i < 10; i++) {
    //ctx.fillStyle = 'red';
    //ctx.fillRect(mineX[i] * grid, mineY[i] * grid, grid, grid);
}

for (let i = 0; i < 10; i++) {
    counts[i] = [];
    isOpened[i] = [];
    isMarked[i] = [];
    for (let j = 0; j < 10; j++) {
        counts[i][j] = countAround(i, j);
        isOpened[i][j] = false;
        isMarked[i][j] = false;
        ctx.textBaseline = "top";
        ///ctx.fillText(`${counts[i][j]}`, i * grid, j * grid);
    }
}

function drawCounts(color, userX, userY) {
    ctx.fillStyle = color;
    ctx.fillText(`${counts[userX][userY]}`, userX * grid + grid / 4, userY * grid + grid / 5);
}

function drawCountsAndBg(userX, userY) {
    ctx.fillStyle = 'rgb(200, 240, 250)';
    ctx.fillRect((userX * grid) + 1, (userY * grid) + 1, grid - 2, grid - 2);

    switch (counts[userX][userY]) {
        case 1:
            drawCounts('red', userX, userY);
            break;
        case 2:
            drawCounts('green', userX, userY);
            break;
        case 3:
            drawCounts('blue', userX, userY);
            break;
        case 4:
            drawCounts('black', userX, userY);
            break;
        case 0: {
            ctx.fillStyle = 'rgb(200, 240, 250)';
            ctx.fillRect(userX * grid + 1, userY * grid + 1, grid - 2, grid - 2);
            ctx.strokeStyle = 'rgb(200, 200, 200)';
            ctx.strokeRect(userX * grid, userY * grid, grid, grid);
        };
        break;
    default:
        drawCounts('white', userX, userY);
        break;
    }
}

function openAll(userX, userY) {

    for (let i = 0; i < 10; i++) {
        if (userX == mineX[i] && userY == mineY[i]) {
            console.log('Boom!');
            stat.textContent="Вы проиграли. Эхь";
            endGame = true;
            isOpened[userX][userY] = true;
            ctx.fillStyle = 'rgb(200, 250, 240)';
            ctx.fillRect(userX * grid + 1, userY * grid + 1, grid - 2, grid - 2); // костыль
            let mineOpened = new Image();
            mineOpened.addEventListener("load", function () {
                ctx.drawImage(mineOpened, mineX[i] * grid + 3, mineY[i] * grid + 3, grid - 6, grid - 6); // здесь выполняет drawImage функцию
            }, false);
            mineOpened.src = 'img/po.png'; // Устанавливает источник файла


            for (let k = 0; k < 10; k++) {
                if (i == k) {
                   // ctx.fillStyle = 'rgb(200, 250, 240)';
                   // ctx.fillRect((userX * grid) + 1, (userY * grid) + 1, grid - 2, grid - 2);
                    continue;
                } else {
                    if (isMarked[mineX[k]][mineY[k]]==true){

                    
                    ctx.fillStyle = 'rgb(200, 250, 240)';
                   ctx.fillRect((mineX[k] * grid) + 1, (mineY[k] * grid) + 1, grid - 2, grid - 2);
                
                
                    let mineClosed = new Image();
                    mineClosed.addEventListener("load", function () {
                        ctx.drawImage(mineClosed, mineX[k] * grid + 3, mineY[k] * grid + 3, grid - 6, grid - 6); // здесь выполняет drawImage функцию
                    }, false);
                    mineClosed.src = 'img/sad.png'; // Устанавливает источник файла
                }
                }
            }
        } else {

            if (isOpened[userX][userY] == false && endGame == false) {
                drawCountsAndBg(userX, userY);
                isOpened[userX][userY] = true;
                countOpened++;
                openSafe(userX, userY);
            }
        }
    }
    if (countOpened == 90) {
        console.log("Win!");
        for (let p = 0; p < 10; p++) {
            if (isMarked[mineX[p]][mineY[p]] == false) {
                let mineWin = new Image();
                mineWin.addEventListener("load", function () {
                    ctx.drawImage(mineWin, mineX[p] * grid + 3, mineY[p] * grid + 3, grid - 6, grid - 6); // здесь выполняет drawImage функцию
                }, false);
                mineWin.src = 'img/mine.png'; // Устанавливает источник файла
            }
        }
        stat.textContent="Вы молодесь! Вы выиграли!";
        mf.textContent='';
        endGame = true;
    }
}

canvas.addEventListener('click', function (evt) {
    if (endGame == false) {
        let userX, userY;
        userX = Math.trunc(evt.clientX / grid);
        userY = Math.trunc(evt.clientY / grid);
        openAll(userX, userY);
    }
});

canvas.addEventListener('contextmenu', function (evt) {
    evt.preventDefault();
    if (endGame == false) {

        let imgMine = new Image();
        let mineUserX = Math.trunc(evt.clientX / grid),
            mineUserY = Math.trunc(evt.clientY / grid);
        if (isOpened[mineUserX][mineUserY] == false) {
            if (isMarked[mineUserX][mineUserY] == false) {
                imgMine.addEventListener("load", function () {
                    ctx.drawImage(imgMine, mineUserX * grid + 3, mineUserY * grid + 3, grid - 6, grid - 6); // здесь выполняет drawImage функцию
                }, false);
                imgMine.src = 'img/mine.png'; // Устанавливает источник файла
                isMarked[mineUserX][mineUserY] = true;
                countMarked++;
                markedField.textContent=countMarked;


            } else {

                isMarked[mineUserX][mineUserY] = false;
                ctx.fillStyle = 'rgb(200, 250, 240)';
                ctx.fillRect(mineUserX * grid + 1, mineUserY * grid + 1, grid - 2, grid - 2);
                countMarked--;
                markedField.textContent=countMarked;
            }
        }
    }
});

canvas.addEventListener("mousedown", function (evt) {
    evt.preventDefault();
    if (endGame == false) {
        if (evt.which === 2) {
            // console.log("Middle");
            let middleX, middleY;
            middleX = Math.trunc(evt.clientX / grid);
            middleY = Math.trunc(evt.clientY / grid);

            let countUser = 0;
            for (let v = middleX - 1; v < middleX + 2; v++) {
                for (let w = middleY - 1; w < middleY + 2; w++) {
                    if (v >= 0 && v <= 9 && w >= 0 && w <= 9 && isMarked[v][w] == true) {
                        countUser++;
                    }
                }
            }
            if (counts[middleX][middleY] == countUser && countUser!==0) {
                for (let m = middleX - 1; m < middleX + 2; m++) {
                    for (let n = middleY - 1; n < middleY + 2; n++) {
                        if (m >= 0 && m <= 9 && n >= 0 && n <= 9 && isMarked[m][n] == false && isOpened[m][n] == false) {
                            openAll(m, n);
                        }
                    }
                }

            }
        }
    }
});
};