var Player = {
    image: null,
    x: 60,
    y: 0,
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    falling: false,
    jumping: false,
    wallgrabbingleft: false,
    wallgrabbingright: false,
    left: false,
    right: false,
    jump: false,
    MAXDX: 3.0,      // max horizontal speed (20 tiles per second)
    MAXDY: 9.0,      // max vertical speed   (60 tiles per second)
    ACCEL: 8.0,        // horizontal acceleration -  take 1/2 second to reach maxdx
    FRICTION: 24.0,     // horizontal friction     -  take 1/6 second to stop from maxdx
    JUMP: 100.0,         // (a large) instantaneous jump impulse
    
    Init: function() {
        var img = new Image();
        img.src = "player.png";
        Player.image = img;        
    }
}