var c = document.getElementById("Game");
var debug = document.getElementById("debug");
var ctx = c.getContext("2d");
var img = new Image();
img.src = "NPI-2.png";

var player = {
    image: null,
    x: 0,
    y: 0,
    v: 0,
    vd: 0,
    ad: 10,
    au: 0,
    a: 10
}
var keys = [];

player.image = img;

player.image.onload = function() {
    Processor();
}

function Draw() {
    ctx.drawImage(player.image,player.x,player.y);
    
    debug.innerHTML = "y = " + player.y +
                        "<br>speed = " + player.vd +
                        "<br>acceleration = " + player.a +
                        "<br>a_up = " + player.au +
                        "<br>a_down = " + player.ad;
}

function Processor() {
    ctx.clearRect(0,0,500,500);
    
    //horizontal move
    if (player.x > 500) {
        player.x = 0;
    }
    else {
        player.x += player.v;
    }
    //close
    
    //vertical move
    player.a = player.ad - player.au;
    player.vd += player.a;
    player.y += player.vd;
    
    if (player.vd > 10) {
        player.vd = 10;
    }
    
    if (player.y > 100) {
        player.y = 100;
        player.vd = 0;
    }
    //close
    
    Draw();
    requestAnimationFrame(Processor);
}

function keyPressed() {
    // check keys
    //put false conditions in
    if (keys[38] === true) {
        // up arrow
        player.vd = -50;
    }
    if (keys[39] === true) {
        // right arrow
        player.v = 5;     
    }          
    if (keys[37] === true) {                 
        // left arrow
        player.v = -5;
    }
}

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    keyPressed();
});
 
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    keyPressed();
});
