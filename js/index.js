let context = document.getElementById("puzzle").getContext("2d");
if (window.innerWidth <= 600) {
    $('#puzzle').attr('width', `${window.innerWidth * 0.8}px`);
    $('#puzzle').attr('height', `${window.innerWidth * 0.8}px`);
} else {
    $('#puzzle').attr('width', '480px');
    $('#puzzle').attr('height', '480px');
}
let img = new Image();
let item = [
    'https://media.discordapp.net/attachments/904673398439940108/904743053074530376/KakaoTalk_20211031_022515919_06.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904743056069230652/KakaoTalk_20211031_022515919_07.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748573198000159/KakaoTalk_20211102_000543309.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748573609046086/KakaoTalk_20211102_000543309_09.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748574343061574/KakaoTalk_20211102_000543309_01.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748575471325214/KakaoTalk_20211102_000543309_02.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748575911714866/KakaoTalk_20211102_000543309_03.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748578017271868/KakaoTalk_20211102_000543309_04.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748580701614080/KakaoTalk_20211102_000543309_05.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748580626108416/KakaoTalk_20211102_000543309_06.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748582123499620/KakaoTalk_20211102_000543309_07.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904748582870081606/KakaoTalk_20211102_000543309_08.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749376860192769/KakaoTalk_20211102_000543309_10.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749377472594010/KakaoTalk_20211102_000543309_11.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749377644544040/KakaoTalk_20211102_000543309_12.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749378579873832/KakaoTalk_20211102_000543309_13.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749379968172082/KakaoTalk_20211102_000543309_14.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749381981458472/KakaoTalk_20211102_000543309_15.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749382312808448/KakaoTalk_20211102_000543309_16.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749384414146570/KakaoTalk_20211102_000543309_18.jpg',
    'https://media.discordapp.net/attachments/904673398439940108/904749386150588466/KakaoTalk_20211102_000543309_17.jpg',
];
const rand_int_len = Math.floor(Math.random() * (item.length - 2));
img.src = item[rand_int_len] + `?width=${$('#puzzle').width()}&height=${$('#puzzle').height()}`;
$('#preview').attr('src', item[rand_int_len]);

// img.width = document.getElementById('puzzle').width;
img.addEventListener('load', drawTiles, false);

let boardSize = document.getElementById('puzzle').width;
let tileCount = document.getElementById('scale').value;
let tileSize = boardSize / tileCount;

let boardParts = new Object;

let clickLoc = new Object;
clickLoc.x = 0;
clickLoc.y = 0;

let emptyLoc = new Object;
emptyLoc.x = 0;
emptyLoc.y = 0;

let solved = false;

let shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
while (shuffledDeck === undefined) {
    console.log(shuffledDeck);
    shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
}

setBoard();

document.getElementById('scale').onchange = function () {
    $('#levelDis').text(this.value + " ]")
    tileCount = this.value;
    tileSize = boardSize / tileCount;
    shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
    while (shuffledDeck === undefined) {
        console.log(shuffledDeck);
        shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
    }
    setBoard();
    drawTiles();
};

document.getElementById('puzzle').onmousemove = function (e) {
    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
};

document.getElementById('puzzle').onclick = function () {
    if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
        slideTile(emptyLoc, clickLoc);
        drawTiles();
    };
    if (solved) {
        setTimeout(function () { alert("You solved it!"); }, 500);
    };
};

function solvableContent(oneDArr) {
    let filterSolvable = [];
    let returnArr = [];
    let numGrid = 0;
    oneDArr.forEach(elem => {
        returnArr.push(elem);
        filterSolvable.push(elem[0] * tileCount + elem[1]);
    });
    // console.log("returnArr",returnArr);
    // console.log("filterSolvable",filterSolvable);
    let inversions = 0;
    if (tileCount % 2 === 1) {
        for (let k = 0; k < filterSolvable.length - 1; ++k) {
            for (let t = k + 1; t < filterSolvable.length; ++t) {
                if (filterSolvable[k] > filterSolvable[t] && filterSolvable[k] !== Math.pow(tileCount, 2) - 1 && filterSolvable[t] !== Math.pow(tileCount, 2) - 1) {
                    inversions++;
                }
            }
        }
        if (inversions % 2 === 0) {
            console.log("solvable");
            return returnArr;
        } else {
            console.log("un-solvable");
            return undefined;
        }
    } else {
        for (let k = 0; k < filterSolvable.length - 1; ++k) {
            for (let t = k + 1; t < filterSolvable.length; ++t) {
                if (filterSolvable[k] > filterSolvable[t] && filterSolvable[k] !== Math.pow(tileCount, 2) - 1 && filterSolvable[t] !== Math.pow(tileCount, 2) - 1) {
                    inversions++;
                }
            }
        }
        let byUnderNo = parseInt((Math.pow(tileCount, 2) - filterSolvable.indexOf(Math.pow(tileCount, 2) - 1) + 3) / tileCount);
        console.log(byUnderNo)
        if (byUnderNo % 2 === 1 && inversions % 2 === 0) {
            console.log("solvable");
            return returnArr;
        } else if (byUnderNo % 2 === 0 && inversions % 2 === 1) {
            console.log("solvable");
            return returnArr;
        } else {
            console.log("un-solvable");
            return undefined;
        }
    }
}

function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
    if (!solved) {
        boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
        boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
        boardParts[fromLoc.x][fromLoc.y].x = tileCount - 1;
        boardParts[fromLoc.x][fromLoc.y].y = tileCount - 1;
        toLoc.x = fromLoc.x;
        toLoc.y = fromLoc.y;
        checkSolved();
    }
}

function checkSolved() {
    let flag = true;
    let numb = 0;
    for (let i = 0; i < tileCount; ++i) {
        for (let j = 0; j < tileCount; ++j) {
            if (boardParts[i][j].x !== i || boardParts[i][j].y !== j) {
                flag = false;
            };
            numb++;
        }
    }
    solved = flag;
}

function drawTiles() {
    context.clearRect(0, 0, boardSize, boardSize);
    for (let j = 0; j < tileCount; j++) {
        for (let i = 0; i < tileCount; i++) {
            let x = boardParts[i][j].x;
            let y = boardParts[i][j].y;
            if (i !== emptyLoc.x || j !== emptyLoc.y || solved === true) {
                context.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize,
                    i * tileSize, j * tileSize, tileSize, tileSize);
            }
        }
    }
}

function setBoard() {
    let numa = 0;
    let threeLocx = 0;
    let threeLocy = 0;
    boardParts = new Array(tileCount);
    for (let i = 0; i < tileCount; i++) {
        boardParts[i] = new Array(tileCount);
        for (let j = 0; j < tileCount; j++) {
            boardParts[i][j] = new Object;
            boardParts[i][j].x = shuffledDeck[numa][0];
            boardParts[i][j].y = shuffledDeck[numa][1];
            if (shuffledDeck[numa][0] === tileCount - 1 && shuffledDeck[numa][1] === tileCount - 1) {
                emptyLoc.x = i;
                emptyLoc.y = j;
            }
            numa++;
        }
    }
    solved = false;
}

function makeCordArray(tileCount) {
    let randArray = new Array();
    for (let i = 0; i < tileCount; ++i) {
        for (let j = 0; j < tileCount; ++j) {
            randArray.push([i, j]);
        }
    }
    return randArray;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
