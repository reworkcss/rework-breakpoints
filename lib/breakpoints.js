/**
 * Breakpoints Plugin
 *
 * Gives you a maintainable solution to handling media query breakpoints
 * for different devices, with a syntax that's easy to remember.
 *
 *   :root {
 *     breakpoint-palm: max 340px;
 *     breakpoint-tab: max 700px;
 *     breakpoint-desk: min 1000px;
 *   }
 *   .palm {
 *     display: none;
 *   }
 *   @media palm {
 *     .palm {
 *       display: block;
 *     }
 *   }
 *   @media tab-and-down {
 *     .tab-and-down {
 *       display: block;
 *     }
 *   }
 *   @media desk {
 *     body > aside {
 *       width: 33%;
 *     }
 *   }
 *
 * Yeilds:
 *
 *   .palm {
 *     display: none;
 *   }
 *   @media only screen and (max-width: 340px) {
 *     .palm {
 *       display: block;
 *     }
 *   }
 *   @media only screen and (max-width: 700px) {
 *     .tab-and-down {
 *       display: block;
 *     }
 *   }
 *   @media only screen and (min-width: 1000px) {
 *     body > aside {
 *       width: 33%;
 *     }
 *   }
 *
 */

/**
 * Locals
 */
var mediaRules = [],
    breakpoints = [],
    options = {};

module.exports = function (style) {
  clean();
  rules(style.rules);
  apply();
};

function clean () {
  mediaRules = [];
  breakpoints = [];
  options = {};
}

/**
 * Visit all rules, in search for breakpoints and medias
 *
 * @param {Array} arr
 * @api private
 */
function rules(arr) {
  arr.forEach(function(rule, index){
    if (rule.rules) rules(rule.rules);
    if (rule.media) media(rule);
    if (rule.declarations) visit(rule.declarations);
  });
}

/**
 * Collect breakpoints
 *
 * @param {Array} declarations
 * @api private
 */
function visit(declarations) {
  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i];

    if (isBreakpointsOption(decl.property)) {
      option(decl.property, decl.value);
    } else if (isBreakpoint(decl.property)) {
      breakpoint(decl.property, decl.value);
    } else {
      continue;
    }

    // Remove breakpoint declarations and options:
    declarations.splice(i--, 1);
  }
}

/**
 * Collect media rules
 *
 * @param {Object} rule
 * @api private
 */
function media (rule) {
  mediaRules.push(rule);
}

/**
 * Check if property is a breakpoint option
 *
 * @param {String} property
 * @returns {Boolean}
 * @api private
 */
function isBreakpointsOption(property) {
  return !! property.match(/^(var-)?breakpoints-/);
}

/**
 * Check if property is a breakpoint
 *
 * @param {String} property
 * @returns {Boolean}
 * @api private
 */
function isBreakpoint(property) {
  return !! property.match(/^(var-)?breakpoint-/);
}

function option (property, value) {
  var name = getOptionName(property);

  options[name] = ['1', 'true', 'yes'].indexOf(value.toLowerCase()) > -1 ? true : false;
}

/**
 * Collect breakpoint information
 *
 * @param {String} property
 * @param {String} value
 * @api private
 */
function breakpoint(property, value) {
  var name = getBreakpointName(property);

  if (hasSpecialSyntax(value)) {
    getTypeAndPoint(value, function (err, result) {
      if (err) throw new Error('Error in breakpoint "' + name + '": ' + err.message);

      set(name, result.type, result.point);
    });
  } else {
    setCustom(name, value);
  }
}

/**
 * Get name for breakpoint option
 *
 * @param {String} property
 * @returns {String}
 * @api private
 */
function getOptionName(property) {
  return property.replace(/^(var-)?breakpoints-/, '');
}

/**
 * Get name for breakpoint
 *
 * @param {String} property
 * @returns {String}
 * @api private
 */
function getBreakpointName(property) {
  return property.replace(/^(var-)?breakpoint-/, '');
}

/**
 * Check if breakpoint value uses the type/point syntax
 *
 * @param {String} value
 * @returns {Boolean}
 * @api private
 */
function hasSpecialSyntax (value) {
  return /^(min|max)\s+[0-9\.]+(px|em|rem)$/.test(value);
}

/**
 * Get (and validate) type of breakpoint and its point in px
 *
 * @param {String} value
 * @param {Function} cb(err, {Object})
 * @api private
 */
function getTypeAndPoint(value, cb) {
  var parts = value.split(/\s+/),
      type = null,
      point = null;

  if (parts.length !== 2)
    cb(new Error('not in the format: <type> <breakpoint in px>, e.g. "min 1000px" or "max 340px"'));

  if (isType(parts[0]) && isPoint(parts[1]))
    cb(null, {type: parts[0], point: parts[1]});
  else if (isType(parts[1]) && isPoint(parts[0]))
    cb(null, {type: parts[1], point: parts[0]});
  else
    cb(new Error('missing type or point, i.e. "max" or "min" and e.g. "1000px" respectively'));
}

