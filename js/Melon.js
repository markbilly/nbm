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
    this.counter = 5;
    this.radius = 0;
    this.frame = 0;
    this.previousY = 0;
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
            self.counterElem.style.left = px(self.x) + "px";
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
            self.timer++;
            var secondPassed = self.timer % 3;
            if (secondPassed === 0) {
                if (self.frame < 8) {
                    self.frame++;
                }
                else {
                    self.state = "exploded";
                }
            }
            
            if (self.radius > 50) {
                self.radius = 0;
            }
            else {
                self.radius += 5;
            }
            
            self.image.src = "melon/" + self.frame + ".png";
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
    self.timer = 0;
    self.counter = 5;
    self.frame = 0;
    
    //Set up image
    var img = new Image();
    img.src = "melon/" + self.frame + ".png";
    
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
        
        if (tile === 9) {
            self.x = Game.TileLocationToPixel(tileIndex).x;
            self.y = Game.TileLocationToPixel(tileIndex).y;
            if (self.y !== self.previousY) {
                spawned = true;
                self.state = "start";
                self.image = img;
                self.previousY = self.y;
            }
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
      }
    }
    
    enemy.falling = ! (enemycelldown);
    
    var inPlayerCell = (enemy.x < Player.x +
                        Game.TILE && enemy.x +
                        Game.TILE  > Player.x && enemy.y < Player.y +
                        Game.TILE && enemy.y +
                        Game.TILE > Player.y);
    
    if (inPlayerCell) {
        enemy.Init();
        Game.score++;
    }
}