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
  }

  setListeners() {
    this.buttonNav.addEventListener('click', () => { this.toggleNavState(); });
  }

  toggleNavState() {
    if (!this.isVisibleNav) {
      this.isVisibleNav = true;
    } else {
      this.isVisibleNav = false;
    }

    requestAnimationFrame(() => {
      this.body.classList.toggle('active');
    });
  }
}

window.onload = () => {
  let navbarObj;

  const navbar = document.querySelector('.navbar');

  if (navbar) navbarObj = new Navbar(navbar);

  return { navbarObj };
};
