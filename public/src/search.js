const search = document.querySelector('.search')
search.addEventListener('change', (event) => {
    if (Boolean(event.target.value.trim())) {
        console.log('change')
        // window.location.replace(`http://localhost:3000/index.html?search=${event.target.value}`)
        window.location.href = `http://localhost:3000/index.html?search=${event.target.value}`

    } else {
        // window.location.replace(`http://localhost:3000/index.html`)
        window.location.href = 'http://localhost:3000/index.html'
    }

});


