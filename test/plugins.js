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
      .trim()
      .should.equal(css.out('breakpoints').trim());
  });

  it('shouldn\'t crash when a declaration has an empty property or value', function(){
    rework(css.in('breakpointsEmpty'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpointsEmpty').trim());
  });

  it('should be able to handle breakpoints declared with the "var-" syntax', function(){
    rework(css.in('breakpointsVar'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpoints').trim());
  });

  it('should be able to handle breakpoints with elastic units', function(){
    rework(css.in('breakpointsEm'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpointsEm').trim());
  });

  it('should be able to handle custom breakpoints', function(){
    rework(css.in('breakpointsCustom'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpointsCustom').trim());
  });

  it('should use min|max-device-width when `breakpoints-device` option is set', function(){
    rework(css.in('breakpointsDevice'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpointsDevice').trim());
  });

  it('should be able to mix breakpoint names with custom breakpoints in media queries', function(){
    rework(css.in('breakpointsMixed'))
      .use(breakpoints)
      .toString()
      .trim()
      .should.equal(css.out('breakpointsMixed').trim());
  });
});
