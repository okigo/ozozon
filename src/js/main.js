// http://localhost:3000/
// http://192.168.0.11:3000/
// /*eslint-disable */

// -- Disable submit form action -- //
function disableSubmitAction() {
  const buttons = document.querySelectorAll('*[type=submit]');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (e) => { e.preventDefault(); });
  }
}

// -- Navbar -- //
class Navbar {
  constructor(navbar) {
    this.navbar = navbar;
    this.buttonNav = this.navbar.querySelector('.button-nav');
    this.body = document.querySelector('body');

    this.setConfig();
    this.setListeners();
    this.setSticky();
  }

  setConfig() {
    this.isVisibleNav = false;
    this.isAnimation = false;
    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
  }

  setListeners() {
    window.addEventListener('resize', () => { this.setResizeProperties(); });

    window.addEventListener('scroll', () => { this.setSticky(); });

    this.buttonNav.addEventListener('click', () => { this.toggleNavState(); });
  }

  setResizeProperties() {
    if (this.isVisibleNav) return;

    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
  }

  setSticky() {
    if (window.pageYOffset > 0) {
      this.navbar.classList.add('sticky-in');
    } else {
      this.navbar.classList.remove('sticky-in');
    }
  }

  toggleNavState() {
    if (this.isAnimation) return;

    if (!this.isVisibleNav) {
      this.isVisibleNav = true;
    } else {
      this.isVisibleNav = false;
    }

    requestAnimationFrame(() => {
      this.toggleNav();
    });
  }

  toggleNav() {
    const handler = (e) => {
      if (e.animationName === 'navOut') {
        this.body.classList.remove('nav-in');
        this.body.classList.remove('nav-out');
        this.scrollWidthCompensate(false);
      }

      this.navbar.removeEventListener('animationend', handler);
      this.isAnimation = false;
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

  scrollWidthCompensate(isCompensate) {
    if (isCompensate) {
      const navbarPaddingRight = parseInt(getComputedStyle(this.navbar).paddingRight, 10);
      this.body.style.paddingRight = `${this.scrollWidth}px`;
      this.navbar.style.paddingRight = `${this.scrollWidth + navbarPaddingRight}px`;
    } else {
      this.body.style.cssText = '';
      this.navbar.style.cssText = '';
    }
  }
}

// -- Selects -- //
class Selects {
  constructor(selects) {
    this.selectsArr = [];

    for (let i = 0; i < selects.length; i += 1) {
      const button = selects[i].querySelector('.select__button');

      this.selectsArr.push({
        index: i,
        select: selects[i],
        zIndexBase: (100 + selects.length) - i,
        button,
        buttonText: selects[i].querySelector('.select__button-text'),
        selectTarget: button.dataset.selectTarget,
        target: document.getElementById(button.dataset.selectTarget),
        items: selects[i].querySelectorAll('.select__item'),
      });
    }

    this.setListeners();
    this.init();
  }

  init() {
    for (let i = 0; i < this.selectsArr.length; i += 1) {
      const {
        index,
        select,
        items,
        zIndexBase,
      } = this.selectsArr[i];

      select.style.zIndex = zIndexBase;

      for (let c = 0; c < items.length; c += 1) {
        if (items[c].classList.contains('select__item_active')) {
          this.toggleItem(index, items[c]);
        }
      }
    }
  }

  setListeners() {
    for (let i = 0; i < this.selectsArr.length; i += 1) {
      const { index, button, items } = this.selectsArr[i];

      button.addEventListener('click', (e) => {
        e.preventDefault();
        requestAnimationFrame(() => {
          this.toggleSelect(index);
        });
      });

      for (let c = 0; c < items.length; c += 1) {
        items[c].addEventListener('click', (e) => {
          e.preventDefault();
          requestAnimationFrame(() => {
            this.toggleItem(index, e.target);
            this.toggleSelect(index);
          });
        });
      }
    }
  }

  toggleSelect(index) {
    const { select } = this.selectsArr[index];

    select.classList.toggle('select_active');
  }

  toggleItem(index, activeItem) {
    const { items, buttonText, target } = this.selectsArr[index];

    buttonText.textContent = activeItem.textContent;
    if (target) target.value = activeItem.textContent;

    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === activeItem) {
        items[i].classList.add('select__item_active');
      } else {
        items[i].classList.remove('select__item_active');
      }
    }
  }
}

