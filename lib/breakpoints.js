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
 *   @media only screen and (max-device-width: 340px) {
 *     .palm {
 *       display: block;
 *     }
 *   }
 *   @media only screen and (max-device-width: 700px) {
 *     .tab-and-down {
 *       display: block;
 *     }
 *   }
 *   @media only screen and (min-device-width: 1000px) {
 *     body > aside {
 *       width: 33%;
 *     }
 *   }
 *
 */

module.exports = function (style) {
  rules(style.rules);
  apply();
};

/**
 * Locals
 */
var mediaRules = [],
    breakpoints = [];


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
    if (rule.declarations) {
      visit(rule.declarations);
      // Remove rule if without declarations
      if (!rule.declarations.length)
        arr.splice(index, 1);
    }
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

    if (!isBreakpoint(decl.property)) continue;

    breakpoint(decl.property, decl.value);

    // Remove breakpoint declaration:
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
 * Check if property is a breakpoint
 *
 * @param {String} property
 * @returns {Boolean}
 * @api private
 */
function isBreakpoint(property) {
  return !! property.match(/^(var-)?breakpoint-/);
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

  getTypeAndPoint(value, function (err, result) {
      if (err) throw new Error('Error in breakpoint "' + name + '": ' + err.message);

      set(name, result.type, result.point);
  });
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
  return str.match(/[0-9]+px/);
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
  point = parseInt(point.slice(0, -2));

  if (hasBreakpointWithName(name))
    throw new Error('Breakpoint with name: ' + name + ' is already defined!');

  if (hasBreakpointWithTypeAndPoint(type, point))
    throw new Error('A breakpoint at: ' + type + ' ' + point + 'px is already defined!');

  var bp = {name: name, type: type};
  bp[type] = point;
  breakpoints.push(bp);
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
  var media = {};

  var maxPoints = breakpoints.filter(function (bp) {
    return bp.type === 'max';
  });
  for (var i = 0; i < maxPoints.length; i++) {
    media[maxPoints[i].name] = 'only screen';
    if (i) {
      media[maxPoints[i].name] += ' and (min-device-width: ' + (maxPoints[i-1].max + 1) + 'px)';
      media[maxPoints[i].name + '-and-down'] = 'only screen and (max-device-width: ' + maxPoints[i].max + 'px)';
      media[maxPoints[i].name + '-and-up'] = 'only screen and (min-device-width: ' + (maxPoints[i-1].max + 1) + 'px)';
    }
    media[maxPoints[i].name] += ' and (max-device-width: ' + maxPoints[i].max + 'px)';
  }

  var minPoints = breakpoints.filter(function (bp) {
    return bp.type === 'min';
  });
  for (var j = minPoints.length - 1; j >= 0; j--) {
    media[minPoints[j].name] = 'only screen';
    media[minPoints[j].name] += ' and (min-device-width: ' + minPoints[j].min + 'px)';
    if (j < minPoints.length - 1) {
      media[minPoints[j].name] += ' and (max-device-width: ' + (minPoints[j+1].min - 1) + 'px)';
      media[minPoints[j].name + '-and-up'] = 'only screen and (min-device-width: ' + minPoints[j].min + 'px)';
      media[minPoints[j].name + '-and-down'] = 'only screen and (max-device-width: ' + (minPoints[j+1].min - 1) + 'px)';
    }
  }

  mediaRules.forEach(function (rule) {
    var name = rule.media.toLowerCase();
    if (media[name]) rule.media = media[name];
  });
  return;
}
