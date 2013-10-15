function Enemy(x, y) {
    this.image = null;
    this.xInit = x;
    this.yInit = y;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.ddx = 0;
    this.ddy = 0;
    this.falling = false;
    this.MAXDX = 1.0;
    this.MAXDY = 9.0;
    this.BoundingBox = {
        x: 0,
        y: 0,
        width: Game.TILE,
        height: Game.TILE
    };
    this.dead = false;
}

Enemy.prototype.Init = function() {
    var img = new Image();
    img.src = "enemy.png";
    this.image = img;
    this.x = this.xInit;
    this.y = this.yInit;
}

Enemy.prototype.Update = function() {
    this.UpdatePosition();
    this.ApplyCollisions();
    
    if (this.dx < 0) {
        this.image.src = "enemy.png";
    }
    else {
        this.image.src = "enemyr.png";
    }
}

Enemy.prototype.UpdatePosition = function() {
    
    var enemy = this;
    
    if (enemy.dx === 0) {
        enemy.dx = enemy.MAXDX;
    }
    enemy.ddx = 0;
    enemy.ddy = Game.GRAVITY;
    
    if (enemy.dy > enemy.MAXDY) {
        enemy.dy = enemy.MAXDY;
    }
    
    enemy.y  = Math.floor(enemy.y  + (Game.dt * enemy.dy));
    enemy.x  = Math.floor(enemy.x  + (Game.dt * enemy.dx));
    enemy.dx = Math.floor(enemy.dx + (Game.dt * enemy.ddx));
    enemy.dy = Math.floor(enemy.dy + (Game.dt * enemy.ddy));
    
    enemy.BoundingBox.x = enemy.x;
    enemy.BoundingBox.y = enemy.y;
}
    
Enemy.prototype.ApplyCollisions = function() {
    
    var enemy = this;
    
    var enemytx        = Game.PixelToTile(enemy.x),
        enemyty        = Game.PixelToTile(enemy.y),
        enemynx        = enemy.x % Game.TILE,         // true if player overlaps right
        enemyny        = enemy.y % Game.TILE,         // true if player overlaps below
        enemycell      = Game.TileLocationFromTile(enemytx,     enemyty),
        enemycellright = Game.TileLocationFromTile(enemytx + 1, enemyty),
        enemycellleft  = Game.TileLocationFromTile(enemytx - 1, enemyty),
        enemycelldown  = Game.TileLocationFromTile(enemytx,     enemyty + 1),
        enemycelldiag  = Game.TileLocationFromTile(enemytx + 1, enemyty + 1);
        
    if (enemycell === 9) enemycell = 0;
    if (enemycellright === 9) enemycellright = 0;
    if (enemycellleft === 9) enemycellleft = 0;
    if (enemycelldown === 9) enemycelldown = 0;
    if (enemycelldiag === 9) enemycelldiag = 0;
        
    if (enemy.dy > 0) {
      if ((enemycelldown && !enemycell) ||
          (enemycelldiag && !enemycellright && enemynx)) {
        enemy.y = Game.TileToPixel(enemyty);       // clamp the y position to avoid falling into platform below
        enemy.dy = 0;            // stop downward velocity
        enemy.falling = false;   // no longer falling
        enemyny = 0;                   // - no longer overlaps the cells below
      }
    }
    if ((!enemycelldiag || !enemycelldown) && !enemy.falling && !enemy.dead) {
        enemy.y = Game.TileToPixel(enemyty);
        if (enemy.dx > 0) {
            enemy.dx = -enemy.MAXDX;
        }
        else if (enemy.dx < 0) {
            enemy.dx = enemy.MAXDX;
        }
    }
    if (enemy.dx > 0) {
      if ((enemycellright && !enemycell) ||
          (enemycelldiag  && !enemycelldown && enemyny)) {
        enemy.x = Game.TileToPixel(enemytx);       // clamp the x position to avoid moving into the platform we just hit
        enemy.dx = -enemy.MAXDX;            // stop horizontal velocity
      }
    }
    else if (enemy.dx < 0) {
      if ((enemycell     && !enemycellright) ||
          (enemycelldown && !enemycelldiag && enemyny)) {
        enemy.x = Game.TileToPixel(enemytx + 1);  // clamp the x position to avoid moving into the platform we just hit
        enemy.dx = enemy.MAXDX;           // stop horizontal velocity
      }
    }
    
    enemy.falling = ! (enemycelldown || (enemynx && enemycelldiag));
    
    var inPlayerCell = Game.IsColliding(enemy, Player),
        inMelonCell = Game.IsColliding(enemy, melon);
    
    if (inPlayerCell) {
        if (Player.dead === false) {
            Player.Die(enemy);
        }
    }
    if (inMelonCell && melon.state === "exploding" && !enemy.dead) {
        //alert("enemy dead");
        enemy.dead = true;
        enemy.dx = enemy.dx * 5;
        enemy.MAXDX = enemy.MAXDX * 5;
    }
}