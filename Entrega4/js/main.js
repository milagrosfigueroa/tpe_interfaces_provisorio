// Profile dropdown toggle
const profileButton = document.getElementById('profileButton');
const profileDropdown = document.getElementById('profileDropdown');

profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    hamburgerDropdown.classList.remove('active');
});

// Hamburger dropdown toggle
const hamburgerButton = document.getElementById('hamburgerButton');
const hamburgerDropdown = document.getElementById('hamburgerDropdown');

hamburgerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerDropdown.classList.toggle('active');
    profileDropdown.classList.remove('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
    if (!hamburgerDropdown.contains(e.target) && !hamburgerButton.contains(e.target)) {
        hamburgerDropdown.classList.remove('active');
    }
});

// Prevent dropdown from closing when clicking inside
profileDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
});

hamburgerDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
});

