function Melon() {
    this.image = null;
    this.x = 0;
    this.y = 0;
    this.dy = 0;
    this.ddy = 0;
    this.falling = false;
    this.MAXDX = 1.0;      // max horizontal speed (20 tiles per second)
    this.MAXDY = 9.0;      // max vertical speed   (60 tiles per second)
}

Melon.prototype.Init = function() {
    
    var self = this;
    
    //Set up image
    var img = new Image();
    img.src = "melon.png";
    this.image = img;
    
    var spawned = false;
    
    while (!spawned) {
        var tileIndex = RandomInt(0, map.length);
        var tile = map[tileIndex];
        
        if (!tile) {
            spawned = true;
            self.x = Game.TileLocationToPixel(tileIndex).x;
            self.y = Game.TileLocationToPixel(tileIndex).y;
        }
    }
    control.innerHTML = "Melon: (" + self.x + ", " + self.y + ")";
    
    function RandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;    
    }
}

Melon.prototype.Update = function() {
    this.UpdatePosition();
    this.ApplyCollisions();
}

Melon.prototype.UpdatePosition = function() {
    
    var melon = this;
    
    melon.ddy = Game.GRAVITY;
    
    if (melon.dy > melon.MAXDY) {
        melon.dy = melon.MAXDY;
    }
    
    melon.y  = Math.floor(melon.y  + (Game.dt * melon.dy));
    melon.dy = Math.floor(melon.dy + (Game.dt * melon.ddy));
}
    
Melon.prototype.ApplyCollisions = function() {
    
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
    
    if (enemy.dy > 0) {
        if ((enemycelldown && !enemycell) ||
            (enemycelldiag && !enemycellright && enemynx)) {
            enemy.y = Game.TileToPixel(enemyty);       // clamp the y position to avoid falling into platform below
            enemy.dy = 0;            // stop downward velocity
            enemy.falling = false;   // no longer falling
      }
    }
    
    enemy.falling = ! (enemycelldown);
    
    //var inPlayerCell = (enemytx === Player.tx) && (enemyty === Player.ty);
    //
    //if (inPlayerCell) {
    //    Player.dead = true;
    //    Player.dx = 0;
    //    Player.x = Game.TileToPixel(Player.tx);
    //}
    //control.innerHTML = "<br>dead: " + Player.dead;
}