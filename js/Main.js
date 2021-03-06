var c = document.getElementById("Game");
var b = document.getElementById("Background");
var overlay = document.getElementById("Overlay");
var buttonsCanvas = document.getElementById("Buttons");
var debug = document.getElementById("debug");
var bg = document.getElementById("bg");
var container = document.getElementById("container");

var ctx = c.getContext("2d");
var ctx_b = b.getContext("2d");
var ctx_buttons = buttonsCanvas.getContext("2d");
var ctx_overlay = overlay.getContext("2d");
var ctx_bg = bg.getContext("2d");
var tile = new Image();
tile.src = "tile.png";
var tile_factory = new Image();
tile_factory.src = "tile_factory.png";
var tile_floor1 = new Image();
tile_floor1.src = "floor1.png";
var tile_floor2 = new Image();
tile_floor2.src = "floor2.png";
var tile_vert1 = new Image();
tile_vert1.src = "vert1.png";
var vert_factory = new Image();
vert_factory.src = "vert_factory.png";
var underwater = new Image();
underwater.src = "tile_underwater.png";
var pillar_underwater = new Image();
pillar_underwater.src = "pillar_underwater.png";
var tile_ground1 = new Image();
tile_ground1.src = "ground2.png";
var tile_ground2 = new Image();
tile_ground2.src = "ground3.png";
var underground_topleft = new Image();
underground_topleft.src = "underground_topleft.png";
var underground_topright = new Image();
underground_topright.src = "underground_topright.png";
var underground_bottomright = new Image();
underground_bottomright.src = "underground_bottomright.png";
var underground_bottomleft = new Image();
underground_bottomleft.src = "underground_bottomleft.png";
var underground_left = new Image();
underground_left.src = "underground_left.png";
var underground_right = new Image();
underground_right.src = "underground_right.png";
var underground_inside_topright = new Image();
underground_inside_topright.src = "underground_inside_topright.png";
var underground_inside_topleft = new Image();
underground_inside_topleft.src = "underground_inside_topleft.png";
var underground_inside_bottomleft = new Image();
underground_inside_bottomleft.src = "underground_inside_bottomleft.png";
var underground_inside_bottomright = new Image();
underground_inside_bottomright.src = "underground_inside_bottomright.png";

function px(x) {
    return x * Game.scale;
}

function py(y) {
    return y * Game.scale;
}
    
function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;    
}

function StartGame() {
    GameOver.Hide();
    Paused.Hide();
    //draw bg
    ctx_bg.drawImage(Game.level.bg, 0, 0, px(Game.width), py(Game.height));
    //restore tiles that contain "alive" melons to "9" so we can spawn more
    Game.RestoreAllMelonTiles();
    //empty enemies & melons arrays
    Game.enemies.length = 0;
    Game.melons.length = 0;
    Game.previousMelonY = 0;
    //fill enemies array
    for (var i = 0; i < Game.level.enemies.length; i++) {
        Game.enemies[i] = Game.level.enemies[i];
    }
    //add inital melon
    var melon = new Melon();
    Game.melons.push(melon);

    Game.melonTimer = 0;
    if (Game.level.name === "underground") {
        Player.y = 4 * Game.TILE;
        Player.yInit = 4 * Game.TILE;
    }
    else {
        Player.y = 140;
        Player.yInit = 140;
    }
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
    Resize();
    Game.level = Game.levels[0];
    Menu.Show();
    debug.innerHTML = "";
}, 5000);

