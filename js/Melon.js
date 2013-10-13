function Melon() {
    this.image = null;
    this.counterElem;
    this.x = 0;
    this.y = 0;
    this.dy = 0;
    this.ddy = 0;
    this.falling = false;
    this.state = "start";
    this.timer = 0;
    this.counter = 3;
    this.MAXDX = 1.0;      // max horizontal speed (20 tiles per second)
    this.MAXDY = 9.0;      // max vertical speed   (60 tiles per second)
}

Melon.prototype.ReactToState = function() {
    var self = this;
    
    switch(self.state) {
        case "start":
            if (Player.dy === 0) {
                self.state = "countdown";
            }
            break;
        case "countdown":
            self.counterElem.style.left = px(self.x - Game.TILE) + "px";
            self.counterElem.style.top = py(self.y - (2 * Game.TILE)) + "px";
            
            self.timer++;
            var secondPassed = self.timer % 60;
            if (secondPassed === 0) {
                self.counter--;
            }
            if (self.counter === 0) {
                self.state = "exploding";
                self.Explode();
            }
            break;
        case "exploding":
            self.state = "exploded";
            break;
        case "exploded":
            self.Init();
            break;
    }
    
}

Melon.prototype.Explode = function() {
}

Melon.prototype.Init = function() {
    
    var self = this;
    self.state = "start";
    self.timer = 0;
    self.counter = 3;
    
    //Set up image
    var img = new Image();
    img.src = "melon.png";
    self.image = img;
    
    //set up counter
    if (self.counterElem === undefined) {
        self.counterElem = document.getElementById("counter");
        self.counterElem.style.position = "absolute";
        self.counterElem.style.width = px(Game.TILE) + "px";
        self.counterElem.style.height = py(Game.TILE) + "px";
        self.counterElem.style.fontSize = px(Game.TILE) + "px";
    }
    else {
        self.counterElem.innerHTML = "";
    }    
    
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
    this.ReactToState();
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