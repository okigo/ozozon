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
// -- Disable submit form action -- //
function disableSubmitAction() {
  var buttons = document.querySelectorAll('*[type=submit]');

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', function(e) {
      e.preventDefault();
    });
  }
} // -- Navbar -- //


var Navbar = /*#__PURE__*/ function() {
  function Navbar(navbar) {
    _classCallCheck(this, Navbar);

    this.navbar = navbar;
    this.buttonNav = this.navbar.querySelector('.button-nav');
    this.body = document.querySelector('body');
    this.setConfig();
    this.setListeners();
    this.setSticky();
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
      window.addEventListener('scroll', function() {
        _this.setSticky();
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
    key: "setSticky",
    value: function setSticky() {
      if (window.pageYOffset > 0) {
        this.navbar.classList.add('sticky-in');
      } else {
        this.navbar.classList.remove('sticky-in');
      }
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
      this.selectsArr.push({
        index: i,
        select: selects[i],
        zIndexBase: 100 + selects.length - i,
        button: button,
        buttonText: selects[i].querySelector('.select__button-text'),
        selectTarget: button.dataset.selectTarget,
        target: document.getElementById(button.dataset.selectTarget),
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
}(); // -- Tooltips -- //


var Tooltips = /*#__PURE__*/ function() {
  function Tooltips(tooltipTargets, tooltipClass, tooltipParent) {
    _classCallCheck(this, Tooltips);

    this.tooltipsArr = [];
    this.indent = 10;

    for (var i = 0; i < tooltipTargets.length; i += 1) {
      var parent = tooltipTargets[i].closest(tooltipParent);
      this.tooltipsArr.push({
        tg: tooltipTargets[i],
        tgCoords: null,
        ttp: null,
        ttpCoords: null,
        ttpClass: tooltipClass,
        ttpContent: tooltipTargets[i].dataset.tooltipContent,
        ttpPosition: tooltipTargets[i].dataset.tooltipPosition,
        ttpPr: parent,
        prCoords: null
      });
      this.getBaseCoords(i);
    }

    this.setListeners();
  }

  _createClass(Tooltips, [{
    key: "setListeners",
    value: function setListeners() {
      var _this5 = this;

      window.addEventListener('resize', function() {
        for (var i = 0; i < _this5.tooltipsArr.length; i += 1) {
          var ttp = _this5.tooltipsArr[i].ttp;

          if (ttp !== null) {
            _this5.getBaseCoords(i);

            _this5.calculateTooltipCoords(i);

            _this5.compensateTooltipCoords(i);

            _this5.setTooltipCoords(i);
          }
        }
      });

      var _loop2 = function _loop2(i) {
        _this5.tooltipsArr[i].tg.addEventListener('mouseover', function() {
          _this5.showTooltip(i);
        });

        _this5.tooltipsArr[i].tg.addEventListener('mouseout', function() {
          _this5.destroyTooltip(i);
        });
      };

      for (var i = 0; i < this.tooltipsArr.length; i += 1) {
        _loop2(i);
      }
    }
  }, {
    key: "getBaseCoords",
    value: function getBaseCoords(index) {
      var _this$tooltipsArr$ind = this.tooltipsArr[index],
        tg = _this$tooltipsArr$ind.tg,
        ttpPr = _this$tooltipsArr$ind.ttpPr;
      var targetBaseCoords = Tooltips.getCoords(tg);
      var parentBaseCoords = Tooltips.getCoords(ttpPr);
      var targetCompensateCoords = {
        top: targetBaseCoords.top,
        right: targetBaseCoords.right + this.indent,
        bottom: targetBaseCoords.bottom,
        left: targetBaseCoords.left - this.indent
      };
      var parentCompensateCoords = {
        top: Math.max(window.pageYOffset, parentBaseCoords.top),
        right: Math.min(document.documentElement.clientWidth, parentBaseCoords.right),
        bottom: Math.min(window.pageYOffset + document.documentElement.clientHeight, parentBaseCoords.bottom),
        left: Math.max(0, parentBaseCoords.left)
      };
      this.tooltipsArr[index].tgCoords = targetCompensateCoords;
      this.tooltipsArr[index].prCoords = parentCompensateCoords;
    }
  }, {
    key: "createTooltip",
    value: function createTooltip(index) {
      var _this$tooltipsArr$ind2 = this.tooltipsArr[index],
        ttpClass = _this$tooltipsArr$ind2.ttpClass,
        ttpContent = _this$tooltipsArr$ind2.ttpContent,
        ttpPosition = _this$tooltipsArr$ind2.ttpPosition;
      var ttp = document.createElement('div');
      ttp.className = "".concat(ttpClass, " ").concat(ttpClass, "_").concat(ttpPosition);
      ttp.innerHTML = ttpContent;
      document.body.append(ttp);
      this.tooltipsArr[index].ttp = ttp;
    }
  }, {
    key: "calculateTooltipCoords",
    value: function calculateTooltipCoords(index) {
      var _this$tooltipsArr$ind3 = this.tooltipsArr[index],
        tgCoords = _this$tooltipsArr$ind3.tgCoords,
        ttp = _this$tooltipsArr$ind3.ttp,
        ttpPosition = _this$tooltipsArr$ind3.ttpPosition;
      var ttpCoords = {};

      if (ttpPosition === 'right') {
        ttpCoords = {
          top: tgCoords.top,
          right: tgCoords.right + ttp.offsetWidth,
          bottom: tgCoords.top + ttp.offsetHeight,
          left: tgCoords.right
        };
      }

      if (ttpPosition === 'left') {
        ttpCoords = {
          top: tgCoords.top,
          right: tgCoords.left,
          bottom: tgCoords.top + ttp.offsetHeight,
          left: tgCoords.left - ttp.offsetWidth
        };
      }

      this.tooltipsArr[index].ttpCoords = ttpCoords;
    }
  }, {
    key: "compensateTooltipCoords",
    value: function compensateTooltipCoords(index) {
      var _this$tooltipsArr$ind4 = this.tooltipsArr[index],
        tgCoords = _this$tooltipsArr$ind4.tgCoords,
        ttp = _this$tooltipsArr$ind4.ttp,
        ttpCoords = _this$tooltipsArr$ind4.ttpCoords,
        prCoords = _this$tooltipsArr$ind4.prCoords;

      if (ttpCoords.top < prCoords.top) {
        ttpCoords.top = prCoords.top;
      }

      if (ttpCoords.bottom > prCoords.bottom) {
        ttpCoords.top = Math.max(prCoords.bottom - ttp.offsetHeight, prCoords.top);
      }

      if (ttpCoords.left < prCoords.left) {
        ttpCoords.left = prCoords.left;
      }

      if (ttpCoords.right > prCoords.right) {
        ttpCoords.left = Math.max(tgCoords.left - ttp.offsetWidth, prCoords.left);
      }
    }
  }, {
    key: "setTooltipCoords",
    value: function setTooltipCoords(index) {
      var _this$tooltipsArr$ind5 = this.tooltipsArr[index],
        ttp = _this$tooltipsArr$ind5.ttp,
        ttpCoords = _this$tooltipsArr$ind5.ttpCoords;
      ttp.style.left = "".concat(Math.round(ttpCoords.left), "px");
      ttp.style.top = "".concat(Math.round(ttpCoords.top), "px");
    }
  }, {
    key: "showTooltip",
    value: function showTooltip(index) {
      var _this6 = this;

      requestAnimationFrame(function() {
        _this6.getBaseCoords(index);

        _this6.createTooltip(index);

        _this6.calculateTooltipCoords(index);

        _this6.compensateTooltipCoords(index);

        _this6.setTooltipCoords(index);

        _this6.tooltipsArr[index].ttp.classList.add('active');
      });
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
}(); // -- Slider -- //


var Slider = /*#__PURE__*/ function() {
  function Slider(slider, activeItem) {
    _classCallCheck(this, Slider);

    this.slideIndex = activeItem;
    var sliderId = slider.dataset.slider;
    var sliderItems = document.querySelector("[data-slider-items=".concat(sliderId, "]"));
    var sliderPrev = document.querySelector("[data-slider-prev=".concat(sliderId, "]")) || false;
    var sliderNext = document.querySelector("[data-slider-next=".concat(sliderId, "]")) || false;
    var sliderIndicators = document.querySelector("[data-slider-indicators=".concat(sliderId, "]")) || false;
    var slideTo;

    if (sliderIndicators) {
      slideTo = sliderIndicators.querySelectorAll('[data-slide-to]');
    } else {
      slideTo = false;
    }

    this.conf = {
      sl: slider,
      slId: sliderId,
      slIts: sliderItems,
      slSlds: sliderItems.querySelectorAll('[data-slider-slide]'),
      slPrev: sliderPrev,
      slNext: sliderNext,
      slInds: sliderIndicators,
      slTo: slideTo
    };
    this.slideOffset = this.conf.slSlds[0].offsetWidth;
    this.setListeners();
    this.toggleSlide(this.slideIndex);
  }

  _createClass(Slider, [{
    key: "setListeners",
    value: function setListeners() {
      var _this7 = this;

      var _this$conf = this.conf,
        slPrev = _this$conf.slPrev,
        slNext = _this$conf.slNext,
        slTo = _this$conf.slTo;

      if (slPrev) {
        slPrev.addEventListener('click', function() {
          requestAnimationFrame(function() {
            _this7.toggleSlide(_this7.slideIndex -= 1);
          });
        });
      }

      if (slNext) {
        slNext.addEventListener('click', function() {
          requestAnimationFrame(function() {
            _this7.toggleSlide(_this7.slideIndex += 1);
          });
        });
      }

      if (slTo) {
        var _loop3 = function _loop3(i) {
          slTo[i].addEventListener('click', function() {
            requestAnimationFrame(function() {
              _this7.slideIndex = parseInt(slTo[i].dataset.slideTo, 10);

              _this7.toggleSlide(_this7.slideIndex);
            });
          });
        };

        for (var i = 0; i < slTo.length; i += 1) {
          _loop3(i);
        }
      }

      window.addEventListener('resize', function() {
        _this7.slideOffset = _this7.conf.slSlds[0].offsetWidth;

        _this7.shiftItemsWrapper();
      });
    }
  }, {
    key: "toggleSlide",
    value: function toggleSlide(n) {
      var _this$conf2 = this.conf,
        slSlds = _this$conf2.slSlds,
        slTo = _this$conf2.slTo;
      if (n >= slSlds.length) this.slideIndex = 0;
      if (n < 0) this.slideIndex = slSlds.length - 1;

      for (var i = 0; i < slSlds.length; i += 1) {
        slSlds[i].classList.remove('show');
      }

      if (slTo) {
        for (var _i = 0; _i < slTo.length; _i += 1) {
          slTo[_i].classList.remove('active');
        }
      }

      this.shiftItemsWrapper();
      slSlds[this.slideIndex].classList.add('show');
      if (slTo) slTo[this.slideIndex].classList.add('active');
    }
  }, {
    key: "shiftItemsWrapper",
    value: function shiftItemsWrapper() {
      var slIts = this.conf.slIts;
      var shift = this.slideIndex * -this.slideOffset;
      slIts.style.cssText = "transform: translateX(".concat(shift, "px);");
    }
  }]);

  return Slider;
}();

window.onload = function() {
  var navbarObj;
  var selectObg;
  var tooltipObj;
  var sliderCleaningObj;
  var sliderQuestionsObj;
  var sliderReviewsObj;
  var navbar = document.querySelector('.navbar');
  var selects = document.querySelectorAll('[data-select]');
  var tooltipTargets = document.querySelectorAll('[data-tooltip-content]');
  var sliderCleaning = document.querySelector('[data-slider="slider-cleaning"]');
  var sliderQuestions = document.querySelector('[data-slider="slider-questions"]');
  var sliderReviews = document.querySelector('[data-slider="slider-reviews"]');
  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Selects(selects);
  if (tooltipTargets) tooltipObj = new Tooltips(tooltipTargets, 'tooltip', '.image-map');
  if (sliderCleaning) sliderCleaningObj = new Slider(sliderCleaning, 3);
  if (sliderQuestions) sliderQuestionsObj = new Slider(sliderQuestions, 1);
  if (sliderReviews) sliderReviewsObj = new Slider(sliderReviews, 0);
  disableSubmitAction();
  return {
    navbarObj: navbarObj,
    selectObg: selectObg,
    tooltipObj: tooltipObj,
    sliderCleaningObj: sliderCleaningObj,
    sliderQuestionsObj: sliderQuestionsObj,
    sliderReviewsObj: sliderReviewsObj
  };
};