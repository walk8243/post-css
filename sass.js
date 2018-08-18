class Sass {
  constructor(directory = '', filter = new RegExp(/^(?!_).*\.(sass|scss)$/), recursion = true) {
    this.setCondition(directory, filter, recursion);
    this.targets = [];
  }

  async compile() {
    if(!(Array.isArray(this.targets) && this.targets.length)) {
      await this.setTarget();
    }
    // console.log(this.targets);
  }

  getCondition() {
    return {
      directory: this.directory,
      filter: this.filter,
      recursion: this.recursion,
    };
  }
  setCondition(directory, filter, recursion) {
    this.setDirectory(directory);
    this.setFilter(filter);
    this.setRecursion(recursion);
  }
  setDirectory(directory) {
    if(directory == null) {
      directory = '';
    } else if(directory.match(/\/$/)) {
      directory = directory.slice(0, -1);
    }
    this.directory = directory;
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
    var path = this.directory || '.';
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
}

module.exports = Sass;
