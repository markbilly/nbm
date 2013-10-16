var c = document.getElementById("Game");
var b = document.getElementById("Background");
var debug = document.getElementById("debug");
var control = document.getElementById("control");
var bg = document.getElementById("bg");
var container = document.getElementById("container");
c.width = px(288); //px
c.height = py(192); //px
c.style.left = 0 + "px";
c.style.top = 0 + "px";
c.style.padding = 0;
c.style.margin = 0 + "px";
b.width = px(288); //px
b.height = py(192); //px
b.style.left = 0 + "px";
b.style.top = 0 + "px";
b.style.padding = 0;
b.style.margin = 0 + "px";
container.style.fontSize = px(8) + "px";
bg.style.width = px(288) + "px";
bg.style.height = py(192) + "px";
bg.style.left = 0 + "px";
bg.style.top = 0 + "px";
bg.style.backgroundImage = "url('bg.png')";
bg.style.position = "absolute";
control.style.position = "absolute";
control.style.left = px(140) + "px";
control.style.top = px(3) + "px";
debug.style.position = "absolute";
debug.style.left = "900px";
debug.style.top = "200px";
var ctx = c.getContext("2d");
var ctx_b = b.getContext("2d");
var tile = new Image();
tile.src = "tile.png";
var tile_floor1 = new Image();
tile_floor1.src = "floor1.png";
var tile_floor2 = new Image();
tile_floor2.src = "floor2.png";
var tile_vert1 = new Image();
tile_vert1.src = "vert1.png";

function px(x) {
    return x * 3;
}

function py(y) {
    return y * 3;
}

var map =[
    4, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 9, 9, 9, 9, 9, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 4, 8,
    4, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 9, 0, 0, 0, 0, 9, 9, 0, 4, 0, 0, 0, 0, 9, 0, 0, 0, 9, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 8,
];
    
function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;    
}

var melon = new Melon();
GameOver.Build();

function StartGame() {
    GameOver.Hide();
    //empty enemies array
    Game.enemies.length = 0;
    //fill enemies array
    var enemy1 = new Enemy((2 * Game.TILE), (1 * Game.TILE));
    var enemy2 = new Enemy((4 * Game.TILE), (6 * Game.TILE));
    var enemy3 = new Enemy((18 * Game.TILE), (6 * Game.TILE));
    Game.enemies[0] = enemy1;
    Game.enemies[1] = enemy2;
    Game.enemies[2] = enemy3;

    Player.Init();
    melon.Init();
    Game.InitEnemies();
    Game.score = 0;
    
    Game.width = Game.MAP.tw * Game.TILE;
    Game.height = Game.MAP.th * Game.TILE;
}

window.setTimeout(function() {
    FirstTimeStart();
}, 1000);

//Resources.Load(FirstTimeStart);

function FirstTimeStart() {
    StartGame();
    Game.BuildLevel(map);
    Processor();
}

function Draw() {
    ctx.clearRect(0,0,px(Game.width),py(Game.height));
    
    ctx.drawImage(Player.image,px(Player.x - 6),py(Player.y - Game.TILE), px(24), py(13));
    Game.DrawEnemies();
    ctx.drawImage(melon.image,px(melon.x + 5 - 50),py(melon.y - 5 - 50), px(100), py(100));
    //ctx.strokeStyle = 'red';
    //ctx.strokeRect(px(melon.BoundingBox.x),
    //             py(melon.BoundingBox.y),
    //             px(melon.BoundingBox.width),
    //             py(melon.BoundingBox.height));
    
    if (melon.state === "countdown") {
        melon.counterElem.innerHTML = melon.counter;
    }
    else {
        melon.counterElem.innerHTML = "";
    }
    
    //debug.innerHTML = "jumping: " + Player.jumping +
    //                    "<br>falling: " + Player.falling +
    //                    "<br>wallgrabbing: " + Player.wallgrabbing +
    //                    "<br>jump: " + Player.jump;
                        
    control.innerHTML = /*"melon: " + melon.state +
                        "<br>counter: " + melon.counter +
                        "<br>counterX: " + melon.counterElem.style.left + 
                        "<br>counterY: " + melon.counterElem.style.top +*/
                        "<font size='24px'>" + Game.score + "</font>";
    //requestAnimFrame(Draw);
}

function Processor() {
    
    //Player
    Player.Update();
    
    //Enemy
    Game.UpdateEnemies();
    
    //Melon
    melon.Update();
   
    Draw();
    requestTimeout(Processor, (1000 / Game.fps));
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
    }
}