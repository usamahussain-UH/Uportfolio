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