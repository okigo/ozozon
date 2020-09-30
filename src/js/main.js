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
        button,
        buttonText: selects[i].querySelector('.select__button-text'),
        selectTarget,
        target,
        list: selects[i].querySelector('.select__list'),
        items: selects[i].querySelectorAll('.select__item'),
      });
    }
  }
}

window.onload = () => {
  let navbarObj;
  let selectObg;

  const navbar = document.querySelector('.navbar');
  const selects = document.querySelectorAll('[data-select]');

  if (navbar) navbarObj = new Navbar(navbar);
  if (selects) selectObg = new Select(selects);

  return { navbarObj, selectObg };
};
