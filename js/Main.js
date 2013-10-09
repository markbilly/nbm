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
var ctx = c.getContext("2d");
var ctx_b = b.getContext("2d");
var img = new Image();
img.src = "player.png";
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

var MAP      = { tw: 24, th: 16 }, // the size of the map (in tiles)
    TILE     = 10,                 // the size of each tile (in game pixels)
    METER    = TILE * 0.5,               // abitrary choice for 1m
    GRAVITY  = METER * 0.2,    
    MAXDX    = METER * 0.8,         // max horizontal speed (20 tiles per second)
    MAXDY    = METER * 1.8,         // max vertical speed   (60 tiles per second)
    ACCEL    = MAXDX * 2,          // horizontal acceleration -  take 1/2 second to reach maxdx
    FRICTION = MAXDX * 6,          // horizontal friction     -  take 1/6 second to stop from maxdx
    JUMP     = METER * 6,       // (a large) instantaneous jump impulse
    dt = 1;

var player = {
    image: null,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    falling: false,
    jumping: false
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

player.image = img;

player.image.onload = function() {
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
            ctx_b.drawImage(tileImage,x,y,px(TILE),py(TILE));
        }
        
        //get next draw location
        if (level[i] !== 8) {
            x += px(TILE);
        }
        else {
            x = 0;
            y += py(TILE);            
        }
    }
}
    
function t2p(t) {
    return t * TILE;
}

function p2t(p) {
    return Math.floor(p/TILE);
}
    
function cell(x, y) {
    return tcell(p2t(x),p2t(y));
}

function tcell(tx, ty) {
    var out = 0;
    
    out = tx;
    out += (ty - 1) * (MAP.tw + 1);
    
    control.innerHTML = "player @ (" + tx + ", " + ty + ")<br>tile location: " + out;
    
    return map[out];
}

function Draw() {
    ctx.drawImage(player.image,px(player.x - 8),py(player.y - 12), 24 * 3, 13 * 3);

    debug.innerHTML = "y = " + player.y + "<br>x = " + player.x;
}

function Processor() {
    ctx.clearRect(0,0,720,480);

    var wasleft  = player.dx < 0,
	wasright = player.dx > 0,
	falling  = player.falling;

    player.ddx = 0;
    player.ddy = GRAVITY;

    if (player.left) {
	player.ddx = player.ddx - ACCEL;     // player wants to go left
    }
    else if (wasleft) {
	player.ddx = player.ddx + FRICTION;  // player was going left, but not any more
    }

    if (player.right) {
	player.ddx = player.ddx + ACCEL;     // player wants to go right
    }
    else if (wasright) {
	player.ddx = player.ddx - FRICTION;  // player was going right, but not any more
    }

    if (player.jump && !player.jumping && !falling) {
	player.ddy = player.ddy - JUMP;     // apply an instantaneous (large) vertical impulse
	player.jumping = true;
    }

    player.y  = Math.floor(player.y  + (dt * player.dy));
    player.x  = Math.floor(player.x  + (dt * player.dx));
    player.dx = Math.floor(player.dx + (dt * player.ddx));
    player.dy = Math.floor(player.dy + (dt * player.ddy));

    if (player.dx > MAXDX) {
	player.dx = MAXDX;
    }
    else if (player.dx < -MAXDX) {
	player.dx = -MAXDX;
    }

    if (player.dy > MAXDY) {
	player.dy = MAXDY;
    }
    else if (player.dy < -MAXDY) {
	player.dy = -MAXDY;
    }

    if ((wasleft  && (player.dx > 0)) || (wasright && (player.dx < 0))) {
	player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
    }
    
    var tx        = p2t(player.x),
        ty        = p2t(player.y),
        nx        = player.x % TILE,         // true if player overlaps right
        ny        = player.y % TILE,         // true if player overlaps below
        cell      = tcell(tx,     ty),
        cellright = tcell(tx + 1, ty),
        celldown  = tcell(tx,     ty + 1),
        celldiag  = tcell(tx + 1, ty + 1);

    if (player.dy > 0) {
      if ((celldown && !cell) ||
          (celldiag && !cellright && nx)) {
        player.y = t2p(ty);       // clamp the y position to avoid falling into platform below
        player.dy = 0;            // stop downward velocity
        player.falling = false;   // no longer falling
        player.jumping = false;   // (or jumping)
        ny = 0;                   // - no longer overlaps the cells below
      }
    }
    else if (player.dy < 0) {
      if ((cell      && !celldown) ||
          (cellright && !celldiag && nx)) {
        player.y = t2p(ty + 1);   // clamp the y position to avoid jumping into platform above
        player.dy = 0;            // stop upward velocity
        cell      = celldown;     // player is no longer really in that cell, we clamped them to the cell below 
        cellright = celldiag;     // (ditto)
        ny        = 0;            // player no longer overlaps the cells below
      }
    }
    
    if (player.dx > 0) {
      if ((cellright && !cell) ||
          (celldiag  && !celldown && ny)) {
        player.x = t2p(tx);       // clamp the x position to avoid moving into the platform we just hit
        player.dx = 0;            // stop horizontal velocity
      }
    }
    else if (player.dx < 0) {
      if ((cell     && !cellright) ||
          (celldown && !celldiag && ny)) {
        player.x = t2p(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
        player.dx = 0;           // stop horizontal velocity
      }
    }

    player.falling = ! (celldown || (nx && celldiag));
    
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
	    player.left = down;
	    break;
	case 39: //right
	    player.right = down;
	    break;
	case 88: //x
	    player.jump = down;
	    break;
    }
}