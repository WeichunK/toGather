const search = document.querySelector('.search')
search.addEventListener('change', (event) => {
    if (Boolean(event.target.value.trim())) {
        console.log('change')
        window.location.replace(`http://localhost:3000/test.html?search=${event.target.value}`)

    } else {
        window.location.replace(`http://localhost:3000/test.html`)
    }

});