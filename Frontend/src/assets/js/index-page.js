
const sideNav = document.getElementById('#divSidenav');
const sidebarToggle = sideNav.querySelector('#sidebarToggle');
if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
    if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        sideNav.classList.toggle('sb-sidenav-toggled');
    }
    sidebarToggle.addEventListener('click', event => {
        // event.preventDefault();
        sideNav.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', sideNav.classList.contains('sb-sidenav-toggled'));
    });
}