function Sprite(name, width, height, img, frames_n, views_n, longer, scale) {
    if (name === undefined) {
	return;
    }
    if (scale === undefined) {
        scale = 3;
    }
    this.name = name;
    this.rawWidth = width * scale;
    this.rawHeight = height * scale;
    this.width = px(width);
    this.height = py(height);
    this.frames_n = frames_n;
    this.views_n = views_n;
    this.longer = longer;
    this.current_frame = 1;
    this.current_view = 1;
    this.canvas = c;
    this.img = null;

    var self = this;
    
    self.img = img;
    
    if (this.longer !== true) {
        this.longer = false;
    }
}