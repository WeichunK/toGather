// const search = document.querySelector('.input-group-text')
// search.addEventListener('change', (event) => {
//     if (Boolean(event.target.value.trim())) {
//         console.log('change')
//         // window.location.replace(`http://localhost:3000/index.html?search=${event.target.value}`)
//         window.location.href = `/index.html?search=${event.target.value}`

//     } else {
//         // window.location.replace(`http://localhost:3000/index.html`)
//         window.location.href = '/index.html'
//     }

// });




// const cancelSearch = document.querySelector('.sibling-B')
// cancelSearch.addEventListener('click', (event) => {

//     // window.location.replace(`http://localhost:3000/index.html`)
//     window.location.href = '/index.html'


// });



const searchButton = document.getElementById('searchbutton');
const searchInput = document.getElementById('search');
searchButton.addEventListener('click', () => {
    console.log('searchInput', searchInput.value)
    const inputValue = searchInput.value;
    // alert(inputValue);

    if (Boolean(searchInput.value.trim())) {
        console.log('change')
        // window.location.replace(`http://localhost:3000/index.html?search=${event.target.value}`)
        console.log('url', '/index.html?search=' + searchInput.value)
        console.log(window.location.search)
        window.location.href = `/index.html?search=${searchInput.value}`
        // window.location = `/index.html?search=吃`


    } else {
        // window.location.replace(`http://localhost:3000/index.html`)
        window.location.href = '/index.html'
    }




});