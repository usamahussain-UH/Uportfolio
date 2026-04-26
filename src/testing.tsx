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