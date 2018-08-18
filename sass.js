class Sass {
  constructor(directory, filter, recursion) {
    this.setTarget(directory, filter, recursion);
  }

  getTarget() {
    return {
      directory: this.directory,
      filter: this.filter,
      recursion: this.recursion,
    };
  }
  setTarget(directory = '', filter = '', recursion = false) {
    if(directory.match(/\/$/)) directory = directory.slice(0, -1);
    Object.assign(this, {
      directory: directory,
      filter: filter,
      recursion: recursion,
    });
  }
}

module.exports = Sass;
