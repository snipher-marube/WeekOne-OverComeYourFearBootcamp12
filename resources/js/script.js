const mql = window.matchMedia("(min-width: 992px)");
const navLinks = document.querySelectorAll(
  "header nav.navbar ul.navbar-nav .nav-link"
);

noNavItemHoverOnLgScreen();

window.onresize = () => {
  noNavItemHoverOnLgScreen();
};

// Conditionally add active classname to nav links matching current open page
const navLinksToArray = Array.from(navLinks); // converting to array
const pathname = window.location.pathname;

// Regular expressions to detect current page
const homePageRegex = /\/index((\.html|\.htm)#?)?$/;
const aboutPageRegex = /\/about((\.html|\.htm)#?)?$/;
const teamPageRegex = /\/team((\.html|\.htm)#?)?$/;

if (homePageRegex.test(pathname))
  navLinksToArray[0].classList.add(["currentopen"]);
if (aboutPageRegex.test(pathname))
  navLinksToArray[1].classList.add(["currentopen"]);
if (teamPageRegex.test(pathname))
  navLinksToArray[2].classList.add(["currentopen"]);

// Disable hover on navItems when in large ViewPort
function noNavItemHoverOnLgScreen() {
  const monitoredNavItem = document.querySelectorAll("header nav li.nav-item");
  const monitoredNavItemToArr = Array.from(monitoredNavItem);

  if (mql.matches) {
    console.log("it matches");

    monitoredNavItemToArr.forEach((item) => {
      item.classList.add(["hover-not"]);
    });
  } else {
    console.log("it DOES NOT matches");

    monitoredNavItemToArr.forEach((item) => {
      item.classList.remove(["hover-not"]);
    });
  }
}
