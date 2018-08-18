class Sass {
  constructor(directory = '', filter = new RegExp(/^(?!_).*\.(sass|scss)$/), recursion = true) {
    this.setCondition(directory, filter, recursion);
  }
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
    });
  }
}

module.exports = Sass;
