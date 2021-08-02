let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let markedField = document.querySelector('.marked');
let mf = document.querySelector('.how-much-marked');
let btnPlay = document.querySelector('.play');

let stat = document.querySelector('.status');

let modal = document.querySelector(".modal");
let quit = document.querySelector(".quit");
//let form = document.querySelector("form");
let input = document.getElementById('how-much');
let btnAgree = document.querySelector('.agree');
let btnTen = document.querySelector(".ten");
let btnRnd = document.querySelector(".rnd");
let think = document.querySelector('.think');

let main = document.querySelector('main');
let well = document.querySelector(".well");
let howMuchMines = document.querySelector(".how-much-mines");

let hours = document.querySelector(".hours");
let minutes = document.querySelector(".minutes");
let seconds = document.querySelector(".seconds");

let start, end, differ;

let winner = document.querySelector(".winner");
let quitWin = document.querySelector('.quit-win');
let inputWin = document.getElementById("winner-name");
let quitWinClick;

let nameWin = document.querySelector(".name");
let winners = document.querySelector(".winners");
let winnersTable = document.querySelector(".winners-list");
let nameWinClick;

let thank = document.querySelector('.thank');
let thankClick;

ctx.font = '30px Verdana';
ctx.textBaseline = "top";

const grid = 40;
const height = 400;
const width = 400;

let howMuch; // = 10;

let mines; //массив мин
let counts; //массив чисел, сколько мин вокруг
let isOpened;
let isMarked;
let countMarked;
let countOpened;
let endGame;
let seed;
let a;
let b;
let avail;
let secondsValue, minutesValue, hoursValue;
let timerId;

let canvasClick, canvasRightClick, canvasMouseClick,
    btnArgeeClick, quitClick, btnTenClick, btnRndClick, btnPlayClick;

function askMines() {
    btnPlay.removeEventListener('click', btnPlayClick);
    main.classList.remove("visible");
    main.classList.add("hidden");
    modal.classList.remove("hidden");

    btnArgeeClick = function (evt) {
        evt.preventDefault();
        if (input.value == "" || input.value < 0 || input.value >= 100 || isNaN(input.value) == true) {
            think.classList.add('visible-block');
            think.textContent = "Подумайте над своим поведением";
        } else {
            howMuch = +input.value;
            think.classList.remove('visible-block');
            think.classList.add('hidden');
            modal.classList.add("hidden");
            howMuchMines.textContent = howMuch;
            main.classList.add('visible');
            play();
        }
    };

    quitClick = function () {
        howMuch = 10;
        modal.classList.add("hidden");
        howMuchMines.textContent = howMuch;
        main.classList.add('visible');
        play();
    };

    btnTenClick = function (evt) {
        evt.preventDefault();
        input.value = 10;
    };

    btnRndClick = function (evt) {
        evt.preventDefault();
        input.value = Math.floor(Math.random() * 100);
    };

    btnTen.addEventListener('click', btnTenClick);
    btnRnd.addEventListener('click', btnRndClick);
    btnAgree.addEventListener('click', btnArgeeClick);
    quit.addEventListener('click', quitClick);


}

