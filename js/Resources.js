var Resources = {
    playerRight: new Image(),
    playerLeft: new Image(),
    enemyRight: new Image(),
    enemyLeft: new Image(),
    melon: new Image(),
    leftButton: new Image(),
    rightButton: new Image(),
    upButton: new Image(),
    title: new Image(),
    arrowLeft: new Image(),
    arrowRight: new Image(),
    tiles: {
        wood: new Image(),
        floor1: new Image(),
        floor2: new Image(),
        vert1: new Image
    },
    list: [],
    loadedTally: 0,
    
    Assign: function() {
        var self = this;
        
        self.playerRight.src = "player.png";
        self.playerLeft.src = "playerl.png";
        self.enemyRight.src = "enemyr.png";
        self.enemyLeft.src = "enemy.png";
        self.melon.src = "melonsheet.png";
        self.leftButton.src = "left.png";
        self.rightButton.src = "right.png";
        self.upButton.src = "up.png";
        self.tiles.wood.src = "tile.png";
        self.tiles.floor1.src = "floor1.png";
        self.tiles.floor2.src = "floor2.png";
        self.tiles.vert1.src = "vert1.png";
        self.title.src = "ninjabreadman.png";
        self.arrowLeft.src = "arrowLeft.png";
        self.arrowRight.src = "arrowRight.png";
    },
    
    Load: function(callback) {
        var self = this;
        
        self.playerRight.src = "player.png";
        self.playerLeft.src = "playerl.png";
        self.enemyRight.src = "enemyr.png";
        self.enemyLeft.src = "enemy.png";
        self.melon.src = "melon/0.png";
        self.tiles.wood.src = "tile.png";
        self.tiles.floor1.src = "floor1.png";
        self.tiles.floor2.src = "floor2.png";
        self.tiles.vert1.src = "vert1.png";
        
        self.list.push(
            self.playerRight,
            self.playerLeft,
            self.enemyLeft,
            self.enemyRight,
            self.melon,
            self.tiles.wood,
            self.tiles.floor1,
            self.tiles.floor2,
            self.tiles.vert1
        );
        
        var ready = false;
        SetupLoaded();
        
        while(!ready) {
            if (self.loadedTally < self.list.length) {
            }
            else {
                ready = true;
                alert("ready");
                callback();
            }
        }
        
        function SetupLoaded() {
            for (i = 0; i < self.list.length; i++) {
                self.list[i].onload = function() {
                    self.loadedTally++;
                    alert("loaded");
                }
            }
        }
    }
}