// -- Tooltips -- //
class Tooltips {
  constructor(tooltipTargets, tooltipClass, tooltipParent) {
    this.tooltipsArr = [];
    this.indent = 10;

    for (let i = 0; i < tooltipTargets.length; i += 1) {
      const parent = tooltipTargets[i].closest(tooltipParent);

      this.tooltipsArr.push({
        tg: tooltipTargets[i],
        tgCoords: null,
        ttp: null,
        ttpCoords: null,
        ttpClass: tooltipClass,
        ttpContent: tooltipTargets[i].dataset.tooltipContent,
        ttpPosition: tooltipTargets[i].dataset.tooltipPosition,
        ttpPr: parent,
        prCoords: null,
      });

      this.getBaseCoords(i);
    }

    this.setListeners();
  }

  static getCoords(element) {
    const rect = element.getBoundingClientRect();

    return {
      top: rect.top + window.pageYOffset,
      right: rect.right + window.pageXOffset,
      bottom: rect.bottom + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    };
  }

  setListeners() {
    window.addEventListener('resize', () => {
      for (let i = 0; i < this.tooltipsArr.length; i += 1) {
        const { ttp } = this.tooltipsArr[i];

        if (ttp !== null) {
          this.getBaseCoords(i);
          this.calculateTooltipCoords(i);
          this.compensateTooltipCoords(i);
          this.setTooltipCoords(i);
        }
      }
    });

    for (let i = 0; i < this.tooltipsArr.length; i += 1) {
      this.tooltipsArr[i].tg.addEventListener('mouseover', () => {
        this.showTooltip(i);
      });

      this.tooltipsArr[i].tg.addEventListener('mouseout', () => {
        this.destroyTooltip(i);
      });
    }
  }

  getBaseCoords(index) {
    const { tg, ttpPr } = this.tooltipsArr[index];

    const targetBaseCoords = Tooltips.getCoords(tg);
    const parentBaseCoords = Tooltips.getCoords(ttpPr);

    const targetCompensateCoords = {
      top: targetBaseCoords.top,
      right: targetBaseCoords.right + this.indent,
      bottom: targetBaseCoords.bottom,
      left: targetBaseCoords.left - this.indent,
    };

    const parentCompensateCoords = {
      top: Math.max(window.pageYOffset, parentBaseCoords.top),
      right: Math.min(document.documentElement.clientWidth, parentBaseCoords.right),
      bottom: Math.min(window.pageYOffset + document.documentElement.clientHeight, parentBaseCoords.bottom),
      left: Math.max(0, parentBaseCoords.left),
    };

    this.tooltipsArr[index].tgCoords = targetCompensateCoords;
    this.tooltipsArr[index].prCoords = parentCompensateCoords;
  }

  createTooltip(index) {
    const { ttpClass, ttpContent, ttpPosition } = this.tooltipsArr[index];

    const ttp = document.createElement('div');
    ttp.className = `${ttpClass} ${ttpClass}_${ttpPosition}`;
    ttp.innerHTML = ttpContent;
    document.body.append(ttp);

    this.tooltipsArr[index].ttp = ttp;
  }

  calculateTooltipCoords(index) {
    const {
      tgCoords,
      ttp,
      ttpPosition,
    } = this.tooltipsArr[index];

    let ttpCoords = {};

    if (ttpPosition === 'right') {
      ttpCoords = {
        top: tgCoords.top,
        right: tgCoords.right + ttp.offsetWidth,
        bottom: tgCoords.top + ttp.offsetHeight,
        left: tgCoords.right,
      };
    }

    if (ttpPosition === 'left') {
      ttpCoords = {
        top: tgCoords.top,
        right: tgCoords.left,
        bottom: tgCoords.top + ttp.offsetHeight,
        left: tgCoords.left - ttp.offsetWidth,
      };
    }

    this.tooltipsArr[index].ttpCoords = ttpCoords;
  }

