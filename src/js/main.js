// http://localhost:3000/
// http://192.168.0.11:3000/
// /*eslint-disable */

// -- Navbar -- //
class Navbar {
  constructor(navbar) {
    this.navbar = navbar;
    this.buttonNav = this.navbar.querySelector('.button-nav');
    this.body = document.querySelector('body');

    this.setConfig();
    this.setListeners();
  }

  setConfig() {
    this.isVisibleNav = false;
    this.isAnimation = false;
    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
  }

  setListeners() {
    window.addEventListener('resize', () => { this.setResizeProperties(); });

    this.buttonNav.addEventListener('click', () => { this.toggleNavState(); });
  }

  setResizeProperties() {
    if (this.isVisibleNav) return;

    this.scrollWidth = window.innerWidth - document.documentElement.clientWidth;
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

// -- Select -- //
class Select {
  constructor(selects) {
    this.selectsArr = [];

    for (let i = 0; i < selects.length; i += 1) {
      const button = selects[i].querySelector('.select__button');
      const { selectTarget } = button.dataset;
      const target = document.getElementById(selectTarget);

      this.selectsArr.push({
        index: i,
        select: selects[i],
        zIndexBase: (100 + selects.length) - i,
        button,
        buttonText: selects[i].querySelector('.select__button-text'),
        selectTarget,
        target,
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

function disableSubmitAction() {
  const buttons = document.querySelectorAll('*[type=submit]');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (e) => { e.preventDefault(); });
  }
}

window.onload = () => {
  let navbarObj;
  let selectObg;
  let imageMapObj;

  const navbar = document.querySelector('.navbar');
  const selects = document.querySelectorAll('[data-select]');

  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Select(selects);

  disableSubmitAction();

  return { navbarObj, selectObg, imageMapObj };
};
