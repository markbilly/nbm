var Game = {
    MAP: { tw: 24, th: 16 }, // object to store size of map in tiles - WIDE
    //MAP: { tw: 20, th: 22 }, // object to store size of map in tiles - TALL
    TILE: 12,                // size of each tile (in game pixels)
    GRAVITY: 1.0,    // gravity
    dt: 1,
    enemies: [],
    melons: [],
    score: 0,
    fps: 50,
    melonTimer: 0,
    scale: 3,
    previousMelonY: 0,
    paused: false,
    
    IsColliding: function(object1, object2) {
        
        var x1 = object1.BoundingBox.x,
            y1 = object1.BoundingBox.y,
            w1 = object1.BoundingBox.width,
            h1 = object1.BoundingBox.height,
            x2 = object2.BoundingBox.x,
            y2 = object2.BoundingBox.y,
            w2 = object2.BoundingBox.width,
            h2 = object2.BoundingBox.height,
            result = (x1 <= x2 + w2 && x1 + w1 >= x2 && y1 <= y2 + h2 && y1 + h1 >= y2);
        
        return result;
    },
    
    InitEnemies: function() {
        var list = this.enemies;
        
        for (i = 0; i < list.length; i++) {
            list[i].Init();
        }
    },
    
    InitMelons: function() {
        var list = this.melons;
        
        if (list.length > 0) {
            for (i = 0; i < list.length; i++) {
                list[i].Init();
            }
        }
    },
    
    RestoreAllMelonTiles: function() {
        var list = this.melons;
        
        if (list.length > 0) {
            for (i = 0; i < list.length; i++) {
                map[list[i].tileIndex] = 9;
            }
        }
    },
    
    DrawEnemies: function() {
        var list = this.enemies;
        
        for (i = 0; i < list.length; i++) {
            ctx.drawImage(list[i].image,px(list[i].x - 8),py(list[i].y - 16), px(24), py(16));
        }
    },

    DrawMelons: function() {
        var list = this.melons;
        
        for (i = 0; i < list.length; i++) {
            
            if (list[i].visible) {
                
                list[i].Draw
                (
                    px(list[i].x + 5 - 50),
                    py(list[i].y - 5 - 50)
                );
                
                if (list[i].state === "countdown") {
                    ctx.font="" + px(8) + "px pixel";
                    ctx.fillStyle = "red";
                    ctx.fillText
                    (
                        "" + list[i].counter + "",
                        px(list[i].x + 1),
                        py(list[i].y - Game.TILE)
                    );
                }
            }
        }
    },
    
    UpdateEnemies: function() {
        var list = this.enemies;
        
        for (var i = 0; i < list.length; i++) {
            if (list[i]) list[i].Update();
        }
    },
    
    UpdateMelons: function() {
        var list = this.melons;
        
        for (var i = 0; i < list.length; i++) {
            if (list[i]) list[i].Update();
        }
    },
    
    TileToPixel: function(t) {
        return t * Game.TILE;
    },
    
    TileLocationToPixel: function(t) {
        var ty = Math.ceil((t + 1) / (Game.MAP.tw + 1));
        var tx = t - ((ty - 1) * (Game.MAP.tw + 1));
        var x = Game.TileToPixel(tx);
        var y = Game.TileToPixel(ty);
        
        return { x: x, y: y };
    },
    
    PixelToTile: function(p) {
        return Math.floor(p/Game.TILE);
    },
    
    TileLocationFromPixel: function(x, y) {
        return Game.TileLocationFromTile(Game.PixelToTile(x),Game.PixelToTile(y));
    },
    
    TileLocationFromTile: function(tx, ty) {
        var out = 0;
        
        out = tx;
        out += (ty - 1) * (Game.MAP.tw + 1);
        
        return map[out];
    },  
    
    BuildLevel: function(level) {
        var y = 0;
        var x = 0;
        var tileImage = tile;
        
        for (i = 0; i < level.length; i++) {
            //draw tile
            if (level[i] === 0 || level[i] === 9) {
                //do nothing
            }
            else {
                if (level[i] === 1) {
                    tileImage = tile;
                }
                else if (level[i] === 2) {
                    tileImage = tile_floor1;
                }
                else if (level[i] === 3) {
                    tileImage = tile_floor2;
                }
                else if (level[i] === 4) {
                    tileImage = tile_vert1;
                }
                else if (level[i] === 5) {
                    tileImage = tile_ground1;
                }
                else if (level[i] === 6) {
                    tileImage = tile_ground2;
                }
                ctx_b.drawImage(tileImage,x,y,px(Game.TILE),py(Game.TILE));
            }
            
            //get next draw location
            if (level[i] !== 8) {
                x += px(Game.TILE);
            }
            else {
                x = 0;
                y += py(Game.TILE);            
            }
        }
    }
}