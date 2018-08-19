const fs = require('fs');
const Sass = require('./sass');

module.exports = (() => {
  const sass = new Sass();
  var srcDir = sass.getCondition().srcDir;
  if(!(fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory())) {
    console.error(`'${srcDir}' is not exist!`);
  }

  return sass;
})();
