var c = document.getElementById("Game");
var b = document.getElementById("Background");
var debug = document.getElementById("debug");
var control = document.getElementById("control");
var bg = document.getElementById("bg");
bg.style.width = "720px";
bg.style.height = "480px";
bg.style.backgroundImage = "url('bg.png')";
bg.style.position = "absolute";
control.style.position = "absolute";
control.style.left = "750px";
debug.style.position = "absolute";
debug.style.left = "750px";
debug.style.top = "50px";
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

var left = document.getElementById("left");
left.style.width = "100px";
left.style.height = "100px";
left.style.left = "0px";
left.style.top = "380px";
left.style.border = "solid 9px";
left.style.position = "absolute";

var right = document.getElementById("right");
right.style.width = "100px";
right.style.height = "100px";
right.style.left = "150px";
right.style.top = "380px";
right.style.border = "solid 9px";
right.style.position = "absolute";

var jump = document.getElementById("jump");
jump.style.width = "100px";
jump.style.height = "100px";
jump.style.left = "620px";
jump.style.top = "380px";
jump.style.border = "solid 9px";
jump.style.position = "absolute";

function px(x) {
    return x * 3;
}

function py(y) {
    return y * 3;
}

var map =[
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 8,
];

var enemy1 = new Enemy((2 * 10), (1 * 10));
var enemy2 = new Enemy((4 * 10), (6 * 10));
var enemy3 = new Enemy((18 * 10), (6 * 10));
Game.enemies[0] = enemy1;
Game.enemies[1] = enemy2;
Game.enemies[2] = enemy3;

function StartGame() {
    Player.Init();
    Game.InitEnemies();
}

window.setTimeout(function() {
    StartGame();
    Game.BuildLevel(map);
    Processor();
}, 1000);

function Draw() {
    ctx.clearRect(0,0,720,480);
    
    ctx.drawImage(Player.image,px(Player.x - 8),py(Player.y - 12), 24 * 3, 13 * 3);
    Game.DrawEnemies();
    
    debug.innerHTML = "jumping: " + Player.jumping +
                        "<br>falling: " + Player.falling +
                        "<br>wallgrabbing: " + Player.wallgrabbing +
                        "<br>jump: " + Player.jump;
}

function Processor() {
    
    //Player
    Player.Update();
    
    //Enemy
    Game.UpdateEnemies();
        
    Draw();
    requestAnimationFrame(Processor);
}

document.addEventListener("keydown", function(e) {
    return onkey(e, e.keyCode, true);
}, false);

document.addEventListener("keyup", function(e) {
    return onkey(e, e.keyCode, false);
}, false);

left.addEventListener("touchstart", function(e) {
    return ontouch("left", true);
}, false);

left.addEventListener("touchend", function(e) {
    return ontouch("left", false);
}, false);

right.addEventListener("touchstart", function(e) {
    return ontouch("right", true);
}, false);

right.addEventListener("touchend", function(e) {
    return ontouch("right", false);
}, false);

jump.addEventListener("touchstart", function(e) {
    return ontouch("jump", true);
}, false);

jump.addEventListener("touchend", function(e) {
    return ontouch("jummp", true);
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

function ontouch(key, down) {
    switch(key) {
        case "left": //left
            Player.left = down;
            break;
        case "right": //right
            Player.right = down;
            break;
        case "jump": //x
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