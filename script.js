let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = '22px Verdana';

const grid = 40;
const height = 400;
const width = 400;

const mineX = [];
const mineY = [];
let counts = [];
let isOpened = [];
let countOpened =0;

ctx.fillStyle = 'rgb(200, 250, 240)';
ctx.fillRect(0, 0, width, height);

ctx.strokeStyle = 'black';

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
                    ctx.fillText(`${counts[c][d]}`, c * grid, d * grid);
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
    for (let g = 0; g < 10; g++) {
        for (let h = g+1; h < 10; h++) {
            if (mineX[g] == mineX[h] && mineY[g] == mineY[h]) {
                mineX[h] = Math.trunc(Math.random() * 10);
                mineY[h] = Math.trunc(Math.random() * 10);
                g = 0;
                h = 1;
                console.log('was 9');
            }
        }
    }
    for (let i = 0; i < 10; i++){
    ctx.fillStyle = 'red';
    //ctx.fillRect(mineX[i] * grid, mineY[i] * grid, grid, grid);
}


for (let i = 0; i < 10; i++) {
    counts[i] = [];
    isOpened[i] = [];
    for (let j = 0; j < 10; j++) {
        //let count = 0;
        // for (let a = i - 1; a < i + 2; a++) {
        //     for (let b = j - 1; b < j + 2; b++) {

        //         if (mineX[i] == a && mineY[i] == b) {
        //             count++;
        //         }
        //     }
        counts[i][j] = countAround(i, j);
        isOpened[i][j] = false;
        ctx.textBaseline = "top";
        ///ctx.fillText(`${counts[i][j]}`, i * grid, j * grid);
    }

}



let userX, userY;
canvas.addEventListener('click', function (evt) {
    userX = Math.trunc(evt.clientX / grid);
    userY = Math.trunc(evt.clientY / grid);
    //console.log(userX, userY);

    for (i = 0; i < 10; i++) {
        if (userX == mineX[i] && userY == mineY[i]) {
            console.log('Boom!');
            ctx.fillStyle = 'red';
            ctx.fillRect(mineX[i] * grid, mineY[i] * grid, grid, grid);

            for (let k = 0; k < 10; k++) {
                if (i == k) {
                    continue;
                } else {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(mineX[k] * grid, mineY[k] * grid, grid, grid);
                }
            }

        } else {

            // это строка - работает 
            //ctx.fillText(`${countAround(userX, userY)}`, userX * grid, userY * grid);
            if (isOpened[userX][userY] == false) {
                ctx.fillText(`${counts[userX][userY]}`, userX * grid, userY * grid);
                isOpened[userX][userY] = true;
                countOpened++;
                //if (counts[userX][userY] == 0) {
                openSafe(userX, userY);
                //}
            }

            // if (counts[userX][userY] == 0) {
            //     for (let c = userX - 1; c < userX + 2; c++) {
            //         for (let d = userY - 1; d < userY + 2; d++) {
            //             if (c >= 0 && d >= 0 && counts[c][d] == 0) {
            //                 for (let e = c - 1; e < c + 2; e++) {
            //                     for (let f = d - 1; f < d + 2; f++) {
            //                         if (e >= 0 && f >= 0) {
            //                             ctx.fillText(`${counts[e][f]}`, e * grid, f * grid);
            //                         }
            //                     }
            //                 }
            //             ctx.fillText(`${counts[c][d]}`, c * grid, d * grid);    
            //             }

            //         }
            //     }
            // }

        }

    }
    if (countOpened == 90) {
        console.log("Win!");
    }

});

canvas.addEventListener('contextmenu', function(evt){
evt.preventDefault();
let imgMine = new Image();
let mineUserX = Math.trunc(evt.clientX / grid),
mineUserY = Math.trunc(evt.clientY / grid);
imgMine.addEventListener("load", function() {
    ctx.drawImage(imgMine, mineUserX*grid+3, mineUserY*grid+3, grid-6, grid-6);// здесь выполняет drawImage функцию
  }, false);
  imgMine.src = 'img/mine.png'; // Устанавливает источник файла
});