function Refresh() {
    ctx_bg.drawImage(Game.level.bg, 0, 0, px(Game.width), py(Game.height));
    Game.BuildLevel(Game.level.map);
}

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
        if (scaleFactor > 4) {
            scaleFactor = 4;
        }
    }
    
    container.style.width = Game.width * scaleFactor + "px";
    container.style.height = Game.height * scaleFactor + "px";
    
    Game.scale = scaleFactor;
    
    var left = (windowWidth / 2) - ((Game.width * scaleFactor) / 2);
    var top = (windowHeight / 2) - ((Game.height * scaleFactor) / 2)
    
    c.width = px(Game.width); //px
    c.height = py(Game.height); //px
    c.style.left = left + "px";
    c.style.top = top + "px";
    c.style.padding = 0;
    c.style.margin = 0 + "px";
    b.width = px(Game.width); //px
    b.height = py(Game.height); //px
    b.style.left = left + "px";
    b.style.top = top + "px";
    b.style.padding = 0;
    b.style.margin = 0 + "px";
    buttonsCanvas.width = px(Game.width); //px
    buttonsCanvas.height = py(Game.height); //px
    buttonsCanvas.style.left = left + "px";
    buttonsCanvas.style.top = top + "px";
    buttonsCanvas.style.padding = 0;
    buttonsCanvas.style.margin = 0 + "px";
    overlay.width = px(Game.width); //px
    overlay.height = py(Game.height); //px
    overlay.style.left = left + "px";
    overlay.style.top = top + "px";
    overlay.style.padding = 0;
    overlay.style.margin = 0 + "px";
    container.style.fontSize = px(8) + "px";
    bg.width = px(Game.width); //px
    bg.height = py(Game.height); //px
    bg.style.left = left + "px";
    bg.style.top = top + "px";
    bg.style.padding = 0;
    bg.style.margin = 0 + "px";
    debug.style.position = "absolute";
    debug.style.left = "900px";
    debug.style.top = "200px";
}

function FirstTimeStart() {
    Menu.Hide();
    StartGame();
    Game.BuildLevel(Game.level.map);
    if (!Game.processing) Processor();
    Draw();
}

function Draw() {
    
    if (!Game.paused && !Game.inMenu) {
        ctx.clearRect(0,0,px(Game.width),py(Game.height));
        if (!Player.dead) ctx_overlay.clearRect(0,0,px(Game.width),py(Game.height));
        
        ctx.drawImage(Player.image,px(Player.x - 6),py(Player.y - Game.TILE), px(24), py(12));
        Game.DrawEnemies();
        Game.DrawMelons();
        
        ctx_overlay.font="" + px(8 * 2) + "px pixel";
        ctx_overlay.fillStyle = "black";
        ctx_overlay.fillText
        (
            "" + Game.score + "",
            px(Game.width - 5) / 2,
            py(Game.TILE * 2)
        );
    }
    requestTimeout(Draw, (1000 / 60));
}