function play() {
    seconds.textContent = 0;
    minutes.textContent = 0;
    hours.textContent = 0;
    clearInterval(timerId);
    start = new Date();
    secondsValue = 0;
    minutesValue = 0;
    hoursValue = 0;



    timerId = setInterval(() => {
        end = new Date();
        differ = end - start;
        secondsValue++;
        if (secondsValue == 60) {
            secondsValue = 0;
            minutesValue++;
            if (minutesValue == 60) {
                minutesValue = 0;
                hoursValue++;
            }
        }
        seconds.textContent = secondsValue;
        minutes.textContent = minutesValue;
        hours.textContent = hoursValue;
    }, 1000);


    btnPlayClick = function () {
        askMines();
    };

    btnPlay.addEventListener('click', btnPlayClick);

    canvas.removeEventListener('click', canvasClick);
    canvas.removeEventListener('contextmenu', canvasRightClick);
    canvas.removeEventListener("mousedown", canvasMouseClick);

    btnTen.removeEventListener('click', btnTenClick);
    btnRnd.removeEventListener('click', btnRndClick);
    btnAgree.removeEventListener('click', btnArgeeClick);
    quit.removeEventListener('click', quitClick);

    canvasClick = function (evt) {
        if (endGame == false) {
            let userX, userY;
            userX = Math.trunc(evt.clientY / grid);
            userY = Math.trunc(evt.clientX / grid);
            console.log(mines);
            console.log(seed);
            console.log(userX, userY);
            openAll(userX, userY);
        }
    };

    canvasRightClick = function (evt) {
        evt.preventDefault();
        console.log(countMarked);
        if (endGame == false) {

            let mineUserX = Math.trunc(evt.clientY / grid),
                mineUserY = Math.trunc(evt.clientX / grid);
            if (isOpened[mineUserX][mineUserY] == false) {
                if (isMarked[mineUserX][mineUserY] == false) {

                    paintEmo(mineUserY, mineUserX, 'img/mine.png');
                    isMarked[mineUserX][mineUserY] = true;
                    countMarked++;
                    markedField.textContent = countMarked;

                } else {

                    isMarked[mineUserX][mineUserY] = false;
                    ctx.fillStyle = 'rgb(200, 250, 240)';
                    ctx.fillRect(mineUserY * grid + 1, mineUserX * grid + 1, grid - 2, grid - 2);
                    countMarked--;
                    markedField.textContent = countMarked;
                }
            }
            console.log(countMarked);
            console.log(mineUserX, mineUserY);
        }

    };

    canvasMouseClick = function (evt) {
        evt.preventDefault();
        if (endGame == false) {
            if (evt.which === 2) {
                let middleX, middleY;
                middleX = Math.trunc(evt.clientY / grid);
                middleY = Math.trunc(evt.clientX / grid);

                let countUser = 0;
                for (let v = middleX - 1; v < middleX + 2; v++) {
                    for (let w = middleY - 1; w < middleY + 2; w++) {
                        if (v >= 0 && v <= 9 && w >= 0 && w <= 9 && isMarked[v][w] == true) {
                            countUser++;
                        }
                    }
                }

                if (counts[middleX][middleY] == countUser && countUser !== 0) {
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
    };

    function openAll(userX, userY) {

        if (mines[userX][userY] == true) {
            console.log('Boom!');
            clearInterval(timerId);
            stat.textContent = "Вы проиграли. Эхь";
            endGame = true;
            isOpened[userX][userY] = true;
            mines.forEach((item, i) => { //было ismarked
                item.forEach((item_j, j) => {
                    if (item_j == true) {
                        if ((i == userX && j == userY) == false) { // changed
                            paintEmo(j, i, 'img/sad.png'); //changed
                        }
                    }
                });
            });

            paintEmo(userY, userX, 'img/po.png'); //changed


        } else {

            if (isOpened[userX][userY] == false && endGame == false && isMarked[userX][userY] == false) {
                drawCountsAndBg(userX, userY);
                isOpened[userX][userY] = true;
                countOpened++;
                openSafe(userX, userY);
            }
        }

        if (countOpened == 100 - howMuch) {
            console.log("Win!");
            clearInterval(timerId);
            for (let p = 0; p < 10; p++) {
                for (let s = 0; s < 10; s++) {
                    if (isMarked[p][s] == false && mines[p][s] == true) {
                        paintEmo(s, p, 'img/mine.png'); //changed
                    }
                }
            }
            stat.textContent = "Вы молодесь! Вы выиграли!";
            endGame = true;

            quitWinClick = function () {
                winner.classList.remove("visible-block");
                winner.classList.add("hidden");
                quitWin.removeEventListener("click", quitWinClick);

            };

            nameWinClick = function (evt) {
                evt.preventDefault();
                quitWinClick();
                localStorage.setItem(differ, inputWin.value);

                let array = []; //массив для сортировки ключей из всего LS
                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    array.push(key);
                }

                let newArray = array.sort((a, b) => a - b); //все отсортированные ключи
                if (localStorage.length > 5) {
                    newArray.slice(0, 5);
                } // первые 5 отсортированных ключей

                let forDelete = newArray.splice(5, localStorage.length - 5);

                for (let i = 0; i < forDelete.length; i++) {
                    localStorage.removeItem(forDelete[i]);
                }

                winners.classList.remove("hidden");
                winners.classList.add("visible-block");
                nameWin.removeEventListener("click", nameWinClick);

                let tableHeader = document.createElement('tr');
                winnersTable.append(tableHeader);
                let tableHeaderData = [];
                for (let i = 0; i < 3; i++) {
                    tableHeaderData[i] = document.createElement('th');
                    tableHeader.append(tableHeaderData[i]);
                }
                tableHeaderData[1].textContent = 'Имя';
                tableHeaderData[2].textContent = 'Время';

                let tableRows = []; //5 или менее строк
                let tableData = []; //3 столбца
                for (let i = 0; i < newArray.length; i++) {
                    tableRows[i] = document.createElement('tr');
                    winnersTable.append(tableRows[i]);
                    for (let j = 0; j < 3; j++) {
                        tableData[j] = document.createElement('td');
                        tableRows[i].append(tableData[j]);
                    }
                    
                    tableData[0].textContent = i + 1;
                    tableData[1].textContent = `${localStorage.getItem(newArray[i])}`;
                    tableData[2].textContent = `${Math.floor(newArray[i]/1000/60/60)} ч. ${Math.floor((newArray[i]/1000/60)%60)} мин. ${Math.floor((newArray[i]/1000)%60)} с.`;
                }

            };
            
            thankClick = function () {
                winners.classList.remove("visible-block");
                winners.classList.add("hidden");
                thank.removeEventListener('click', thankClick);
                winnersTable.innerHTML = '';
                //localStorage.clear();
            };

            thank.addEventListener('click', thankClick);

            winner.classList.remove("hidden");
            winner.classList.add("visible-block");
            quitWin.addEventListener("click", quitWinClick);
            nameWin.addEventListener("click", nameWinClick);

        }

    }

    function paintEmo(i, j, imageSrc) {
        ctx.fillStyle = 'rgb(200, 250, 240)';
        ctx.fillRect((i * grid) + 1, (j * grid) + 1, grid - 2, grid - 2);
        let image = new Image();
        image.addEventListener("load", function () {
            ctx.drawImage(image, i * grid + 3, j * grid + 3, grid - 6, grid - 6); // здесь выполняет drawImage функцию
        }, false);
        image.src = imageSrc; // Устанавливает источник файла
    }

    function openSafe(x, y) {
        if (counts[x][y] == 0) {
            for (let c = x - 1; c < x + 2; c++) {
                for (let d = y - 1; d < y + 2; d++) {
                    if (c >= 0 && c <= 9 && d >= 0 && d <= 9 && isOpened[c][d] == false && isMarked[c][d] == false) {
                        isOpened[c][d] = true;
                        countOpened++;
                        drawCountsAndBg(c, d);
                        openSafe(c, d);
                    }

                }
            }
        }
    }

    function drawCounts(color, userX, userY) {
        ctx.fillStyle = color;
        ctx.fillText(`${counts[userX][userY]}`, userY * grid + grid / 4, userX * grid + grid / 5); //changed
    }

    function drawCountsAndBg(userX, userY) { //changed
        ctx.fillStyle = 'rgb(200, 240, 250)';
        ctx.fillRect((userY * grid) + 1, (userX * grid) + 1, grid - 2, grid - 2);

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
                ctx.fillRect(userY * grid + 1, userX * grid + 1, grid - 2, grid - 2);
                ctx.strokeStyle = 'rgb(200, 200, 200)';
                ctx.strokeRect(userY * grid, userX * grid, grid, grid);
            }
            break;
        default:
            drawCounts('white', userX, userY);
            break;
        }
    }


    mines = []; //массив мин
    counts = []; //массив чисел, сколько мин вокруг
    isOpened = [];
    isMarked = [];
    countMarked = 0;
    countOpened = 0;
    endGame = false;

    console.log(howMuch);
    markedField.textContent = '0';
    stat.textContent = ' ';
    //рисование поля
    ctx.fillStyle = 'rgb(200, 250, 240)';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
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

    seed = [];
    // let howMuch = 10;

    for (let i = 0; i < 10; i++) {
        mines[i] = [];
        counts[i] = []; //массив чисел, сколько мин вокруг
        isOpened[i] = [];
        isMarked[i] = [];

        for (let j = 0; j < 10; j++) {
            mines[i][j] = false;
            counts[i][j] = 0; //массив чисел, сколько мин вокруг
            isOpened[i][j] = false;
            isMarked[i][j] = false;
        }
    }

    for (let i = 0; i < 100; i++) {
        seed[i] = i;
    }

    for (let i = 0; i < 100 - howMuch; i++) {
        seed.splice((Math.trunc(Math.random() * seed.length)), 1);
    }

    //console.log(seed);
    //console.log(seed.length);

    a = 0;
    b = 0;
    avail = true;

    function check(x, y) {
        if (x < 0 || x > 9 || y < 0 || y > 9) {
            return false;
        } else {
            return true;
        }
    }

    seed.forEach((item) => {
        a = Math.floor(item / 10);
        b = item % 10;
        mines[a][b] = true;

        for (let i = a - 1; i < a + 2; i++) {
            {
                for (let j = b - 1; j < b + 2; j++) {
                    avail = check(i, j);
                    if (avail == true && mines[i][j] == false) {
                        counts[i][j]++;
                    }
                }

            }
        }
    });

    canvas.addEventListener('click', canvasClick);
    canvas.addEventListener('contextmenu', canvasRightClick);
    canvas.addEventListener("mousedown", canvasMouseClick);

    //console.log(seed);
    //console.log(seed.length);
    //console.log(mines);
    //console.log(counts);

}
/* console.log(seed);
console.log(seed.length);
console.log(mines);
console.log(counts); */

askMines();
//play();
console.log(howMuch);