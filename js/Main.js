var c = document.getElementById("Game");
var b = document.getElementById("Background");
var buttonsCanvas = document.getElementById("Buttons");
var debug = document.getElementById("debug");
var bg = document.getElementById("bg");
var container = document.getElementById("container");

var ctx = c.getContext("2d");
var ctx_b = b.getContext("2d");
var ctx_buttons = buttonsCanvas.getContext("2d");
var tile = new Image();
tile.src = "tile.png";
var tile_floor1 = new Image();
tile_floor1.src = "floor1.png";
var tile_floor2 = new Image();
tile_floor2.src = "floor2.png";
var tile_vert1 = new Image();
tile_vert1.src = "vert1.png";
var tile_ground1 = new Image();
tile_ground1.src = "ground2.png";
var tile_ground2 = new Image();
tile_ground2.src = "ground3.png";

function px(x) {
    return x * Game.scale;
}

function py(y) {
    return y * Game.scale;
}

var map =[
    4, 9, 0, 9, 0, 9, 0, 9, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 4, 0, 0, 9, 0, 9, 0, 9, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 9, 0, 9, 0, 9, 0, 0, 0, 0, 0, 4, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 4, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 8,
];
    
function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;    
}

function StartGame() {
    GameOver.Hide();
    Paused.Hide();
    //restore tiles that contain "alive" melons to "9" so we can spawn more
    Game.RestoreAllMelonTiles();
    //empty enemies & melons arrays
    Game.enemies.length = 0;
    Game.melons.length = 0;
    Game.previousMelonY = 0;
    //fill enemies array
    var enemy1 = new Enemy((2 * Game.TILE), (2 * Game.TILE));
    var enemy2 = new Enemy((4 * Game.TILE), (8 * Game.TILE));
    var enemy3 = new Enemy((16 * Game.TILE), (4 * Game.TILE));
    var enemy4 = new Enemy((10 * Game.TILE), (12 * Game.TILE));
    Game.enemies[0] = enemy1;
    Game.enemies[1] = enemy2;
    Game.enemies[2] = enemy3;
    Game.enemies[3] = enemy4;
    //add inital melon
    var melon = new Melon();
    Game.melons.push(melon);

    Game.melonTimer = 0;
    Player.Init();
    Game.InitMelons();
    Game.InitEnemies();
    Game.score = 0;
}

Resources.Assign();
Game.width = Game.MAP.tw * Game.TILE;
Game.height = Game.MAP.th * Game.TILE;
debug.innerHTML = "LOADING...";

window.setTimeout(function() {
    FirstTimeStart();
}, 5000);

function Resize() {
    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        containerWidth = Game.MAP.tw * Game.TILE,
        containerHeight = Game.MAP.th * Game.TILE,
        ratio = Game.MAP.tw / Game.MAP.th,
        //scaleFactor = (windowWidth / containerWidth);
        scaleFactor = (windowHeight / containerHeight);
    
    //limit the scale to 4 times
    if (!("ontouchstart" in document)) {
        if (scaleFactor > 3) {
            scaleFactor = 3;
        }
    }
    
    container.style.width = Game.width * scaleFactor + "px";
    container.style.height = Game.height * scaleFactor + "px";
    
    Game.scale = scaleFactor;
    
    c.width = px(Game.width); //px
    c.height = py(Game.height); //px
    c.style.left = 0 + "px";
    c.style.top = 0 + "px";
    c.style.padding = 0;
    c.style.margin = 0 + "px";
    b.width = px(Game.width); //px
    b.height = py(Game.height); //px
    b.style.left = 0 + "px";
    b.style.top = 0 + "px";
    b.style.padding = 0;
    b.style.margin = 0 + "px";
    buttonsCanvas.width = px(Game.width); //px
    buttonsCanvas.height = py(Game.height); //px
    buttonsCanvas.style.left = 0 + "px";
    buttonsCanvas.style.top = 0 + "px";
    buttonsCanvas.style.padding = 0;
    buttonsCanvas.style.margin = 0 + "px";
    container.style.fontSize = px(8) + "px";
    bg.style.width = px(Game.width) + "px";
    bg.style.height = py(Game.height) + "px";
    bg.style.left = 0 + "px";
    bg.style.top = 0 + "px";
    bg.style.backgroundImage = "url('bg.png')";
    bg.style.position = "absolute";
    debug.style.position = "absolute";
    debug.style.left = "900px";
    debug.style.top = "200px";
    
    Game.leftButton.y = Game.height - Game.leftButton.height;
    Game.rightButton.y = Game.height - Game.rightButton.height;
    Game.upButton.y = Game.height - Game.upButton.height;
    Game.upButton.x = Game.width - Game.upButton.width;
}

