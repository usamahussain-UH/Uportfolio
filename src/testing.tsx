class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false;
Type 'boolean' is not assignable to type 'number'.
    this.constructorUnknown = "plunkbat"; // ok, constructorUnknown is string | undefined
    this.methodOnly = "ok"; // ok, but methodOnly could also be undefined
  }
  method2() {
    this.methodOnly = true; // also, ok, methodOnly's type is string | boolean | undefined
  }
}

class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}
 
let c = new C();
c.prop = 0; // OK
c.count = "string";
Type 'string' is not assignable to type 'number'.

function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false;
Type 'boolean' is not assignable to type 'number'.
  this.constructorUnknown = "plunkbat"; // OK, the type is string | undefined
};

import { Component } from "react";
class MyComponent extends Component {
  render() {
    this.props.b; // Allowed, since this.props is of type any
  }
}
Use JSDoc @augments to specify the types explicitly. for instance:

import { Component } from "react";
/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // Error: b does not exist on {a:number}
  }
}

/** @type{Array} */
var x = [];
 
x.push(1); // OK
x.push("string"); // OK, x is of type Array<any>
 
/** @type{Array.<number>} */
var y = [];
 
y.push(1); // OK
y.push("string"); // Error, string is not assignable to number
Try
In function calls
A call to a generic function uses the arguments to infer the type parameters. Sometimes this process fails to infer any types, mainly because of lack of inference sources; in these cases, the type parameters will default to any. For example:

var p = new Promise((resolve, reject) => {
  reject();
});
p; // Promise<any>;

// 1. Select the div element using the id property
const app = document.getElementById("app");
// 2. Create a new <p></p> element programmatically
const p = document.createElement("p");
// 3. Add the text content
p.textContent = "Hello, World!";
// 4. Append the p element to the div element
app?.appendChild(p);
After compiling and running the index.html page, the resulting HTML will be:

<div id="app">
  <p>Hello, World!</p>
</div>


<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;
const div = document.getElementsByTagName("div")[0];
div.children;
// HTMLCollection(2) [p, p]
div.childNodes;
// NodeList(2) [p, p]
After capturing the div element, the children prop will return an HTMLCollection list containing the HTMLParagraphElements. The childNodes property will return a similar NodeList list of nodes. Each p tag will still be of type HTMLParagraphElements, but the NodeList can contain additional HTML nodes that the HTMLCollection list cannot.

Modify the HTML by removing one of the p tags, but keep the text.

<div>
  <p>Hello, World</p>
  TypeScript!
</div>;
const div = document.getElementsByTagName("div")[0];
div.children;
// HTMLCollection(1) [p]
div.childNodes;
// NodeList(2) [p, text]

/**
 * Returns the first element that is a descendant of node that matches selectors.
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;
/**
 * Returns all element descendants of node that match selectors.
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  // Other options...
};
function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}
myCoolFunction(
  function (x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function (x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}
myCoolFunction(
  function (x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function (x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);