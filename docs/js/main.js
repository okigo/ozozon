"use strict";

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// http://localhost:3000/
// http://192.168.0.11:3000/
// /*eslint-disable */
// -- Navbar -- //
var Navbar = /*#__PURE__*/ function() {
  function Navbar(navbar) {
    _classCallCheck(this, Navbar);

    this.navbar = navbar;
    this.buttonNav = this.navbar.querySelector('.button-nav');
    this.body = document.querySelector('body');
    this.setConfig();
    this.setListeners();
  }

  _createClass(Navbar, [{
    key: "setConfig",
    value: function setConfig() {
      this.isVisibleNav = false;
    }
  }, {
    key: "setListeners",
    value: function setListeners() {
      var _this = this;

      this.buttonNav.addEventListener('click', function() {
        _this.toggleNavState();
      });
    }
  }, {
    key: "toggleNavState",
    value: function toggleNavState() {
      var _this2 = this;

      if (!this.isVisibleNav) {
        this.isVisibleNav = true;
      } else {
        this.isVisibleNav = false;
      }

      requestAnimationFrame(function() {
        _this2.body.classList.toggle('active');
      });
    }
  }]);

  return Navbar;
}();

window.onload = function() {
  var navbarObj;
  var navbar = document.querySelector('.navbar');
  if (navbar) navbarObj = new Navbar(navbar);
  return {
    navbarObj: navbarObj
  };
};