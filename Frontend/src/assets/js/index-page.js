sideNav = document.getElementById('#divSidenav');
sidebarToggle = sideNav.querySelector('#sidebarToggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
        event.preventDefault();
        sideNav.classList.toggle('sb-sidenav-toggled');
    });
}