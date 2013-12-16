var GameOver = {
    
    Show: function(string) {
        var self = this,
            splitString = string.split(""),
            length = splitString.length,
            left = (Game.width - (length * 8)) / 2;
        
        ctx_overlay.globalAlpha = 0.8;
        ctx_overlay.fillStyle = "black";
        ctx_overlay.fillRect(px(0), py(45), px(Game.width), py(Game.TILE * 6));
        
        ctx_overlay.globalAlpha = 1.0;
        ctx_overlay.font="" + px(8) + "px pixel";
        ctx_overlay.fillStyle = "white";
        ctx_overlay.fillText
        (
            string,
            px(left),
            py(75)
        );
        ctx_overlay.fillText
        (
            "x - retry / esc - menu",
            px(51),
            py(107)
        );
    },
    
    Hide: function() {
        ctx_overlay.clearRect(0,0,px(Game.width),py(Game.height));
        ctx_overlay.clearRect(0,0,px(Game.width),py(Game.height));
    }
}