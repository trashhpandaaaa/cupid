(fucntion () {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if(token) {
        window.location.href = "discover.html";
    } else { 
        window.location.href = "location.html";
    }
})();