function Processor() {
    
    Game.processing = true;
    
    if (!Game.paused && !Game.inMenu) {
        //Player
        Player.Update();
        
        //Enemy
        if (Game.level.name === "factory") {
            EnemyManager();
        }
        Game.UpdateEnemies();
        
        //Melon
        MelonManager();
        Game.UpdateMelons();
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

function EnemyManager() {
    var freq = 2;
    
    Game.enemyTimer++;
    
    if (!(Game.enemyTimer % (Game.fps * freq))) {
        Spawn();
    }
    if (Game.enemyTimer > 1000) {
        Game.enemyTimer = 0;
    }
    
    function Spawn() {
        var newEnemy1 = new Enemy((11 * Game.TILE), (1 * Game.TILE));
        var newEnemy2 = new Enemy((21 * Game.TILE), (1 * Game.TILE));
        newEnemy1.Init();
        newEnemy2.Init();
        Game.enemies.push(newEnemy1);
        Game.enemies.push(newEnemy2);
    }
}

document.addEventListener("keydown", function(e) {
    return onkey(e, e.keyCode, true);
}, false);

document.addEventListener("keyup", function(e) {
    return onkey(e, e.keyCode, false);
}, false);

window.onresize = function(e) {
    Resize();
    if (Game.inMenu) {
        Menu.Show();
    }
    else {
        Refresh();
    }
};

function onkey(e, key, down) {
    switch(key) {
        case 37: //left
            if (Game.inMenu) {
                if (!down) {
                    switch(Game.level.name) {
                        case "factory":
                            Game.level = Game.levels[0];
                            break;
                        case "underground":
                            Game.level = Game.levels[1];
                            break;
                        case "academy":
                            Game.level = Game.levels[2];
                            break;
                        default:
                            break;
                    }
                    Menu.Show();
                }
            }
            else {
                Player.left = down;
            }
            break;
        case 39: //right
            if (Game.inMenu) {
                if (!down) {
                    switch(Game.level.name) {
                        case "underground":
                            Game.level = Game.levels[0];
                            break;
                        case "academy":
                            Game.level = Game.levels[1];
                            break;
                        case "factory":
                            Game.level = Game.levels[2];
                            break;
                        default:
                            break;
                    }
                    Menu.Show();
                }
            }
            else {
                Player.right = down;
            }
            break;
        case 88: //x
            if (Game.inMenu) {
                FirstTimeStart();
            }
            else {
                if (Player.dead) {
                    StartGame();
                    Player.dead = false;
                    Player.jump = false;
                }
                else {
                    Player.jump = down;
                }
            }
            break;
        case 80: //p
            if (!down && !Game.inMenu && !Player.dead) {
                if (!Game.paused) {
                    Game.paused = true;
                    Paused.Show();
                }
                else {
                    Game.paused = false;
                    Paused.Hide();
                }
            }
            break;
        case 27: //escape
            if (!Game.inMenu) {
                Menu.Show();
                debug.innerHTML = "";
            }
            
    }
}

//LEVELS

var mapAcademy = [
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

var mapFactory = [
    4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 4, 8,
    4, 0, 0, 9, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 9, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 4, 8,
    4, 0, 0, 0, 0, 9, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4, 8,
    4, 0, 0, 4, 1, 1, 1, 1, 1, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 9, 0, 9, 0, 9, 0, 9, 0, 1, 1, 1, 1, 1, 1, 0, 9, 0, 0, 0, 0, 9, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 8,
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 4, 8,
];

var mapUnderwater = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0, 8,
    0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 8,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 8,
    0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 4, 0, 0, 8,
    0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4, 4, 0, 0, 8,
    0, 0, 0, 4, 0, 9, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4, 4, 0, 0, 8,
    0, 0, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4, 4, 0, 0, 8,
    0, 0, 9, 4, 0, 0, 0, 0, 4, 0, 4, 9, 0, 9, 0, 4, 0, 4, 0, 0, 4, 4, 9, 0, 8,
    0, 0, 0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4, 4, 0, 0, 8,
    0, 0, 0, 4, 0, 4, 0, 0, 4, 0, 4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 4, 4, 0, 0, 8,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8,
];

var mapUnderground = [
    3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,12,13, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5,12, 9, 9, 0, 9, 0,13,10, 5, 5, 7, 9, 0,10, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5,14, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 0, 0, 9, 0, 9,13, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,15, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 5, 0, 0, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 8,
    5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 6, 5, 5, 5, 5,12, 0, 9,13, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 5, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0,15, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 7, 0, 0,10, 5, 5, 5, 5, 5, 5, 7, 0, 0,11, 5, 5, 5, 5, 5, 8,
    5,12, 0, 9, 0, 9, 0, 0, 0, 9, 0, 0, 0, 9, 0, 9, 0, 0, 0, 9, 0, 9,13, 5, 8,
    5,14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,15, 5, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0, 0,11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 0, 9, 0, 9,13, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,14, 0, 0, 0,15, 5, 5, 5, 5, 5, 5, 5, 5, 8,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8,
];

var bgAcademy = new Image();
bgAcademy.src = "bg.png";

var bgFactory = new Image();
bgFactory.src = "bg_factory.png";

var bgUnderwater = new Image();
bgUnderwater.src = "bg_underwater.png";

var bgUnderground = new Image();
bgUnderground.src = "bg_underground.png";

var Academy = new Level(
    "academy",
    mapAcademy,
    true,
    [
        new Enemy((2 * Game.TILE), (2 * Game.TILE)),
        new Enemy((4 * Game.TILE), (8 * Game.TILE)),
        new Enemy((16 * Game.TILE), (4 * Game.TILE)),
        new Enemy((10 * Game.TILE), (12 * Game.TILE))
    ],
    bgAcademy
);
var Factory = new Level(
    "factory",
    mapFactory,
    true,
    [
        new Enemy((11 * Game.TILE), (1 * Game.TILE)),
        new Enemy((21 * Game.TILE), (1 * Game.TILE))
    ],
    bgFactory
);
var Underground = new Level(
    "underground",
    mapUnderground,
    true,
    [
        new Enemy((5 * Game.TILE), (10 * Game.TILE)),
        new Enemy((15 * Game.TILE), (10 * Game.TILE)),
        new Enemy((16 * Game.TILE), (5 * Game.TILE))
    ],
    bgUnderground
);

Game.levels = [Academy, Factory, Underground];

//END OF LEVELS