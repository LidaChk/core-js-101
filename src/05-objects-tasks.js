/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(new proto.constructor(), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class MyBuilder {
  constructor() {
    // Order matters! element, id, class, attribute, pseudo-class, pseudo-element
    this.checkElementString = 'element id class attr pseudoClass pseudoElement';
    this.checkIdString = 'id class attr pseudoClass pseudoElement';
    this.checkClassString = 'attr pseudoClass pseudoElement';
    this.checkAttrString = 'pseudoClass pseudoElement';
    this.checkPseudoString = 'pseudoElement';
    this.uniError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.ordError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';


    this.selectorText = '';
    this.selectorObject = {
      element: null,
      id: null,
      class: '',
      attr: '',
      pseudoClass: '',
      pseudoElement: null,
    };
  }

  stringify() {
    return `${this.selectorText}${Object.values(this.selectorObject).join('')}`;
  }

  getNulls() {
    return Object.keys(this.selectorObject)
      .filter((key) => this.selectorObject[key] === null || this.selectorObject[key] === '').join(' ');
  }

  selector(value) {
    this.selectorText = `${this.selectorText}${value}`;
    return this;
  }

  element(value) {
    if (this.selectorObject.element !== null) throw new Error(this.uniError);
    if (this.getNulls() !== this.checkElementString) throw new Error(this.ordError);
    this.selectorObject.element = value;
    return this;
  }

  id(value) {
    if (this.selectorObject.id !== null) throw new Error(this.uniError);
    if (!this.getNulls().includes(this.checkIdString)) throw new Error(this.ordError);
    this.selectorObject.id = `#${value}`;
    return this;
  }

  class(value) {
    if (!this.getNulls().includes(this.checkClassString)) throw new Error(this.ordError);
    this.selectorObject.class = `${this.selectorObject.class}.${value}`;
    return this;
  }

  attr(value) {
    if (!this.getNulls().includes(this.checkAttrString)) throw new Error(this.ordError);
    this.selectorObject.attr = `${this.selectorObject.attr}[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (!this.getNulls().includes(this.checkPseudoString)) throw new Error(this.ordError);
    this.selectorObject.pseudoClass = `${this.selectorObject.pseudoClass}:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.selectorObject.pseudoElement !== null) throw new Error(this.uniError);
    if (!this.getNulls().includes(this.checkPseudoString)) throw new Error(this.ordError);
    this.selectorObject.pseudoElement = `::${value}`;
    return this;
  }
}

const cssSelectorBuilder = {

  stringify() {
    return new MyBuilder().stringify();
  },
  element(value) {
    return new MyBuilder().element(value);
  },

  id(value) {
    return new MyBuilder().id(value);
  },

  class(value) {
    return new MyBuilder().class(value);
  },

  attr(value) {
    return new MyBuilder().attr(value);
  },

  pseudoClass(value) {
    return new MyBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MyBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MyBuilder().selector(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
