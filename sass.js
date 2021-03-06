const autoprefixer  = require('autoprefixer'),
      cssnano       = require('cssnano'),
      postcss       = require('postcss'),
      precss        = require('precss'),
      fs            = require('fs');

class Sass {
  constructor(srcDir = 'src/', destDir = 'dest/', filter = new RegExp(/^(?!_).*\.(sass|scss)$/), recursion = true) {
    this.setCondition(srcDir, destDir, filter, recursion);
    this.targets = [];
  }

  async compile() {
    if(!(Array.isArray(this.targets) && this.targets.length)) {
      await this.setTarget();
    }
    // console.log(this.targets);
    for(let target of this.targets) {
      this.postcss(target);
    }
  }
  postcss(target) {
    var output = target.replace(new RegExp(`^${this.srcDir || '.'}\\/`), `${this.destDir || '.'}/`).replace(/\.(sass|scss)$/, '.css');
    // console.log(output);
    Sass.mkdir(Sass.getPrevDir(output));

    fs.readFile(target, (err, css) => {
      if(err) throw err;
      postcss([precss, autoprefixer, cssnano])
        .process(css, { from: target, to: output })
        .then(result => {
          // console.log(result);
          return new Promise((resolve, reject) => {
            fs.writeFile(output, result.css, err => {
              if(err) return reject(err);
              resolve();
            });
          }).then(() => {
            if(result.map) {
              fs.writeFile(`${output}.map`, result.map, err => {
                if(err) return reject(err);
                resolve();
              });
            }
          });
        }).catch((error) => {
          console.error(error);
        });
    });
  }

  getCondition() {
    return {
      srcDir: this.srcDir,
      destDir: this.destDir,
      filter: this.filter,
      recursion: this.recursion,
    };
  }
  setCondition(srcDir, destDir, filter, recursion) {
    this.setSrcDir(srcDir);
    this.setDestDir(destDir);
    this.setFilter(filter);
    this.setRecursion(recursion);
  }
  setSrcDir(srcDir) {
    if(srcDir == null) {
      srcDir = '';
    } else if(srcDir.match(/\/$/)) {
      srcDir = srcDir.slice(0, -1);
    }
    this.srcDir = srcDir;
  }
  setDestDir(destDir) {
    if(destDir == null) {
      destDir = '';
    } else if(destDir.match(/\/$/)) {
      destDir = destDir.slice(0, -1);
    }
    this.destDir = destDir;
  }
  setFilter(filter) {
    if(filter == null) filter = new RegExp(/^(?!_).*\.(sass|scss)$/);
    this.filter = filter;
  }
  setRecursion(recursion) {
    if(recursion == null) recursion = true;
    this.recursion = recursion;
  }

  getTarget() {
    return this.targets;
  }
  async setTarget() {
    var path = this.srcDir || '.';
    return this.getTargetList(path)
      .then(targets => {
        // console.log(targets);
        this.targets = targets;
      }).catch(error => {
        console.error(error);
      });
  }

  getTargetList(path) {
    var targetList = [];

    return new Promise((resolve, reject) => {
      fs.readdir(path, async (err, files) => {
        if(err) return reject(err);

        for(let file of files) {
          let stat = fs.statSync(path+'/'+file);
          if(stat.isFile()) {
            if(file.match(this.filter)) {
              // console.log(path+'/'+file, 'ok');
              targetList.push(path+'/'+file);
            } else {
              // console.log(path+'/'+file, 'fail');
            }
          } else if(stat.isDirectory() && this.recursion) {
            // console.log(path+'/'+file);
            Array.prototype.push.apply(targetList, await this.getTargetList(path+'/'+file));
          }
        }
        resolve(targetList);
      });
    });
  }

  static mkdir(dirPath) {
    if(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) return true;
    if(Sass.mkdir(Sass.getPrevDir(dirPath))) {
      fs.mkdirSync(dirPath);
      return true;
    }
  }
  static getPrevDir(path) {
    return path.replace(new RegExp('\\/[^\\/]*$'), '');
  }
}

module.exports = Sass;
