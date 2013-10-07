(function () {

    var game = new Phaser.Game(x(284), y(160), Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('logo', 'logo.png');
    }

    function create() {
        // create player and configure
        player = myGame.createSprite(0, 0, "entities");
        player.drag.x = 900;
        player.maxVelocity.x = 250;
        player.animations.add('idle', ['player-idle-1.png'], 10, false, false);
        player.animations.add('walk', ['player-walk-1-00.png', 'player-walk-1-01.png', 'player-walk-1-02.png', 'player-walk-1-03.png', 'player-walk-1-04.png', 'player-walk-1-05.png', 'player-walk-1-06.png', 'player-walk-1-07.png'], 10, true, false);
        player.animations.play('idle');
    }

    function update() {
    }
    
    var player = Phaser.Sprite;

})();

function x(x) {
    return x * 3;
}
function y(y) {
    return y * 3;
}