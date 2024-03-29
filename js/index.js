$(document).ready(function () {
    $("*").dblclick(function (e) {
        e.preventDefault();
    });
});

let maxW = 0;
let maxH = 0;

let context = document.getElementById("puzzle").getContext("2d");
let img = new Image();
let croppr;

if (window.innerWidth <= 600) {
    $('#puzzle').attr('width', `${window.innerWidth * 0.8}px`);
    $('#puzzle').attr('height', `${window.innerWidth * 0.8}px`);
    maxW = window.innerWidth * 0.8;
    maxH = window.innerHeight * 0.8;
} else {
    $('#puzzle').attr('width', '480px');
    $('#puzzle').attr('height', '480px');
    maxW = 480;
    maxH = 480;
}
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
    shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
}

setBoard();

// ==========================================================

let input = document.getElementById('formFile');
input.addEventListener('change', handleFiles);

function handleFiles(e) {
    e.preventDefault();
    $('.card').hide();
    let modal_img = document.getElementById('cropper');
    modal_img.src = URL.createObjectURL(e.target.files[0]);
    $('#cropper').on('load', function () {
        $('.modal').css('max-height', `${$(this).height()}px`);
        $('.modal').css('height', `${$(this).height()}px`);
        croppr = new Croppr('#cropper', {
            aspectRatio: 1,
            minSize: [$(this).width(), $(this).width(), 'px'],
        });
    });
    $('.modal').show();
    $('.submitImg').show();
}

function submitImg() {
    $('.fa-spinner').show();
    let thumb = new Image;
    let cropRect = croppr.getValue();
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    canvas.width = cropRect.width;
    canvas.height = cropRect.height;
    context.drawImage(
        croppr.imageEl,
        cropRect.x,
        cropRect.y,
        cropRect.width,
        cropRect.height,
        0,
        0,
        canvas.width,
        canvas.height,
    );
    thumb.src = canvas.toDataURL();
    // =================================
    thumb.onload = function () {
        let iw = thumb.width;
        let scale = (maxW / iw);
        img.src = downScaleImage(thumb, scale).toDataURL();
        img.addEventListener('load', drawTiles, false);

        $('#preview').attr('src', canvas.toDataURL());
        $('#preview').attr('width', `${window.innerWidth * 0.8}px`);
        $('#preview').attr('height', `${window.innerWidth * 0.8}px`);

        $('.submitImg').hide();
        $('.modal').hide();

        $('.main-puzzle').show();
    }

}

document.getElementById('scale').onchange = function () {
    $('#levelDis').text(this.value + " ]");
    tileCount = this.value;
    tileSize = boardSize / tileCount;
    shuffledDeck = solvableContent(shuffle(makeCordArray(tileCount)));
    while (shuffledDeck === undefined) {
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
        setTimeout(function () { alert("성공!"); }, 500);
    };
};

function solvableContent(oneDArr) {
    let filterSolvable = [];
    let returnArr = [];
    oneDArr.forEach(elem => {
        returnArr.push(elem);
        filterSolvable.push(elem[0] * tileCount + elem[1]);
    });
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
    for (let i = 0; i < tileCount; ++i) {
        for (let j = 0; j < tileCount; ++j) {
            if (boardParts[i][j].x !== i || boardParts[i][j].y !== j) {
                flag = false;
            };
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

function downScaleImage(img, scale) {
    var imgCV = document.createElement('canvas');
    imgCV.width = img.width;
    imgCV.height = img.height;
    var imgCtx = imgCV.getContext('2d');
    imgCtx.drawImage(img, 0, 0);
    return downScaleCanvas(imgCV, scale);
}

function downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale;
    var sw = cv.width; 
    var sh = cv.height; 
    var tw = Math.floor(sw * scale); 
    var th = Math.floor(sh * scale);
    var sx = 0, sy = 0, sIndex = 0; 
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0;
    var tX = 0, tY = 0;
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0;
    var crossX = false;
    var crossY = false;
    var sBuffer = cv.getContext('2d').
    getImageData(0, 0, sw, sh).data;
    var tBuffer = new Float32Array(3 * tw * th);
    var sR = 0, sG = 0,  sB = 0;

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; 
        tY = 0 | ty;
        yIndex = 3 * tY * tw; 
        crossY = (tY != (0 | ty + scale)); 
        if (crossY) {
            wy = (tY + 1 - ty);
            nwy = (ty + scale - tY - 1);
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale;
            tX = 0 |  tx;
            tIndex = yIndex + tX * 3;
            crossX = (tX != (0 | tx + scale));
            if (crossX) {
                wx = (tX + 1 - tx);
                nwx = (tx + scale - tX - 1);
            }
            sR = sBuffer[sIndex    ];
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            if (!crossX && !crossY) {
                tBuffer[tIndex    ] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) {
                w = wx * scale;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) {
                w = wy * scale;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else {
                w = wx * wy;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        }
    }

    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
}

// image scaling high-quality | https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
// image scaling | https://stackoverflow.com/questions/36112458/scaling-image-from-inputtype-file
// on image | https://stackoverflow.com/questions/3814231/loading-an-image-to-a-img-from-input-file