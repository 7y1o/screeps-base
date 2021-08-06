const SpawnController = require('./controllers/spawn');
const controller = new SpawnController();

module.exports.loop = () => {
    controller.update();
};