/**
 * Validate breakpoint type
 *
 * @param {String} str
 * @returns {Boolean}
 * @api private
 */
function isType(str) {
  return str.match(/(max|min)/);
}

/**
 * Validate breakpoint value
 *
 * @param {String} str
 * @returns {Boolean}
 * @api private
 */
function isPoint(str) {
  return str.match(/[0-9]+(px|em|rem)/);
}

/**
 * Set/add breakpoint data
 *
 * @param {String} name
 * @param {String} type
 * @param {String} point
 * @api private
 */
function set(name, type, point) {
  name = name.toLowerCase();
  type = type.toLowerCase();

  if (hasBreakpointWithName(name))
    throw new Error('Breakpoint with name: ' + name + ' is already defined!');

  if (hasBreakpointWithTypeAndPoint(type, point))
    throw new Error('A breakpoint at: ' + type + ' ' + point + ' is already defined!');

  var match = /([0-9\.]+)(px|em|rem)/.exec(point);

  var bp = {name: name, type: type, value: parseFloat(match[1]), unit: match[2]};
  bp.factor = bp.unit === 'px' ? 1 : 0.0001;
  breakpoints.push(bp);
}

/**
 * Set/add custom breakpoint data
 *
 * @param {String} name
 * @param {String} value
 * @api private
 */
function setCustom (name, value) {
  name = name.toLowerCase();

  if (hasBreakpointWithName(name))
    throw new Error('Breakpoint with name: ' + name + ' is already defined!');

  breakpoints.push({name: name, type: 'custom', value: value});
}

/**
 * Check if breakpoint with same name exists
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */
function hasBreakpointWithName (name) {
  return breakpoints.some(function (breakpoint) {
    return breakpoint.name === name;
  });
}

/**
 * Check if breakpoint exists of same type at same point
 *
 * @param {String} type
 * @param {Number} point
 * @returns {Boolean}
 * @api private
 */
function hasBreakpointWithTypeAndPoint (type, point) {
  return breakpoints.some(function (breakpoint) {
    return breakpoint.type === type && breakpoint[breakpoint.type] === point;
  });
}

/**
 * Apply all collected breakpoint on media rules
 *
 * @api private
 */
function apply() {
  var media = {},
      query = options.device ? '-device-width' : '-width';

  var maxPoints = breakpoints.filter(function (bp) {
    return bp.type === 'max';
  });
  maxPoints.sort(function (a, b) {
    return a.value - b.value;
  });

  for (var i = 0; i < maxPoints.length; i++) {
    media[maxPoints[i].name] = 'only screen';
    if (i) {
      media[maxPoints[i].name] += ' and (min' + query + ': ' + getValue(maxPoints[i-1], 1) + ')';
      media[maxPoints[i].name + '-and-down'] = 'only screen and (max' + query + ': ' + getValue(maxPoints[i]) + ')';
      media[maxPoints[i].name + '-and-up'] = 'only screen and (min' + query + ': ' + getValue(maxPoints[i-1], 1) + ')';
    }
    media[maxPoints[i].name] += ' and (max' + query + ': ' + getValue(maxPoints[i]) + ')';
  }

  var minPoints = breakpoints.filter(function (bp) {
    return bp.type === 'min';
  });
  minPoints.sort(function (a, b) {
    return a.value - b.value;
  });

  for (var j = minPoints.length - 1; j >= 0; j--) {
    media[minPoints[j].name] = 'only screen';
    media[minPoints[j].name] += ' and (min' + query + ': ' + getValue(minPoints[j]) + ')';
    if (j < minPoints.length - 1) {
      media[minPoints[j].name] += ' and (max' + query + ': ' + getValue(minPoints[j+1], -1) + ')';
      media[minPoints[j].name + '-and-up'] = 'only screen and (min' + query + ': ' + getValue(minPoints[j]) + ')';
      media[minPoints[j].name + '-and-down'] = 'only screen and (max' + query + ': ' + getValue(minPoints[j+1], -1) + ')';
    }
  }

  breakpoints.forEach(function (bp) {
    if (bp.type === 'custom') {
      media[bp.name] = bp.value;
    }
  });

  Object.keys(media).forEach(function (name) {
    mediaRules.forEach(function (rule) {
      rule.media = rule.media.replace(new RegExp('(^|\\s)' + name + '(\\s|$)', 'ig'), '$1' + media[name] + '$2');
    });
  });

  return;
}

function getValue (breakpoint, factorMultiplier) {
  if (!factorMultiplier) {
    factorMultiplier = 0;
  }
  return (breakpoint.value + factorMultiplier * breakpoint.factor) + breakpoint.unit;
}
