var c = document.getElementById("Game");
var b = document.getElementById("Background");
var debug = document.getElementById("debug");
var control = document.getElementById("control");
var bg = document.getElementById("bg");
bg.style.width = "864px";
bg.style.height = "576px";
bg.style.backgroundImage = "url('bg.png')";
bg.style.position = "absolute";
control.style.position = "absolute";
control.style.left = "900px";
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
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 8,
];

var enemy1 = new Enemy((2 * Game.TILE), (1 * Game.TILE));
var enemy2 = new Enemy((4 * Game.TILE), (6 * Game.TILE));
var enemy3 = new Enemy((18 * Game.TILE), (6 * Game.TILE));
Game.enemies[0] = enemy1;
Game.enemies[1] = enemy2;
Game.enemies[2] = enemy3;
var melon = new Melon();

function StartGame() {
    Player.Init();
    melon.Init();
    Game.InitEnemies();
    Game.score = 0;
    
    Game.width = Game.MAP.tw * Game.TILE;
    Game.height = Game.MAP.th * Game.TILE;
}

window.setTimeout(function() {
    StartGame();
    Game.BuildLevel(map);
    Processor();
}, 1000);

function Draw() {
    ctx.clearRect(0,0,px(Game.width),py(Game.height));
    
    ctx.drawImage(Player.image,px(Player.x - 6),py(Player.y - Game.TILE), 24 * 3, 13 * 3);
    Game.DrawEnemies();
    ctx.drawImage(melon.image,px(melon.x + 5 - 50),py(melon.y - 5 - 50), px(100), py(100));
    
    ////draw circle damage
    //var centerX = px(melon.x - (Game.TILE / 2));
    //var centerY = py(melon.y - (Game.TILE / 2));
    //var radius = px(melon.radius);
    //ctx.beginPath();
    //ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'black';
    //ctx.fill();
    ////end circle
    
    if (melon.state === "countdown") {
        melon.counterElem.innerHTML = melon.counter;
    }
    else {
        melon.counterElem.innerHTML = "";
    }
    
    debug.innerHTML = "jumping: " + Player.jumping +
                        "<br>falling: " + Player.falling +
                        "<br>wallgrabbing: " + Player.wallgrabbing +
                        "<br>jump: " + Player.jump;
                        
    control.innerHTML = "melon: " + melon.state +
                        "<br>counter: " + melon.counter +
                        "<br>counterX: " + melon.counterElem.style.left + 
                        "<br>counterY: " + melon.counterElem.style.top +
                        "<br><font size='100px'>" + Game.score + "</font>";
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
            }
            else {
                Player.jump = down;
            }
            break;
    }
}