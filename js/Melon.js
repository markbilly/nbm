function Melon() {
    this.image = null;
    this.counterElem = null;
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
            
            self.counterElem.style.visibility = "visible";
            self.counterElem.style.left = px(self.x + 1) + "px";
            self.counterElem.style.top = py(self.y - Game.TILE - 8) + "px";
            
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
            self.counterElem.style.visibility = "hidden";
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
            
            self.image.src = "melon/" + self.frame + ".png";
            break;
        case "exploded":
            self.timer++;
            
            if (self.timer === Game.fps) {
                self.state = "end";
            }
            break;
        case "end":
            self.counterElem.style.visibility = "hidden";
            self.BoundingBox.x = 0;
            self.BoundingBox.y = 0;
            self.BoundingBox.width = 0;
            self.BoundingBox.height = 0;
            map[self.tileIndex] = 9;
            //Game.melons.splice(self.index, 1);
            self.visible = false;
            break;
    }
}

Melon.prototype.Init = function() {
    
    var self = this;
    self.timer = 0;
    self.counter = 9;
    self.frame = 0;
    self.visible = true;
    
    //Get index in melons array
    self.index = Game.melons.indexOf(self);
    
    //Set up image
    var img = new Image();
    img.src = "melon/" + self.frame + ".png";
    
    //set up counter
    var elem = document.createElement("counter" + self.index);
    container.appendChild(elem);
    
    //record new elem as property
    self.counterElem = elem;
    
    //style counter
    self.counterElem.style.visibility = "hidden";
    self.counterElem.style.position = "absolute";
    self.counterElem.style.color = "red";
    self.counterElem.style.width = px(Game.TILE) + "px";
    self.counterElem.style.height = py(Game.TILE) + "px";
    self.counterElem.style.padding = 0 + "px";
    
    var spawned = false;
    
    while (!spawned) {
        var tileIndex = RandomInt(0, map.length);
        var tile = map[tileIndex];
        
        if (tile === 9) {
            
            self.x = Game.TileLocationToPixel(tileIndex).x;
            self.y = Game.TileLocationToPixel(tileIndex).y;
            self.yInit = self.y;
            
            spawned = true;
            
            if (spawned) {
                self.state = "start";
                self.image = img;
                self.counterElem.style.visibility = "visible";
                self.tileIndex = tileIndex;
                map[tileIndex] = 0;
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
        
    if (melcell === 9) melcell = 0;
    if (melcellright === 9) melcellright = 0;
    if (melcellleft === 9) melcellleft = 0;
    if (melcelldown === 9) melcelldown = 0;
    if (melcelldiag === 9) melcelldiag = 0;
    
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
            Player.Die(mel, "You're toast!");
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