function FirstTimeStart() {
    Resize();
    StartGame();
    Game.BuildLevel(map);
    Processor();
    GameOver.Build();
    Paused.Build();
    debug.innerHTML = "";
    
    if ("ontouchstart" in document) {
        DrawButtons();
    }
}

function DrawButtons() {
    
    ctx_buttons.drawImage
    (
        Resources.leftButton,
        px(Game.leftButton.x),
        py(Game.leftButton.y),
        px(Game.leftButton.width),
        py(Game.leftButton.height)
    );
    ctx_buttons.drawImage
    (
        Resources.rightButton,
        px(Game.rightButton.x),
        py(Game.rightButton.y),
        px(Game.rightButton.width),
        py(Game.rightButton.height)
    );
    ctx_buttons.drawImage
    (
        Resources.upButton,
        px(Game.upButton.x),
        py(Game.upButton.y),
        px(Game.upButton.width),
        py(Game.upButton.height)
    );
}

function Draw() {
    ctx.clearRect(0,0,px(Game.width),py(Game.height));
    
    ctx.drawImage(Player.image,px(Player.x - 6),py(Player.y - Game.TILE), px(24), py(12));
    Game.DrawEnemies();
    Game.DrawMelons();
    
    ctx.font="" + px(8) + "px pixel";
    ctx.fillStyle = "black";
    ctx.fillText
    (
        "" + Game.score + "",
        px(Game.width) / 2,
        py(Game.TILE)
    );
}

function Processor() {
    
    if (!Game.paused) {
        //Player
        Player.Update();
        
        //Enemy
        Game.UpdateEnemies();
        
        //Melon
        MelonManager();
        Game.UpdateMelons();
       
        Draw();
    }
    requestTimeout(Processor, (1000 / Game.fps));
}

function MelonManager() {
    var freq = 2,
        number = 1; //RandomInt(min, max);
    
    Game.melonTimer++;
    
    if (!(Game.melonTimer % (Game.fps * freq))) {
        SpawnMelons(number);
    }
    if (Game.melonTimer > 1000) {
        Game.melonTimer = 0;
    }
    
    function SpawnMelons(amount) {
        for (var i = 0; i < amount; i++) {
            var newMelon = new Melon();
            newMelon.Init();
            Game.melons.push(newMelon);
        }
    }
}

document.addEventListener("keydown", function(e) {
    return onkey(e, e.keyCode, true);
}, false);

document.addEventListener("keyup", function(e) {
    return onkey(e, e.keyCode, false);
}, false);

function onkey(e, key, down) {
    switch(key) {
        case 37: //left
            Player.left = down;
            break;
        case 39: //right
            Player.right = down;
            break;
        case 88: //x
            if (Player.dead) {
                StartGame();
                Player.dead = false;
                Player.jump = false;
            }
            else {
                Player.jump = down;
            }
            break;
        case 80: //p
            if (!down) {
                if (!Game.paused) {
                    Game.paused = true;
                    Paused.Show();
                }
                else {
                    Game.paused = false;
                    Paused.Hide();
                }
            }
    }
}

//touch events
document.addEventListener("touchstart", function(e) {
    e.preventDefault();
    var touch = e.changedTouches[0];
    return ontouch(e, touch, true);
}, false);

document.addEventListener("touchend", function(e) {
    e.preventDefault();
    var touch = e.changedTouches[0];
    return ontouch(e, touch, false);
}, false);

function ontouch(e, key, down) {
    var x = key.pageX,
        leftStart = px(Game.leftButton.x),
        leftEnd = leftStart + px(Game.leftButton.width),
        rightStart = px(Game.rightButton.x),
        rightEnd = rightStart + px(Game.rightButton.width)
        jumpStart = px(Game.upButton.x),
        jumpEnd = jumpStart + px(Game.upButton.width);
    
    if (x >= leftStart && x <= leftEnd) {
        Player.left = down;
        Player.right = !down;
    }
    else if (x >= rightStart && x <= rightEnd) {
        Player.right = down;
        Player.left = !down;
    }
    else if (x >= jumpStart && x <= jumpEnd) {
        if (Player.dead) {
            StartGame();
            Player.dead = false;
            Player.jump = false;
        }
        else {
            Player.jump = down;
        }
    }
}