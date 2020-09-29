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
      this.isAnimation = false;
      this.scrollWidth = window.innerWidth - this.body.clientWidth;
    }
  }, {
    key: "setListeners",
    value: function setListeners() {
      var _this = this;

      window.addEventListener('resize', function() {
        _this.setResizeProperties();
      });
      this.buttonNav.addEventListener('click', function() {
        _this.toggleNavState();
      });
    }
  }, {
    key: "setResizeProperties",
    value: function setResizeProperties() {
      if (this.isVisibleNav) return;
      this.scrollWidth = window.innerWidth - this.body.clientWidth;
    }
  }, {
    key: "toggleNavState",
    value: function toggleNavState() {
      var _this2 = this;

      if (this.isAnimation) return;

      if (!this.isVisibleNav) {
        this.isVisibleNav = true;
      } else {
        this.isVisibleNav = false;
      }

      requestAnimationFrame(function() {
        _this2.toggleNav();
      });
    }
  }, {
    key: "toggleNav",
    value: function toggleNav() {
      var _this3 = this;

      var handler = function handler(e) {
        if (e.animationName === 'navOut') {
          _this3.body.classList.remove('nav-in');

          _this3.body.classList.remove('nav-out');

          _this3.scrollWidthCompensate(false);
        }

        _this3.navbar.removeEventListener('animationend', handler);

        _this3.isAnimation = false;
      };

      this.navbar.addEventListener('animationend', handler);
      this.isAnimation = true;

      if (this.isVisibleNav) {
        this.body.classList.add('nav-in');
        this.scrollWidthCompensate(true);
      } else {
        this.body.classList.add('nav-out');
      }
    }
  }, {
    key: "scrollWidthCompensate",
    value: function scrollWidthCompensate(isCompensate) {
      if (isCompensate) {
        var navbarPaddingRight = parseInt(getComputedStyle(this.navbar).paddingRight, 10);
        this.body.style.paddingRight = "".concat(this.scrollWidth, "px");
        this.navbar.style.paddingRight = "".concat(this.scrollWidth + navbarPaddingRight, "px");
      } else {
        this.body.style.cssText = '';
        this.navbar.style.cssText = '';
      }
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