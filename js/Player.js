var Player = {
    image: null,
    xInit: 60,
    yInit: 140,
    x: 60,
    y: 140,
    width: 12,
    height: 12,
    dx: 0,
    dy: 0,
    ddx: 0,
    ddy: 0,
    tx: 0,
    ty: 0,
    falling: false,
    jumping: false,
    wallgrabbingleft: false,
    wallgrabbingright: false,
    dead: false,
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
        this.image = img;
        this.x = this.xInit;
        this.y = this.yInit;
    },
    
    Update: function() {
        
        var wasleft  = Player.dx < 0,
            wasright = Player.dx > 0,
            falling  = Player.falling;
            
        this.UpdatePosition(wasleft, wasright, falling);
        this.ClampSpeed(wasleft, wasright);
        
        if (this.dead === false) {
            this.ApplyCollisions(wasleft, wasright, falling);
        }
    },
    
    UpdatePosition: function(wasleft, wasright, falling) {
        
        var player = this;
        
        player.ddx = 0;
        player.ddy = Game.GRAVITY;
        
        if (player.left && !player.wallgrabbingleft) {
            player.ddx = player.ddx - player.ACCEL;     // player wants to go left
        }
        else if (wasleft) {
            player.ddx = player.ddx + player.FRICTION;  // player was going left, but not any more
        }
        
        if (player.right && !player.wallgrabbingright) {
            player.ddx = player.ddx + player.ACCEL;     // player wants to go right
        }
        else if (wasright) {
            player.ddx = player.ddx - player.FRICTION;  // player was going right, but not any more
        }
        
        if (player.jump && !player.jumping && !falling) {
            player.ddy = player.ddy - player.JUMP;     // apply an instantaneous (large) vertical impulse
            player.jumping = true;
        }
        
        player.y  = Math.floor(player.y  + (Game.dt * player.dy));
        player.x  = Math.floor(player.x  + (Game.dt * player.dx));
        player.dx = Math.floor(player.dx + (Game.dt * player.ddx));
        player.dy = Math.floor(player.dy + (Game.dt * player.ddy));
        
    },
    
    ClampSpeed: function(wasleft, wasright) {
        
        var player = this;
            
        if (player.dx > player.MAXDX) {
            player.dx = player.MAXDX;
        }
        else if (player.dx < -player.MAXDX) {
            player.dx = -player.MAXDX;
        }
        if (player.dy > player.MAXDY) {
            player.dy = player.MAXDY;
        }
        else if (player.dy < -player.MAXDY) {
            player.dy = -player.MAXDY;
        }
        if ((wasleft  && (player.dx > 0)) || (wasright && (player.dx < 0))) {
            player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }
        
    },
    
    ApplyCollisions: function(wasleft, wasright, falling) {
        
        var player = this;
        
        var tx        = Game.PixelToTile(player.x),
            ty        = Game.PixelToTile(player.y),
            nx        = player.x % Game.TILE,         // true if player overlaps right
            ny        = player.y % Game.TILE,         // true if player overlaps below
            cell      = Game.TileLocationFromTile(tx,     ty),
            cellright = Game.TileLocationFromTile(tx + 1, ty),
            cellleft  = Game.TileLocationFromTile(tx - 1, ty),
            celldown  = Game.TileLocationFromTile(tx,     ty + 1),
            celldiag  = Game.TileLocationFromTile(tx + 1, ty + 1);
        
        player.tx = tx;
        player.ty = ty;
        
        var topLeft = { x: player.x, y: player.y },
            topRight = { x: player.x + player.width, y: player.y },
            bottomLeft = { x: player.x, y: player.y + player.height },
            bottomRight = { x: player.x + player.width, y: player.y + player.height },
            topLeftTile = Game.TileLocationFromPixel(topLeft.x, topLeft.y),
            topRightTile = Game.TileLocationFromPixel(topRight.x, topRight.y),
            bottomLeftTile = Game.TileLocationFromPixel(bottomLeft.x, bottomLeft.y),
            bottomRightTile = Game.TileLocationFromPixel(bottomRight.x, bottomRight.y);
        
        if (player.dy > 0) {
            if ((wasright && bottomRightTile) ||
                (wasleft && bottomLeftTile) ||
                (!player.dx && (bottomRightTile || bottomLeftTile))) {
                player.y = Game.TileToPixel(ty);
                player.dy = 0;            // stop downward velocity
                player.falling = false;   // no longer falling
                player.jumping = false;   // (or jumping)                
            }
        }
        else if (player.dy < 0) {
            if ((wasright && topRightTile) ||
                (wasleft && topLeftTile) ||
                (!player.dx && (topRightTile || topLeftTile))) {
                player.dy = 0;            // stop upward velocity
            }
        }
        
        //if (player.dy > 0) {
        //  if ((celldown && !cell) ||
        //      (celldiag && !cellright && nx)) {
        //    player.y = Game.TileToPixel(ty);       // clamp the y position to avoid falling into platform below
        //    player.dy = 0;            // stop downward velocity
        //    player.falling = false;   // no longer falling
        //    player.jumping = false;   // (or jumping)
        //    ny = 0;                   // - no longer overlaps the cells below
        //  }
        //}
        //else if (player.dy < 0) {
        //  if ((cell      && !celldown) ||
        //      (cellright && !celldiag && nx)) {
        //    player.y = Game.TileToPixel(ty + 1);   // clamp the y position to avoid jumping into platform above
        //    player.dy = 0;            // stop upward velocity
        //    cell      = celldown;     // player is no longer really in that cell, we clamped them to the cell below 
        //    cellright = celldiag;     // (ditto)
        //    ny        = 0;            // player no longer overlaps the cells below
        //  }
        //}
        //
        //if (player.dx > 0) {
        //  if ((cellright && !cell) ||
        //      (celldiag  && !celldown && ny)) {
        //    player.x = Game.TileToPixel(tx);       // clamp the x position to avoid moving into the platform we just hit
        //    player.dx = 0;            // stop horizontal velocity
        //  }
        //}
        //else if (player.dx < 0) {
        //  if ((cell     && !cellright) ||
        //      (celldown && !celldiag && ny)) {
        //    player.x = Game.TileToPixel(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
        //    player.dx = 0;           // stop horizontal velocity
        //  }
        //}
        
        //wall grab
        if (cellright && !celldown && player.right && !player.jump) {
            player.wallgrabbingright = true;
            player.x = Game.TileToPixel(tx);
            player.dx = 0;
            player.dy = 0;
            player.jumping = false;
            player.falling = false;
        }
        else if (cellleft && !celldown && player.left && !player.jump) {
            player.wallgrabbingleft = true;
            player.x = Game.TileToPixel(tx);
            player.dx = 0;
            player.dy = 0;
            player.jumping = false;
            player.falling = false;
        }
        else {
            player.wallgrabbingleft = false;
            player.wallgrabbingright = false;
        }
        
        if (!player.wallgrabbingleft && !player.wallgrabbingright) {
            player.falling = ! (celldown || (nx && celldiag));
        }
    }
}