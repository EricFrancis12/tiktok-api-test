const fs = require('fs');
const path = require('path');



const dirsToMake = ['../videos'].map(dir => path.resolve(__dirname, dir));

dirsToMake.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});
