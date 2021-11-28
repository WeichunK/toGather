

document.getElementById("hostbutton").addEventListener('click', () => {
    if (!localStorage.getItem('token')) {

        Swal.fire({
            title: 'Error!',
            text: '請先登入',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {
            window.location.href = '/sign.html'
        })

    }
})


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
        window.location.href = '/sign.html'
    })
})


document.getElementById("gathering-list").addEventListener('click', async (event) => {

    let targetClassName;
    let targetId;
    targetClassName = event.target.className
    targetId = event.target.getAttribute('idvalue')


    let response
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText)
            // response = xhr.responseText;
            console.log(response)
        }
    }

    const accessToken = localStorage.getItem("token")

    function sendAJAX(accessToken) {
        xhr.open('GET', `/api/1.0/tracking/clickGatheringList?id=${targetId}`)
        if (accessToken) {
            // console.log('accessToken: ', accessToken)
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        }
        xhr.send()
    }

    sendAJAX(accessToken)

})



function onClick(form) {
    // console.log('type of form', typeof (form))
    // console.log('form.title.value', form.title.value)
    let dataToSent = new FormData(form)

    for (let pair of dataToSent.entries()) {
        console.log("pair", pair)
    }

    if (new Date(document.getElementById("start_at").value) <= new Date()) {
        Swal.fire({
            title: 'Error!',
            text: '時間不可早於現在',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {

        })
        return false;
    }

    if (!document.getElementById("main_image").files[0]) {
        Swal.fire({
            title: 'Error!',
            text: '圖片不可為空',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {
            // return false;
        })
        return false;
    }

    console.log('document.getElementById("main_image").files[0].size', document.getElementById("main_image").files[0].size)
    if (document.getElementById("main_image").files[0].size > 2 * 1024 * 1024) {
        Swal.fire({
            title: 'Error!',
            text: '圖片尺寸過大',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {

        })
        return false;
    }

    // console.log(document.getElementsByName("county")[0])
    // console.log(document.getElementsByName("county")[0].value)

    if (!Boolean(document.getElementsByName("county")[0].value.trim())) {
        Swal.fire({
            title: 'Error!',
            text: '請選擇縣市',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {

        })
        return false;
    }

    if (!Boolean(document.getElementsByName("district")[0].value.trim())) {
        Swal.fire({
            title: 'Error!',
            text: '請選擇區域',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {

        })
        return false;
    }
    // console.log('document.getElementById("place").value', document.getElementById("place").value)
    // console.log('document.getElementById("place").value.trim()', document.getElementById("place").value.trim())

    if (!Boolean(document.getElementById("place").value.trim())) {
        Swal.fire({
            title: 'Error!',
            text: '請輸入位置',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(function () {

        })
        return false;
    }

    if (localStorage.getItem('token')) {
        var jwt = localStorage.getItem('token')
        // console.log('JWT', jwt)
        // alert("資料格式正確，即將為您建檔！");
    } else {
        alert('請先登入')
        window.location.href = '/admin/signIn.html'
    }
    // console.log("dataToSent", dataToSent)
    const accessToken = localStorage.getItem("token");

    let xhr = new XMLHttpRequest();
    let url = '/api/1.0/gatherings/hostgathering';
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('apiResponse.data', xhr.responseText)

            Swal.fire({
                title: 'Success!',
                text: '活動創建成功，活動結束1日內(至少需有1人參加)，30獎勵積點將發放至您的帳戶',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })

        } else if (JSON.parse(xhr.responseText).error == 'wrong time!') {
            console.log('xhr.responseText', xhr.responseText)
            Swal.fire({
                title: 'Error!',
                text: '時間輸入錯誤',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })
        } else if (JSON.parse(xhr.responseText).error == 'Exceed the length limit!') {
            console.log('xhr.responseText', xhr.responseText)
            Swal.fire({
                title: 'Error!',
                text: 'title 描述 或 地址 長度過長',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })
        } else if (JSON.parse(xhr.responseText).error == 'Max Participant less than 1!') {
            console.log('xhr.responseText', xhr.responseText)
            Swal.fire({
                title: 'Error!',
                text: '人數上限不可小於1',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })
        } else if (JSON.parse(xhr.responseText).error == 'invalid address') {
            console.log('xhr.responseText', xhr.responseText)
            Swal.fire({
                title: 'Error!',
                text: '無效的位置，請重新輸入活動位置',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })
        }

    };
    xhr.send(dataToSent);

    return false
}