var Game = {
    MAP: { tw: 24, th: 16 }, // object to store size of map in tiles
    TILE: 10,                // size of each tile (in game pixels)
    GRAVITY: 1.0,    // gravity
    dt: 1,
    enemies: [],
    score: 0,
    
    InitEnemies: function() {
        var list = this.enemies;
        
        for (i = 0; i < list.length; i++) {
            list[i].Init();
        }
    },
    
    DrawEnemies: function() {
        var list = this.enemies;
        
        for (i = 0; i < list.length; i++) {
            ctx.drawImage(list[i].image,px(list[i].x - 8),py(list[i].y - 12), 24 * 3, 13 * 3);
        }
    },
    
    UpdateEnemies: function() {
        var list = this.enemies;
        
        for (i = 0; i < list.length; i++) {
            list[i].Update();
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