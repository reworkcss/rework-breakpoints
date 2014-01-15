rework-breakpoints
===================

**NOTE** Version v.0.5 uses `min|max-width` by default. To keep old behavior see *Options* below. Also the mixed syntax is new (see *Example 5* below).
**NOTE** Version v.0.6 uses `screen` instead of `only screen` by default. See *Options* below for how to keep old behavior.

Adding a nice syntax for handling media query breakpoints for different devices for the CSS Preprocessor [rework](https://github.com/reworkcss/rework).

## Installation

```bash
npm install rework-breakpoints
```

## Usage

An example of how to use `rework-breakpoints`:

```javascript
var rework = require('rework'),
    breakpoints = require('rework-breakpoints');

var css = rework(cssString).use(breakpoints).toString();
```

## Breakpoints plugin

Gives you a maintainable solution to handling media query breakpoints
for different devices, with a syntax that's easy to remember.

A breakpoint is declared with: `breakpoint-<name>: <type> <point>` or `breakpoint-<name>: <custom syntax>`, where:

  * `<name>` - is the name for the breakpoint (to use in your media query)
  * `<type>` - values: `min` or `max`
  * `<point>` - the actual breakpoint value in px, em or rem
  * `<custom syntax>` - any breakpoint, e.g. `screen and (orientation: landscape) and (max-width: 80em)`

**Note** A breakpoint can be declared with `var-breakpoint-<name>` as well, for a valid CSS syntax.

### Options

Available options are:

#### `breakpoints-device`

If set the type/point syntax will generate media queries with `min|max-device-width` instead of the default `min|max-width`.

Set it in your CSS like so:

```css
:root {
  breakpoints-device: true; /* `yes` or `1` works as well */
  /* OR */
  var-breakpoints-device: true;
}
```

#### `breakpoints-use-only`

If set the type/point syntax will generate media queries with `only screen` instead of the default `screen`.

Set it in your CSS like so:

```css
:root {
  breakpoints-use-only: true; /* `yes` or `1` works as well */
  /* OR */
  var-breakpoints-use-only: true;
}
```

### Examples

#### Example 1 - max breakpoint

```css
:root {
  breakpoint-mobile: max 340px;
}

@media mobile {
  /* all your mobile device styles goes here */
}
```

**yields**:

```css
@media screen and (max-width: 340px) {
  /* styles... */
}
```

#### Example 2 - max breakpoint (using `breakpoints-use-only` option)

```css
:root {
  breakpoints-use-only: true;
  breakpoint-mobile: max 340px;
}

@media mobile {
  /* all your mobile device styles goes here */
}
```

**yields**:

```css
@media only screen and (max-width: 340px) {
  /* styles... */
}
```

#### Example 3 - min breakpoint (using `var-` prefix)

```css
:root {
  var-breakpoint-desk: min 80em;
}

@media desk {
  /* all your desktop styles goes here */
}
```

**yields**:

```css
@media screen and (min-width: 80em) {
  /* styles... */
}
```

#### Example 4 - multiple breakpoints (using `breakpoints-device` option)

```css
:root {
  breakpoints-device: yes;
  breakpoint-palm: max 340px;
  breakpoint-tab: max 700px;
  breakpoint-desk: min 1000px;
  breakpoint-desk-wide: min 1200px;
}

@media palm {
  /* all your palm device styles goes here */
}
@media tab {
  /* all tablet styles */
}
@media tab-and-down {
  /* styles for tablets and smaller devices */
}
@media tab-and-up {
  /* styles for tablets and bigger screens */
}
@media desk-and-down {
  /* styles for desktops and smaller devices */
}
@media desk-and-up {
  /* styles for desktop and bigger screens */
}
@media desk-wide {
  /* styles for big screens */
}
```

**yields**:

```css
@media screen and (max-device-width: 340px) {
  /* styles... */
}
@media screen and (min-device-width: 341px) and (max-device-width: 700px) {
  /* all tablet styles */
}
@media screen and (max-device-width: 700px) {
  /* styles for tablets and smaller devices */
}
@media screen and (min-device-width: 341px) {
  /* styles for tablets and bigger screens */
}
@media screen and (max-device-width: 1199px) {
  /* styles for desktops and smaller devices */
}
@media screen and (min-device-width: 1000px) {
  /* styles for desktop and bigger screens */
}
@media screen and (min-device-width: 1200px) {
  /* styles for big screens */
}
```

#### Example 5 - mixed breakpoints

```css
:root {
  breakpoint-mobile: max 600px;
  breakpoint-landscape: (orientation: landscape);
}

@media mobile and landscape {
  body {
    color: #c00;
  }
}
```

**yields**:

```css
@media screen and (max-width: 600px) and (orientation: landscape) {
  body {
    color: #c00;
  }
}
```

*You get the point...*

## Unit tests

Make sure the dev-dependencies are installed, and then run:

```bash
npm test
```

## Contributing

Feel free to contribute!

## License

MIT