  compensateTooltipCoords(index) {
    const {
      tgCoords,
      ttp,
      ttpCoords,
      prCoords,
    } = this.tooltipsArr[index];

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

  setTooltipCoords(index) {
    const { ttp, ttpCoords } = this.tooltipsArr[index];

    ttp.style.left = `${Math.round(ttpCoords.left)}px`;
    ttp.style.top = `${Math.round(ttpCoords.top)}px`;
  }

  showTooltip(index) {
    requestAnimationFrame(() => {
      this.getBaseCoords(index);
      this.createTooltip(index);
      this.calculateTooltipCoords(index);
      this.compensateTooltipCoords(index);
      this.setTooltipCoords(index);
      this.tooltipsArr[index].ttp.classList.add('active');
    });
  }

  destroyTooltip(index) {
    let { ttp } = this.tooltipsArr[index];
    ttp.remove();
    ttp = null;
  }
}

// -- Slider -- //
class Slider {
  constructor(slider, activeItem) {
    this.slideIndex = activeItem;

    const sliderId = slider.dataset.slider;
    const sliderItems = document.querySelector(`[data-slider-items=${sliderId}]`);
    const sliderPrev = document.querySelector(`[data-slider-prev=${sliderId}]`) || false;
    const sliderNext = document.querySelector(`[data-slider-next=${sliderId}]`) || false;
    const sliderIndicators = document.querySelector(`[data-slider-indicators=${sliderId}]`) || false;
    let slideTo;

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
      slTo: slideTo,
    };

    this.slideOffset = this.conf.slSlds[0].offsetWidth;

    this.setListeners();
    this.toggleSlide(this.slideIndex);
  }

  setListeners() {
    const { slPrev, slNext, slTo } = this.conf;

    if (slPrev) {
      slPrev.addEventListener('click', () => {
        requestAnimationFrame(() => {
          this.toggleSlide(this.slideIndex -= 1);
        });
      });
    }

    if (slNext) {
      slNext.addEventListener('click', () => {
        requestAnimationFrame(() => {
          this.toggleSlide(this.slideIndex += 1);
        });
      });
    }

    if (slTo) {
      for (let i = 0; i < slTo.length; i += 1) {
        slTo[i].addEventListener('click', () => {
          requestAnimationFrame(() => {
            this.slideIndex = parseInt(slTo[i].dataset.slideTo, 10);
            this.toggleSlide(this.slideIndex);
          });
        });
      }
    }

    window.addEventListener('resize', () => {
      this.slideOffset = this.conf.slSlds[0].offsetWidth;
      this.shiftItemsWrapper();
    });
  }

  toggleSlide(n) {
    const { slSlds, slTo } = this.conf;

    if (n >= slSlds.length) this.slideIndex = 0;
    if (n < 0) this.slideIndex = slSlds.length - 1;

    for (let i = 0; i < slSlds.length; i += 1) {
      slSlds[i].classList.remove('show');
    }

    if (slTo) {
      for (let i = 0; i < slTo.length; i += 1) {
        slTo[i].classList.remove('active');
      }
    }

    this.shiftItemsWrapper();

    slSlds[this.slideIndex].classList.add('show');
    if (slTo) slTo[this.slideIndex].classList.add('active');
  }

  shiftItemsWrapper() {
    const { slIts } = this.conf;

    const shift = this.slideIndex * -this.slideOffset;

    slIts.style.cssText = `transform: translateX(${shift}px);`;
  }
}

window.onload = () => {
  let navbarObj;
  let selectObg;
  let tooltipObj;
  let sliderCleaningObj;
  let sliderQuestionsObj;
  let sliderReviewsObj;

  const navbar = document.querySelector('.navbar');
  const selects = document.querySelectorAll('[data-select]');
  const tooltipTargets = document.querySelectorAll('[data-tooltip-content]');
  const sliderCleaning = document.querySelector('[data-slider="slider-cleaning"]');
  const sliderQuestions = document.querySelector('[data-slider="slider-questions"]');
  const sliderReviews = document.querySelector('[data-slider="slider-reviews"]');

  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Selects(selects);
  if (tooltipTargets) tooltipObj = new Tooltips(tooltipTargets, 'tooltip', '.image-map');
  if (sliderCleaning) sliderCleaningObj = new Slider(sliderCleaning, 3);
  if (sliderQuestions) sliderQuestionsObj = new Slider(sliderQuestions, 1);
  if (sliderReviews) sliderReviewsObj = new Slider(sliderReviews, 0);

  disableSubmitAction();

  return {
    navbarObj,
    selectObg,
    tooltipObj,
    sliderCleaningObj,
    sliderQuestionsObj,
    sliderReviewsObj,
  };
};
