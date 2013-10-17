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

GameOver.Build();

function StartGame() {
    GameOver.Hide();
    //get rid of melon elems
    for (i = 0; i < Game.melons.length; i++) {
        Game.melons[i].counterElem.parentNode.removeChild(Game.melons[i].counterElem);
    }
    //empty enemies & melons arrays
    Game.enemies.length = 0;
    Game.melons.length = 0;
    //fill enemies array
    var enemy1 = new Enemy((2 * Game.TILE), (1 * Game.TILE));
    var enemy2 = new Enemy((4 * Game.TILE), (6 * Game.TILE));
    var enemy3 = new Enemy((18 * Game.TILE), (6 * Game.TILE));
    Game.enemies[0] = enemy1;
    Game.enemies[1] = enemy2;
    Game.enemies[2] = enemy3;
    //add inital melon
    var melon = new Melon();
    Game.melons.push(melon);

    Game.melonTimer = 0;
    Player.Init();
    Game.InitMelons();
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
    Game.DrawMelons();
                        
    control.innerHTML = "<font size='24px'>" + Game.score + "</font>";
}

function Processor() {
    
    //Player
    Player.Update();
    
    //Enemy
    Game.UpdateEnemies();
    
    //Melon
    MelonManager();
    Game.UpdateMelons();
    debug.innerHTML = Game.melons.length;
   
    Draw();
    requestTimeout(Processor, (1000 / Game.fps));
}

function MelonManager() {
    var freq = 3;
    Game.melonTimer++;
    
    if (!(Game.melonTimer % (Game.fps * freq))) {
        var newMelon = new Melon();
        newMelon.Init();
        Game.melons.push(newMelon);
        //Game.melons[Game.melons.length - 1].Init();
    }
    if (Game.melonTimer > 1000) {
        Game.melonTimer = 0;
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
    }
}