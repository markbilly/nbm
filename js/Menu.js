var Menu = {
    
    selections: ["play", "difficulty", "levels"],
    
    selection: "play", //"levels" and "difficulty"
    
    Show: function() {
        Game.inMenu = true;
        
        ctx.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_b.clearRect(0,0,px(Game.width),py(Game.height));
        
        Game.level = Game.levels[0];
        
        var width = px(73);
        var height = py(56);
        var left = px((Game.width - 73) / 2);
        var top = py(30);
        
        var levelsText = Game.level.name;
        if (Menu.selection === "levels") {
            levelsText = "< " + levelsText + " >";
        }
        var difficultyText = Game.difficulty;
        if (Menu.selection === "difficulty") {
            difficultyText = "< " + difficultyText + " >";
        }
        var playText = "play";
        if (Menu.selection === "play") {
            playText = "* play *";
        }
        
        ctx.drawImage(Resources.title, left, top, width, height);
        
        ctx.font="" + px(8) + "px pixel";
        ctx.fillStyle = "black";
        ctx.fillText
        (
            levelsText,
            px(Centered(levelsText)),
            py(120)
        );
        ctx.fillText
        (
            difficultyText,
            px(Centered(difficultyText)),
            py(135)
        );
        ctx.fillText
        (
            playText,
            px(Centered(playText)),
            py(150)
        );
        
        function Centered(string) {
            var splitString = string.split(""),
                length = splitString.length,
                textLeft = (Game.width - (length * 8)) / 2;
            return textLeft;
        }
    },
    
    Hide: function() {
        Game.inMenu = false;
        ctx.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_b.clearRect(0,0,px(Game.width),py(Game.height));
    }
}