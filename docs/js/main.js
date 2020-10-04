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
}(); // -- Selects -- //


var Selects = /*#__PURE__*/ function() {
  function Selects(selects) {
    _classCallCheck(this, Selects);

    this.selectsArr = [];

    for (var i = 0; i < selects.length; i += 1) {
      var button = selects[i].querySelector('.select__button');
      var selectTarget = button.dataset.selectTarget;
      var target = document.getElementById(selectTarget);
      this.selectsArr.push({
        index: i,
        select: selects[i],
        zIndexBase: 100 + selects.length - i,
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

  _createClass(Selects, [{
    key: "init",
    value: function init() {
      for (var i = 0; i < this.selectsArr.length; i += 1) {
        var _this$selectsArr$i = this.selectsArr[i],
          index = _this$selectsArr$i.index,
          select = _this$selectsArr$i.select,
          items = _this$selectsArr$i.items,
          zIndexBase = _this$selectsArr$i.zIndexBase;
        select.style.zIndex = zIndexBase;

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

  return Selects;
}();

var Tooltips = /*#__PURE__*/ function() {
  function Tooltips(tooltipTargets, tooltipClass, tooltipParent) {
    _classCallCheck(this, Tooltips);

    this.tooltipsArr = [];
    this.indent = 10;

    for (var i = 0; i < tooltipTargets.length; i += 1) {
      var parent = tooltipTargets[i].closest(tooltipParent);
      this.tooltipsArr.push({
        tg: tooltipTargets[i],
        tgCoords: Tooltips.getCoords(tooltipTargets[i]),
        ttp: null,
        ttpStatus: 'hide',
        ttpClass: tooltipClass,
        ttpContent: tooltipTargets[i].dataset.tooltipContent,
        ttpPosition: tooltipTargets[i].dataset.tooltipPosition,
        ttpPr: parent,
        prCoords: Tooltips.getCoords(parent)
      });
    }

    this.setListeners();
  }

  _createClass(Tooltips, [{
    key: "setListeners",
    value: function setListeners() {
      var _this5 = this;

      window.addEventListener('resize', function() {
        for (var i = 0; i < _this5.tooltipsArr.length; i += 1) {
          var _this5$tooltipsArr$i = _this5.tooltipsArr[i],
            tg = _this5$tooltipsArr$i.tg,
            ttpStatus = _this5$tooltipsArr$i.ttpStatus,
            ttpPr = _this5$tooltipsArr$i.ttpPr;
          _this5.tooltipsArr[i].tgCoords = Tooltips.getCoords(tg);
          _this5.tooltipsArr[i].prCoords = Tooltips.getCoords(ttpPr);
          if (ttpStatus === 'show') _this5.setTooltipCoords(i);
        }
      });

      var _loop2 = function _loop2(i) {
        _this5.tooltipsArr[i].tg.addEventListener('mouseover', function() {
          _this5.createTooltip(i);

          _this5.setTooltipCoords(i);

          _this5.showTooltip(i);
        });

        _this5.tooltipsArr[i].tg.addEventListener('mouseout', function() {
          _this5.destroyTooltip(i);

          _this5.tooltipsArr[i].ttpStatus = 'hide';
        });
      };

      for (var i = 0; i < this.tooltipsArr.length; i += 1) {
        _loop2(i);
      }
    }
  }, {
    key: "createTooltip",
    value: function createTooltip(index) {
      var _this$tooltipsArr$ind = this.tooltipsArr[index],
        ttpClass = _this$tooltipsArr$ind.ttpClass,
        ttpContent = _this$tooltipsArr$ind.ttpContent,
        ttpPosition = _this$tooltipsArr$ind.ttpPosition;
      var ttp = document.createElement('div');
      ttp.className = "".concat(ttpClass, " ").concat(ttpClass, "_").concat(ttpPosition);
      ttp.innerHTML = ttpContent;
      document.body.append(ttp);
      this.tooltipsArr[index].ttp = ttp;
    }
  }, {
    key: "setTooltipCoords",
    value: function setTooltipCoords(index) {
      var _this$tooltipsArr$ind2 = this.tooltipsArr[index],
        tgCoords = _this$tooltipsArr$ind2.tgCoords,
        ttp = _this$tooltipsArr$ind2.ttp,
        ttpPosition = _this$tooltipsArr$ind2.ttpPosition,
        prCoords = _this$tooltipsArr$ind2.prCoords;
      var tooltipLeftCoord;
      var tooltipTopCoord = tgCoords.top;

      if (ttpPosition === 'right') {
        var tooltipRight = tgCoords.right + ttp.offsetWidth + this.indent;
        var right = Math.min(tooltipRight, prCoords.right, document.documentElement.clientWidth);

        if (tgCoords.right + this.indent > right - ttp.offsetWidth) {
          tooltipLeftCoord = Math.max(tgCoords.left - ttp.offsetWidth - this.indent, prCoords.left);
        } else {
          tooltipLeftCoord = right - ttp.offsetWidth;
        }
      }

      if (ttpPosition === 'left') {
        var tooltipLeft = tgCoords.left - ttp.offsetWidth - this.indent;
        var left = Math.max(tooltipLeft, prCoords.left, 0);

        if (tgCoords.left < left + ttp.offsetWidth) {
          tooltipLeftCoord = tgCoords.right;
        } else {
          tooltipLeftCoord = left;
        }
      }

      ttp.style.left = "".concat(Math.round(tooltipLeftCoord), "px");
      ttp.style.top = "".concat(Math.round(tooltipTopCoord), "px");
    }
  }, {
    key: "showTooltip",
    value: function showTooltip(index) {
      this.setTooltipCoords(index);
      this.tooltipsArr[index].ttp.classList.add('active');
      this.tooltipsArr[index].ttpStatus = 'show';
    }
  }, {
    key: "destroyTooltip",
    value: function destroyTooltip(index) {
      var ttp = this.tooltipsArr[index].ttp;
      ttp.remove();
      ttp = null;
    }
  }], [{
    key: "getCoords",
    value: function getCoords(element) {
      var rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        left: rect.left + window.pageXOffset
      };
    }
  }]);

  return Tooltips;
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
  var tooltipObj;
  var navbar = document.querySelector('.navbar');
  var selects = document.querySelectorAll('[data-select]');
  var tooltipTargets = document.querySelectorAll('[data-tooltip-content]');
  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Selects(selects);
  if (tooltipTargets) tooltipObj = new Tooltips(tooltipTargets, 'tooltip', 'body');
  disableSubmitAction();
  return {
    navbarObj: navbarObj,
    selectObg: selectObg,
    tooltipObj: tooltipObj
  };
};