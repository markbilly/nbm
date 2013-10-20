var GameOver = {
    elem: document.getElementById("GameOver"),
    text: document.getElementById("GameOverText"),
    
    Build: function() {
        var self = this;
        
        self.elem.style.width = gameWidth + "px";
        self.elem.style.height = py(90) + "px";
        self.elem.style.left = px(0) + "px";
        self.text.style.left = px(0) + "px";
        self.elem.style.top = py(45) + "px";
        self.text.style.top = py(65) + "px";
        self.elem.style.backgroundColor = "black";
        self.elem.style.opacity = 0.8;
        self.elem.style.visibility = "hidden";
        self.text.style.color = "white";
        self.elem.style.paddingTop = px(20) + "px";
    },
    
    Show: function(string) {
        var self = this,
            splitString = string.split(""),
            length = splitString.length,
            gameW = Game.MAP.tw * Game.TILE,
            left = (gameW - (length * 8)) / 2;
        
        self.text.style.left = px(left) + "px";
        self.text.innerHTML = string;
        self.elem.style.visibility = "visible";
        self.text.style.visibility = "visible";
    },
    
    Hide: function() {
        var self = this;
        
        self.elem.style.visibility = "hidden";
        self.text.style.visibility = "hidden";
    }
}