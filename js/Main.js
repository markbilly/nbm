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
Player.image.onload = function() {
    Processor();
}

tile.onload = function() {
    BuildLevel(map);
}

function BuildLevel(level) {
    var y = 0;
    var x = 0;
    var tileImage = tile;
    
    for (i = 0; i < level.length; i++) {
        //draw tile
        if (level[i] === 0) {
            //do nothing
        }
        else {
            if (level[i] === 1) {
                tileImage = tile;
            }
            else if (level[i] === 2) {
                tileImage = tile_floor1;
            }
            else if (level[i] === 3) {
                tileImage = tile_floor2;
            }
            else if (level[i] === 4) {
                tileImage = tile_vert1;
            }
            ctx_b.drawImage(tileImage,x,y,px(Game.TILE),py(Game.TILE));
        }
        
        //get next draw location
        if (level[i] !== 8) {
            x += px(Game.TILE);
        }
        else {
            x = 0;
            y += py(Game.TILE);            
        }
    }
}
    
function t2p(t) {
    return t * Game.TILE;
}

function p2t(p) {
    return Math.floor(p/Game.TILE);
}
    
function cell(x, y) {
    return tcell(p2t(x),p2t(y));
}

function tcell(tx, ty) {
    var out = 0;
    
    out = tx;
    out += (ty - 1) * (Game.MAP.tw + 1);
    
    control.innerHTML = "player @ (" + tx + ", " + ty + ")<br>tile location: " + out;
    
    return map[out];
}

function Draw() {
    ctx.drawImage(Player.image,px(Player.x - 8),py(Player.y - 12), 24 * 3, 13 * 3);

    debug.innerHTML = "jumping: " + Player.jumping +
                        "<br>falling: " + Player.falling +
                        "<br>wallgrabbing: " + Player.wallgrabbing;
}

function Processor() {
    ctx.clearRect(0,0,720,480);

    var wasleft  = Player.dx < 0,
	wasright = Player.dx > 0,
	falling  = Player.falling;

    Player.ddx = 0;
    Player.ddy = Game.GRAVITY;

    if ((Player.right || Player.left) && Player.wallgrabbing) {
    }
    
    if (Player.left && !Player.wallgrabbing) {
        Player.ddx = Player.ddx - Player.ACCEL;     // player wants to go left
    }
    else if (wasleft) {
	Player.ddx = Player.ddx + Player.FRICTION;  // player was going left, but not any more
        Player.wallgrabbing = false;
    }

    if (Player.right && !Player.wallgrabbing) {
        Player.ddx = Player.ddx + Player.ACCEL;     // player wants to go right
    }
    else if (wasright) {
	Player.ddx = Player.ddx - Player.FRICTION;  // player was going right, but not any more
        Player.wallgrabbing = false;
    }

    if (Player.jump && !Player.jumping && !falling) {
	Player.ddy = Player.ddy - Player.JUMP;     // apply an instantaneous (large) vertical impulse
	Player.jumping = true;
        Player.wallgrabbing = false;
    }

    Player.y  = Math.floor(Player.y  + (Game.dt * Player.dy));
    Player.x  = Math.floor(Player.x  + (Game.dt * Player.dx));
    Player.dx = Math.floor(Player.dx + (Game.dt * Player.ddx));
    Player.dy = Math.floor(Player.dy + (Game.dt * Player.ddy));

    if (Player.dx > Player.MAXDX) {
	Player.dx = Player.MAXDX;
    }
    else if (Player.dx < -Player.MAXDX) {
	Player.dx = -Player.MAXDX;
    }

    if (Player.dy > Player.MAXDY) {
	Player.dy = Player.MAXDY;
    }
    else if (Player.dy < -Player.MAXDY) {
	Player.dy = -Player.MAXDY;
    }

    if ((wasleft  && (Player.dx > 0)) || (wasright && (Player.dx < 0))) {
	Player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }
    
    var tx        = p2t(Player.x),
        ty        = p2t(Player.y),
        nx        = Player.x % Game.TILE,         // true if player overlaps right
        ny        = Player.y % Game.TILE,         // true if player overlaps below
        cell      = tcell(tx,     ty),
        cellright = tcell(tx + 1, ty),
        cellleft  = tcell(tx - 1, ty),
        celldown  = tcell(tx,     ty + 1),
        celldiag  = tcell(tx + 1, ty + 1);

    if (Player.dy > 0) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        Player.y = t2p(ty);       // clamp the y position to avoid falling into platform below
        Player.dy = 0;            // stop downward velocity
        Player.falling = false;   // no longer falling
        Player.jumping = false;   // (or jumping)
        ny = 0;                   // - no longer overlaps the cells below
      }
    }
    else if (Player.dy < 0) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        Player.y = t2p(ty + 1);   // clamp the y position to avoid jumping into platform above
        Player.dy = 0;            // stop upward velocity
        cell      = celldown;     // player is no longer really in that cell, we clamped them to the cell below 
        cellright = celldiag;     // (ditto)
        ny        = 0;            // player no longer overlaps the cells below
      }
    }
    
    if (Player.dx > 0) {
      if ((cellright && !cell) ||
          (celldiag  && !celldown && ny)) {
        Player.x = t2p(tx);       // clamp the x position to avoid moving into the platform we just hit
        Player.dx = 0;            // stop horizontal velocity
      }
    }
    else if (Player.dx < 0) {
      if ((cell     && !cellright) ||
          (celldown && !celldiag && ny)) {
        Player.x = t2p(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
        Player.dx = 0;           // stop horizontal velocity
      }
    }
    
    //wall grab
    if ((cellleft || cellright) && !celldown && (Player.right || Player.left)) {
        Player.wallgrabbing = true;
        Player.dx = 0;
        Player.dy = 0;
        Player.jumping = false;
        Player.falling = false;
    }
    else {
        Player.wallgrabbing = false;
    }

    Player.falling = ! (celldown || (nx && celldiag));
    
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