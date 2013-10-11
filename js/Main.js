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

Player.Init();
var enemy1 = new Enemy((2 * 10), (1 * 10));
var enemy2 = new Enemy((4 * 10), (6 * 10));
var enemy3 = new Enemy((18 * 10), (6 * 10));

Game.enemies[0] = enemy1;
Game.enemies[1] = enemy2;
Game.enemies[2] = enemy3;

Game.InitEnemies();

window.setTimeout(function() {
    Game.BuildLevel(map);
    Processor();
}, 1000);

function Draw() {
    
    ctx.drawImage(Player.image,px(Player.x - 8),py(Player.y - 12), 24 * 3, 13 * 3);
    Game.DrawEnemies();
    
    debug.innerHTML = "jumping: " + Player.jumping +
                        "<br>falling: " + Player.falling +
                        "<br>wallgrabbing: " + Player.wallgrabbing +
                        "<br>jump: " + Player.jump;
}

function Processor() {
    ctx.clearRect(0,0,720,480);
    
    //Enemy
    Game.UpdateEnemies();
    
    //Player
    Player.Update();
    
    Draw();
    requestAnimationFrame(Processor);
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
	    Player.jump = down;
	    break;
    }
}