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
    this.JUMP = 100.0;
    this.BoundingBox = {
        x: 0,
        y: 0,
        width: Game.TILE,
        height: Game.TILE
    };
    this.onfire = false;
    this.fireTimer = 0;
    this.dead = false;
}

Enemy.prototype.Init = function() {
    this.onfire = false;
    this.MAXDX = 1.0;
    var img = new Image();
    img.src = "enemy.png";
    this.image = img;
    this.x = this.xInit;
    this.y = this.yInit;
}

Enemy.prototype.Die = function() { 
    this.dead = true;
    this.onfire = false;
    this.jumping = true;
    this.ddx = 0;
    this.dx = 0;
    this.x = Game.TileToPixel(Game.PixelToTile(this.x));
    this.dy = this.dy - (this.JUMP * 0.25);
}
    
Enemy.prototype.Update = function() {
    var self = this;
    
    if (self.onfire && !self.dead) {
        var jumpDelay = RandomInt(1, 3);
        self.fireTimer++;
        if (self.fireTimer === (Game.fps * 3)) {
            var newEnemy = new Enemy(self.xInit, self.yInit);
            Game.enemies.push(newEnemy);
            Game.enemies[Game.enemies.length - 1].Init();
        }
        if (!(self.fireTimer % (Game.fps * jumpDelay))) {
            self.dy = self.dy - (self.JUMP);
        }
        if (self.fireTimer > (Game.fps * 10) && !self.falling && !self.jumping) {
            self.Die();
        }
    }
    else {
        self.fireTimer = 0;
    }
    
    this.UpdatePosition();
    if (!this.dead) this.ApplyCollisions();
    
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
    else if (enemy.dy < -enemy.MAXDY) {
        enemy.dy = -enemy.MAXDY;
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
        enemycelldiag  = Game.TileLocationFromTile(enemytx + 1, enemyty + 1),
        enemycellleftdiag  = Game.TileLocationFromTile(enemytx - 1, enemyty + 1);
        
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
    else if (enemy.dy < 0) {
      if ((enemycell      && !enemycelldown) ||
          (enemycellright && !enemycelldiag && enemynx)) {
        enemy.y = Game.TileToPixel(enemyty + 1);   // clamp the y position to avoid jumping into platform above
        enemy.dy = 0;            // stop upward velocity
        enemycell      = enemycelldown;     // player is no longer really in that cell, we clamped them to the cell below 
        enemycellright = enemycelldiag;     // (ditto)
        enemyny        = 0;            // player no longer overlaps the cells below
      }
    }
    if ((!enemycelldiag || !enemycellleftdiag) &&
        !enemy.falling && !enemy.jumping && enemycelldown/*&& !enemy.onfire*/) {
        
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
    
    var inPlayerCell = Game.IsColliding(enemy, Player);
    
    if (inPlayerCell) {
        if (!Player.dead) {
            if (enemy.onfire) {
                Player.Die(enemy, "You're toast!");
            }
            else {
                Player.Die(enemy, "Crumbs! You're dead!");
            }
        }
    }
}