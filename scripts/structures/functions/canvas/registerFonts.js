const fs = require('fs')
const { join } = require('path');
const path = join(__dirname, "fonts");
const Canvas = require('canvas');

module.exports = () => {
    fs.readdir(path, (err, files) => {
        files.forEach((file, i) => {
            if (file.endsWith('.otf') || file.endsWith('.ttf')) {
                family = file.replace('.otf', '').replace('.ttf', '')
                Canvas.registerFont(`${path}/${file}`, { family: family });
            }
        })
    })
}