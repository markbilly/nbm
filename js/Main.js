var c = document.getElementById("Game");
var debug = document.getElementById("debug");
var ctx = c.getContext("2d");
var img = new Image();
img.src = "NPI-2.png";

var MAP      = { tw: 64, th: 48 }, // the size of the map (in tiles)
    TILE     = 1,                 // the size of each tile (in game pixels)
    METER    = TILE,               // abitrary choice for 1m
    GRAVITY  = METER * 9.8,    // very exagerated gravity (6x)
    MAXDX    = METER * 20,         // max horizontal speed (20 tiles per second)
    MAXDY    = METER * 60,         // max vertical speed   (60 tiles per second)
    ACCEL    = MAXDX * 2,          // horizontal acceleration -  take 1/2 second to reach maxdx
    FRICTION = MAXDX * 6,          // horizontal friction     -  take 1/6 second to stop from maxdx
    JUMP     = METER * 1500,       // (a large) instantaneous jump impulse
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

player.image = img;

player.image.onload = function() {
    Processor();
}

function Draw() {
    ctx.drawImage(player.image,player.x,player.y);
    
    debug.innerHTML = "y = " + player.y + "<br>x = " + player.x;
}

function Processor() {
    ctx.clearRect(0,0,500,500);
    
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
    
    if (player.y > 100) {
        player.y = 100;
        player.falling = false;
        player.jumping = false;
    }
    
    
    if (player.x > 300) {
        player.x = 300;
    }
    else if (player.x < 0) {
        player.x = 0;
    }
    
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