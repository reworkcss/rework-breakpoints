var breakpoints = require('../index'),
    rework = require('rework'),
    should = require('chai').Should(),
    read = require('fs').readFileSync;

var css = {
  in: function (name) {
    return this._read(name, 'in');
  },
  out: function (name) {
    return this._read(name, 'out');
  },
  _read: function (name, type) {
    return read(__dirname + '/' + name + '.' + type + '.css', 'utf8');
  }
};

describe('rework-breakpoints', function(){
  it('should add breakpoints support', function(){
    rework(css.in('breakpoints'))
      .use(breakpoints)
      .toString()
      .should.equal(css.out('breakpoints'));
  });

  it('should be able to handle breakpoints declared with the "var-" syntax', function(){
    rework(css.in('breakpointsVar'))
      .use(breakpoints)
      .toString()
      .should.equal(css.out('breakpoints'));
  });
});
