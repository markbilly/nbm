var Menu = {
    
    Show: function() {
        Game.inMenu = true;
        Game.paused = true;
        
        ctx.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_b.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_bg.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_overlay.clearRect(0,0,px(Game.width),py(Game.height));
                
        var width = px(73);
        var height = py(56);
        var left = px((Game.width - 73) / 2);
        var top = py(34);
        
        var levelsText = Game.level.name;
        levelsText = "< " + levelsText + " >";
        
        ctx_bg.drawImage(Game.level.bg, 0, 0, px(Game.width), py(Game.height));
        ctx_overlay.drawImage(Resources.title, left, top, width, height);
        ctx_b.globalAlpha = 0.8;
        ctx_bg.globalAlpha = 0.8;
        Game.BuildLevel(Game.level.map);
        
        ctx_overlay.font="" + px(8) + "px pixel";
        ctx_overlay.fillStyle = "black";
        ctx_overlay.fillText
        (
            levelsText,
            px(Centered(levelsText)),
            py(120)
        );
        ctx_overlay.fillText
        (
            "press X to play",
            px(Centered("press X to play")),
            py(167)
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
        Game.paused = false;
        ctx.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_b.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_b.globalAlpha = 1.0;
        ctx_bg.globalAlpha = 1.0;
    }
}