var Paused = {
    elem: document.getElementById("Paused"),
    text: document.getElementById("PausedText"),
    
    Build: function() {
        var self = this;
        
        self.elem.style.width = px(Game.width) + "px";
        self.elem.style.height = py(Game.TILE * 6) + "px";
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
    
    Show: function() {
        var self = this,
            string = "Paused!";
            splitString = string.split(""),
            length = splitString.length,
            left = (Game.width - (length * 8)) / 2;
        
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