


document.getElementById("navbarDropdownMenuLink").addEventListener('click', () => {
    if (!localStorage.getItem('token')) {
        document.getElementsByClassName('dropdown-sign')[0].style = "display: block;"
        let sign = document.getElementsByClassName('dropdown-signed')
        for (i = 0; i < sign.length; i++) {
            sign[i].style.display = "none";
        }

    } else {
        document.getElementsByClassName('dropdown-sign')[0].style = "display: none;"
        let signed = document.getElementsByClassName('dropdown-signed')
        for (i = 0; i < signed.length; i++) {
            signed[i].style.display = "block";
        }

    }

})

document.getElementById("signout").addEventListener('click', () => {
    localStorage.removeItem("token")

    Swal.fire({
        title: 'Success!',
        text: '已將您登出',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(function () {
        window.location.href = '/sign.html';
    })

})
