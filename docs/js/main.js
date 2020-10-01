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
      this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
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
      this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
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
}(); // -- Select -- //


var Select = /*#__PURE__*/ function() {
  function Select(selects) {
    _classCallCheck(this, Select);

    this.selectsArr = [];

    for (var i = 0; i < selects.length; i += 1) {
      var button = selects[i].querySelector('.select__button');
      var selectTarget = button.dataset.selectTarget;
      var target = document.getElementById(selectTarget);
      this.selectsArr.push({
        index: i,
        select: selects[i],
        button: button,
        buttonText: selects[i].querySelector('.select__button-text'),
        selectTarget: selectTarget,
        target: target,
        items: selects[i].querySelectorAll('.select__item')
      });
    }

    this.setListeners();
    this.init();
  }

  _createClass(Select, [{
    key: "init",
    value: function init() {
      for (var i = 0; i < this.selectsArr.length; i += 1) {
        var _this$selectsArr$i = this.selectsArr[i],
          index = _this$selectsArr$i.index,
          items = _this$selectsArr$i.items;

        for (var c = 0; c < items.length; c += 1) {
          if (items[c].classList.contains('select__item_active')) {
            this.toggleItem(index, items[c]);
          }
        }
      }
    }
  }, {
    key: "setListeners",
    value: function setListeners() {
      var _this4 = this;

      var _loop = function _loop(i) {
        var _this4$selectsArr$i = _this4.selectsArr[i],
          index = _this4$selectsArr$i.index,
          button = _this4$selectsArr$i.button,
          items = _this4$selectsArr$i.items;
        button.addEventListener('click', function(e) {
          e.preventDefault();
          requestAnimationFrame(function() {
            _this4.toggleSelect(index);
          });
        });

        for (var c = 0; c < items.length; c += 1) {
          items[c].addEventListener('click', function(e) {
            e.preventDefault();
            requestAnimationFrame(function() {
              _this4.toggleItem(index, e.target);

              _this4.toggleSelect(index);
            });
          });
        }
      };

      for (var i = 0; i < this.selectsArr.length; i += 1) {
        _loop(i);
      }
    }
  }, {
    key: "toggleSelect",
    value: function toggleSelect(index) {
      var select = this.selectsArr[index].select;
      select.classList.toggle('select_active');
    }
  }, {
    key: "toggleItem",
    value: function toggleItem(index, activeItem) {
      var _this$selectsArr$inde = this.selectsArr[index],
        items = _this$selectsArr$inde.items,
        buttonText = _this$selectsArr$inde.buttonText,
        target = _this$selectsArr$inde.target;
      buttonText.textContent = activeItem.textContent;
      if (target) target.value = activeItem.textContent;

      for (var i = 0; i < items.length; i += 1) {
        if (items[i] === activeItem) {
          items[i].classList.add('select__item_active');
        } else {
          items[i].classList.remove('select__item_active');
        }
      }
    }
  }]);

  return Select;
}();

function disableSubmitAction() {
  var buttons = document.querySelectorAll('*[type=submit]');

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function(e) {
      e.preventDefault();
    });
  }
}

window.onload = function() {
  var navbarObj;
  var selectObg;
  var navbar = document.querySelector('.navbar');
  var selects = document.querySelectorAll('[data-select]');
  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Select(selects);
  disableSubmitAction();
  return {
    navbarObj: navbarObj,
    selectObg: selectObg
  };
};