
const sideNav = document.getElementById('#divSidenav');
const sidebarToggle = sideNav.querySelector('#sidebarToggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
        // event.preventDefault();
        sideNav.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', sideNav.classList.contains('sb-sidenav-toggled'));
    });
}