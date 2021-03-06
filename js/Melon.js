function Melon() {
    this.image = null;
    this.x = 0;
    this.y = 0;
    this.dy = 0;
    this.ddy = 0;
    this.falling = false;
    this.state = "start";
    this.timer = 0;
    this.counter = 0; //set value in Init()
    this.BoundingBox = {
        x: 0,
        y: 0,
        width: Game.TILE,
        height: Game.TILE
    };
    this.frame = 0;
    this.yInit = 0;
    this.MAXDX = 1.0;      // max horizontal speed (20 tiles per second)
    this.MAXDY = 9.0;      // max vertical speed   (60 tiles per second)
    this.index = 0; // got in Init()
    this.visible = true;
    this.tileIndex;
    this.sprite = null;
    this.newCreated = false;
}

Melon.prototype.Draw = function(x, y) {
    var sprite = this.sprite,
        sWidth = sprite.rawWidth,
        sHeight = sprite.rawHeight,
        pos_f = (this.frame) * sprite.rawWidth;
    
    ctx.drawImage(sprite.img, pos_f, 0, sWidth, sHeight, x, y, sprite.width, sprite.height);
}

Melon.prototype.ReactToState = function() {
    var self = this;
    
    switch(self.state) {
        case "start":
            if (self.dy === 0) {
                self.state = "countdown";
            }
            break;
        case "countdown":
            self.BoundingBox.x = self.x;
            self.BoundingBox.y = self.y - Game.TILE;
            self.BoundingBox.width = Game.TILE;
            self.BoundingBox.height = Game.TILE;
            
            self.timer++;
            var secondPassed = self.timer % Game.fps;
            if (secondPassed === 0) {
                self.counter--;
            }
            if (self.counter === 0) {
                self.state = "exploding";
            }
            break;
        case "exploding":
            self.timer++;
            var secondPassed = self.timer % Math.ceil(Game.fps / 20);
            if (secondPassed === 0) {
                if (self.frame < 9) {
                    if (self.frame === 2) {
                        self.BoundingBox.x = self.x - 20;
                        self.BoundingBox.y = self.y - Game.TILE - 25;
                        self.BoundingBox.width = 50;
                        self.BoundingBox.height = 50;
                    }
                    if (self.frame === 3) {
                        self.BoundingBox.x = self.x - 40;
                        self.BoundingBox.y = self.y - Game.TILE - 45;
                        self.BoundingBox.width = 90;
                        self.BoundingBox.height = 90;
                    }
                    else if (self.frame === 4) {
                        self.BoundingBox.x = self.x;
                        self.BoundingBox.y = self.y - Game.TILE;
                        self.BoundingBox.width = Game.TILE;
                        self.BoundingBox.height = Game.TILE;                     
                    }
                    self.frame++;
                }
                else {
                    self.state = "exploded";
                    self.timer = 0;
                }
            }
            
            break;
        case "exploded":
            self.timer++;
            
            if (self.timer === Game.fps) {
                self.state = "end";
            }
            break;
        case "end":
            self.BoundingBox.x = 0;
            self.BoundingBox.y = 0;
            self.BoundingBox.width = 0;
            self.BoundingBox.height = 0;
            Game.level.map[self.tileIndex] = 9;
            self.visible = false;
            break;
    }
}

Melon.prototype.Init = function() {
    
    var self = this;
    self.timer = 0;
    self.frame = 0;
    self.visible = true;
    self.counter = 10;
    
    //Get index in melons array
    self.index = Game.melons.indexOf(self);
    
    //Set up sprite
    var sprite = new Sprite("melon" + self.index, 100, 100, Resources.melon, 10, 1);
    
    var spawned = false;
    
    while (!spawned) {
        var tileIndex = RandomInt(0, Game.level.map.length);
        var tile = Game.level.map[tileIndex];
        
        if (tile === 9) {
            
            self.x = Game.TileLocationToPixel(tileIndex).x;
            self.y = Game.TileLocationToPixel(tileIndex).y;
            self.yInit = self.y;
            
            if (self.yInit !== Game.previousMelonY) {
                spawned = true;
            }
            
            if (spawned) {
                self.state = "start";
                self.sprite = sprite;
                self.tileIndex = tileIndex;
                Game.level.map[tileIndex] = 0;
                Game.previousMelonY = self.yInit;
            }
        }
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
    
    var mel = this;
    
    var meltx        = Game.PixelToTile(mel.x),
        melty        = Game.PixelToTile(mel.y),
        melnx        = mel.x % Game.TILE,         // true if player overlaps right
        melny        = mel.y % Game.TILE,         // true if player overlaps below
        melcell      = Game.TileLocationFromTile(meltx,     melty),
        melcellright = Game.TileLocationFromTile(meltx + 1, melty),
        melcellleft  = Game.TileLocationFromTile(meltx - 1, melty),
        melcelldown  = Game.TileLocationFromTile(meltx,     melty + 1),
        melcelldiag  = Game.TileLocationFromTile(meltx + 1, melty + 1);
            
        if (melcell === 9 || melcell === 12 || melcell === 13 || melcell === 14 || melcell === 15) melcell = 0;
        if (melcellright === 9 || melcellright === 12 || melcellright === 13 || melcellright === 14 || melcellright === 15) melcellright = 0;
        if (melcellleft === 9 || melcellleft === 12 || melcellleft === 13 || melcellleft === 14 || melcellleft === 15) melcellleft = 0;
        if (melcelldown === 9 || melcelldown === 12 || melcelldown === 13 || melcelldown === 14 || melcelldown === 15) melcelldown = 0;
        if (melcelldiag === 9 || melcelldiag === 12 || melcelldiag === 13 || melcelldiag === 14 || melcelldiag === 15) melcelldiag = 0;
    
    if (mel.dy > 0) {
        if ((melcelldown && !melcell) ||
            (melcelldiag && !melcellright && melnx)) {
            mel.y = Game.TileToPixel(melty);       // clamp the y position to avoid falling into platform below
            mel.dy = 0;            // stop downward velocity
            mel.falling = false;   // no longer falling
      }
    }
    
    mel.falling = ! (melcelldown);
    
    var inPlayerCell = Game.IsColliding(mel, Player);
    
    if (inPlayerCell && !Player.dead) {
        if (mel.state === "countdown") {
            mel.state = "end";
            Game.score++;
        }
        else if (mel.state === "exploding") {
            Player.Die("You're toast!");
        }
        else {
            //do nothing
        }
    }
    
    if (Game.enemies.length > 0) {
        
        var enemiesInCell = GetEnemiesInCell();
        
        if ((enemiesInCell.length > 0) && mel.state === "exploding") {
            for (i = 0; i < enemiesInCell.length; i++) {
                if (!enemiesInCell[i].onfire) {
                    enemiesInCell[i].onfire = true;
                    enemiesInCell[i].dx = enemiesInCell[i].dx * 5;
                    enemiesInCell[i].MAXDX = enemiesInCell[i].MAXDX * 5;
                }
            }
        }    
    }
    
    function GetEnemiesInCell() {
        var touching = [];
        
        for (i = 0; i < Game.enemies.length; i++) {
            var currentEnemy = Game.enemies[i];
            
            if (Game.IsColliding(mel, currentEnemy)) {
                touching.push(currentEnemy);
            };
        }
        
        return touching;
    }
}