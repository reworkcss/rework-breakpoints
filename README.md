rework-breakpoints
===================

Adding a nice syntax for handling media query breakpoints for different devices for the CSS Preprocessor [rework](https://github.com/visionmedia/rework).

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

For available plugins see plugins section below.

## Breakpoints plugin

Gives you a maintainable solution to handling media query breakpoints
for different devices, with a syntax that's easy to remember.

A breakpoint is declared with: `breakpoint-<name>: <type> <point>`, where:

  * `<name>` - is the name for the breakpoint (to use in your media query)
  * `<type>` - values: `min` or `max`
  * `<point>` - the actual breakpoint value in px, em or rem

**Note** A breakpoint can be declared with `var-breakpoint-<name>` as well, for a valid CSS syntax.

**Example 1 - max breakpoint**:

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
@media only screen and (max-device-width: 340px) {
  /* styles... */
}
```

**Example 2 - min breakpoint (using `var-` prefix)**:

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
@media only screen and (min-device-width: 80em) {
  /* styles... */
}
```

**Example 2 - multiple breakpoints**:

```css
:root {
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
@media only screen and (max-device-width: 340px) {
  /* styles... */
}
@media only screen and (min-device-width: 341px) and (max-device-width: 700px) {
  /* all tablet styles */
}
@media only screen and (max-device-width: 700px) {
  /* styles for tablets and smaller devices */
}
@media only screen and (min-device-width: 341px) {
  /* styles for tablets and bigger screens */
}
@media only screen and (max-device-width: 1199px) {
  /* styles for desktops and smaller devices */
}
@media only screen and (min-device-width: 1000px) {
  /* styles for desktop and bigger screens */
}
@media only screen and (min-device-width: 1200px) {
  /* styles for big screens */
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
