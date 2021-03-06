let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.font = '22px Verdana';

const grid = 40;
const height = 400;
const width = 400;

const mineX = [];
const mineY = [];

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


for (let i = 0; i < 10; i++) {
    mineX[i] = Math.trunc(Math.random() * 10);
    mineY[i] = Math.trunc(Math.random() * 10);

    ctx.fillStyle = 'red';
    //ctx.fillRect(mineX[i] * grid, mineY[i] * grid, grid, grid);
}

let userX, userY;
canvas.addEventListener('click', function (evt) {
        userX = Math.trunc(evt.clientX / grid);
        userY = Math.trunc(evt.clientY / grid);
        //console.log(userX, userY);
        let count = 0;
        for (i = 0; i < 10; i++) {
            if (userX == mineX[i] && userY == mineY[i])
            {
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

        }
     else {

        for (let a = userX - 1; a < userX + 2; a++) {
            for (let b = userY - 1; b < userY + 2; b++) {
                if (mineX[i] == a && mineY[i] == b) {
                    count++;
                }
                console.log(a, b, mineX[i], mineY[i]);
            }
        }
        console.log(count);
        ctx.textBaseline = "top";


    }

}
//if (count > 0) {
    ctx.fillText(`${count}`, userX * grid, userY * grid);
//}
});