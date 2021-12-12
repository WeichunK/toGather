

function fetchData(src, accessToken) {
    // console.log('access', accessToken)

    function processStatus(response) {
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    if (accessToken) {
        const headers = {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        return fetch(src, { headers: headers })
            .then(processStatus)
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log(error);
            })

    } else {
        Swal.fire({
            title: 'Error!',
            text: '請先登入',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }

}

async function initProfile() {

    const accessToken = localStorage.getItem("token")

    let profile = await fetchData('/api/1.0/user/getmemberprofile', accessToken)
    let url = location.href
    let profileId
    let profileData
    if (url.split('?')[1]) {
        profileId = url.split('?')[1].split('=')[1]
        profileData = await fetchData(`/api/1.0/user/getprofile?id=${profileId}`, accessToken)

    } else {
        profileData = profile
        profileId = profile.data.id
    }

    // console.log('response getmemberprofile', profile)

    user = profile.data

    // console.log('profileData', profileData)

    let profileList = document.getElementById('profileList')
    profileList.class = "card"
    profileList.style = "width:60%;"
    // console.log('profileData.data.picture', profileData.data.picture)

    let profilePicContainer = document.createElement('div')
    profilePicContainer.style = "display:flex; justify-content:center;"

    let profilePic = document.createElement('img')
    profilePic.src = profileData.data.picture || '';
    profilePic.className = "card-img-top"

    // profilePic.style = "height:30vh;object-fit: contain;background-image:url('https://mir-s3-cdn-cf.behance.net/project_modules/disp/a5f35a112938979.601ee0c09cecd.gif')"

    profilePic.style = "width:25vh; object-fit: contain; border-radius: 50%; border: 1px solid rgba(255,56,92,1.00);"
    profilePicContainer.appendChild(profilePic)

    let cardBody = document.createElement('div')
    cardBody.className = "card-body";

    let cardName = document.createElement('h5')
    cardName.className = "card-title";
    cardName.appendChild(document.createTextNode(profileData.data.name))

    cardBody.appendChild(cardName)

    let listGroupItem

    let listGroup = document.createElement('ul');
    listGroup.className = "list-group list-group-flush";

    let email = document.createElement('li');
    email.className = "list-group-item";
    email.appendChild(document.createTextNode(`email ${profileData.data.email}`))


    let popularity = document.createElement('li');
    popularity.className = "list-group-item";
    popularity.appendChild(document.createTextNode(`積分 ${profileData.data.popularity}`))


    let changePicButton = document.createElement('a');
    changePicButton.className = "btn btn-primary";
    changePicButton.id = "changePic";
    changePicButton.style = "display: none;"
    changePicButton.setAttribute("data-bs-toggle", "modal")
    changePicButton.setAttribute("data-bs-target", "#staticBackdrop")
    changePicButton.setAttribute("autocomplete", "off")
    changePicButton.appendChild(document.createTextNode("更換照片"))

    if (user.id == profileData.data.id) {
        changePicButton.style = "display: block;"
    }


    listGroup.appendChild(email)

    listGroup.appendChild(popularity)

    listGroup.appendChild(changePicButton)

    listGroup.appendChild(document.createElement('br'))

    profileList.insertBefore(listGroup, profileList.firstChild)

    profileList.insertBefore(cardBody, profileList.firstChild)

    profileList.insertBefore(profilePicContainer, profileList.firstChild)

    let returnHome = document.createElement('a');
    returnHome.className = "btn btn-primary btn-sm box4";

    returnHome.setAttribute("onclick", 'location.href="/index.html"')
    returnHome.setAttribute("data-bs-toggle", "button")
    returnHome.setAttribute("autocomplete", "off")
    returnHome.appendChild(document.createTextNode("回首頁"))

    profileList.appendChild(document.createElement('br'))

    profileList.appendChild(returnHome)


    let ratingData = await fetchData(`/api/1.0/user/getuserrating?id=${profileId}`, accessToken)

    // console.log('ratingData', ratingData)

    let ratingScore = parseFloat(ratingData.data.rating).toFixed(2)
    // let ratingScore = parseFloat('3.512334').toFixed(2)

    if (ratingScore == 0) {
        document.getElementById('rating-description').textContent = '目前尚未有人給評分'
    } else {
        document.getElementById('rating-description').textContent = `${ratingScore} / 5`
    }

    const stars = document.querySelector(".ratingResult").children;
    // let ratingValue
    let index

    for (let j = 0; j < stars.length; j++) {
        stars[j].classList.remove("fa-star")
        stars[j].classList.add("fa-star-o")
    }
    for (let j = 0; j < ratingScore - 0.5; j++) {
        stars[j].classList.remove("fa-star-o")
        stars[j].classList.add("fa-star")
    }

    // ------------------------------ Event List -------------------------------------


    let gatheringList = await fetchData(`/api/1.0/getgatherings/mygatheringlist?id=${profileData.data.id}`, accessToken)

    let comingEvent = document.getElementById("comingEvent")
    let pastEvent = document.getElementById("pastEvent")

    let currentTime = new Date();
    console.log('currentTime', currentTime)

    for (let i in gatheringList.data) {
        let eventBlock = document.createElement('div')
        eventBlock.setAttribute('class', 'card mb-3')
        // eventBlock.setAttribute('onclick', `return clickGathering(${response.data[i].id});`)
        eventBlock.setAttribute('onclick', `location.href='/gathering.html?id=${gatheringList.data[i].id}';`)
        eventBlock.setAttribute('id', gatheringList.data[i].id)
        eventBlock.style = "max-width: 100%;"

        let eventBlockRow = document.createElement('div')
        eventBlockRow.setAttribute('class', 'row g-0')

        let eventBlockRowPic = document.createElement('div')
        eventBlockRowPic.setAttribute('class', 'col-md-4')
        // eventBlockRowPic.style = "min-height:80%;"

        let eventPic = document.createElement('img')
        eventPic.setAttribute('class', 'figure-img img-fluid rounded gathering-pic')
        eventPic.setAttribute('src', gatheringList.data[i].picture)
        eventPic.style = "margin: 3px; object-fit: cover; width:90%; height:90%;"

        eventBlockRowPic.appendChild(eventPic)

        let eventBlockRowContent = document.createElement('div')
        eventBlockRowContent.setAttribute('class', 'col-md-8')

        let eventBlockRowCardBody = document.createElement('div')
        eventBlockRowCardBody.setAttribute('class', 'card-body')


        let eventBlockRowCardTitle = document.createElement('h5')
        eventBlockRowCardTitle.setAttribute('class', 'card-title')
        eventBlockRowCardTitle.appendChild(document.createTextNode(` ${gatheringList.data[i].title}`))

        let eventBlockRowCardText = document.createElement('p')
        eventBlockRowCardText.setAttribute('class', 'card-text')
        eventBlockRowCardText.style = "font-size: 0.8rem;"
        eventBlockRowCardText.appendChild(document.createTextNode(` ${gatheringList.data[i].description.substring(0, 30)}...`))


        let eventBlockRowCardTime = document.createElement('p')
        eventBlockRowCardTime.setAttribute('class', 'card-text')

        let eventBlockRowCardTimeSmall = document.createElement('small')
        eventBlockRowCardTimeSmall.setAttribute('class', 'text-muted')

        eventBlockRowCardTimeSmall.setAttribute('id', `start-time_${gatheringList.data[i].id}`)

        // let startTime = new Date(Date.parse(new Date(gatheringList.data[i].start_at).toUTCString()))
        console.log('gatheringList.data[i].start_at', gatheringList.data[i].start_at)
        let startTime = new Date(gatheringList.data[i].start_at)
        console.log('startTime', startTime)

        // console.log('UTC', startTime.getUTCMonth(), startTime.getUTCDate(), startTime.getUTCHours(), startTime.getUTCMinutes())
        // console.log(startTime.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes())


        eventBlockRowCardTimeSmall.appendChild(document.createTextNode(`時間 ${startTime.getUTCFullYear()}-${((parseInt(startTime.getUTCMonth()) + 1) < 10 ? '0' : '') + (parseInt(startTime.getUTCMonth()) + 1)}-${(startTime.getUTCDate() < 10 ? '0' : '') + startTime.getUTCDate()}  ${(startTime.getUTCHours() < 10 ? '0' : '') + startTime.getUTCHours()}:${(startTime.getUTCMinutes() < 10 ? '0' : '') + startTime.getUTCMinutes()}`))
        eventBlockRowCardTime.appendChild(eventBlockRowCardTimeSmall)

        eventBlockRowCardBody.appendChild(eventBlockRowCardTitle)
        eventBlockRowCardBody.appendChild(eventBlockRowCardText)
        eventBlockRowCardBody.appendChild(eventBlockRowCardTime)

        eventBlockRowContent.appendChild(eventBlockRowCardBody)

        eventBlockRow.appendChild(eventBlockRowPic)
        eventBlockRow.appendChild(eventBlockRowContent)

        eventBlock.appendChild(eventBlockRow)

        if (startTime > currentTime) {
            comingEvent.appendChild(eventBlock)

            let startTimeDiv = document.getElementById(`start-time_${gatheringList.data[i].id}`)

            let waiting

            if (String((startTime - currentTime) / (1000 * 60 * 60 * 24)).split('.')[1] > 0) {

                waiting = parseInt(String((startTime - currentTime) / (1000 * 60 * 60 * 24)).split('.')[0]) + 1
            } else {
                waiting = parseInt(String((startTime - currentTime) / (1000 * 60 * 60 * 24)).split('.')[0])
            }

            startTimeDiv.innerText += `，再等 ${waiting} 天`

        } else {
            pastEvent.appendChild(eventBlock)
        }

    }

    let hostList = await fetchData(`/api/1.0/getgatherings/myhostlist?id=${profileData.data.id}`, accessToken)

    let hostEvent = document.getElementById("ownEvent")

    if (user.id != profileData.data.id) {
        hostEvent.style = "display:none;"
    }

    let currentTimeforHost = new Date();
    // console.log('currentTime', currentTimeforHost)

    for (let i in hostList.data) {

        let eventBlockforHost = document.createElement('div')
        eventBlockforHost.setAttribute('class', 'card mb-3')
        // eventBlock.setAttribute('onclick', `return clickGathering(${response.data[i].id});`)
        eventBlockforHost.setAttribute('onclick', `location.href='/gathering.html?id=${hostList.data[i].id}';`)
        eventBlockforHost.setAttribute('id', hostList.data[i].id)
        eventBlockforHost.style = "max-width: 100%;"

        let eventBlockRowforHost = document.createElement('div')
        eventBlockRowforHost.setAttribute('class', 'row g-0')

        let eventBlockRowPicforHost = document.createElement('div')
        eventBlockRowPicforHost.setAttribute('class', 'col-md-4')
        // eventBlockRowPic.style = "min-height:80%;"

        let eventPicforHost = document.createElement('img')
        eventPicforHost.setAttribute('class', 'figure-img img-fluid rounded gathering-pic')
        eventPicforHost.setAttribute('src', hostList.data[i].picture)
        eventPicforHost.style = "margin: 3px; object-fit: cover; width:90%; height:90%;"

        eventBlockRowPicforHost.appendChild(eventPicforHost)

        let eventBlockRowContentforHost = document.createElement('div')
        eventBlockRowContentforHost.setAttribute('class', 'col-md-8')

        let eventBlockRowCardBodyforHost = document.createElement('div')
        eventBlockRowCardBodyforHost.setAttribute('class', 'card-body')


        let eventBlockRowCardTitleforHost = document.createElement('h5')
        eventBlockRowCardTitleforHost.setAttribute('class', 'card-title')
        eventBlockRowCardTitleforHost.appendChild(document.createTextNode(` ${hostList.data[i].title}`))

        let eventBlockRowCardTimeforHost = document.createElement('p')
        eventBlockRowCardTimeforHost.setAttribute('class', 'card-text')

        let eventBlockRowCardTimeSmallforHost = document.createElement('small')
        eventBlockRowCardTimeSmallforHost.setAttribute('class', 'text-muted')


        console.log('hostList.data[i].start_at', hostList.data[i].start_at)
        let startTimeforHost = new Date(hostList.data[i].start_at)
        // console.log('startTime', startTimeforHost)

        eventBlockRowCardTimeSmallforHost.appendChild(document.createTextNode(`時間 ${startTimeforHost.getUTCFullYear()}-${((parseInt(startTimeforHost.getUTCMonth()) + 1) < 10 ? '0' : '') + (parseInt(startTimeforHost.getUTCMonth()) + 1)}-${(startTimeforHost.getUTCDate() < 10 ? '0' : '') + startTimeforHost.getUTCDate()}  ${(startTimeforHost.getUTCHours() < 10 ? '0' : '') + startTimeforHost.getUTCHours()}:${(startTimeforHost.getUTCMinutes() < 10 ? '0' : '') + startTimeforHost.getUTCMinutes()}`))
        eventBlockRowCardTimeforHost.appendChild(eventBlockRowCardTimeSmallforHost)

        let eventBlockRowCardParticipantforHost = document.createElement('p')
        eventBlockRowCardParticipantforHost.setAttribute('class', 'card-text')

        let eventBlockRowCardParticipantSmallforHost = document.createElement('small')
        eventBlockRowCardParticipantSmallforHost.setAttribute('class', 'text-muted')


        eventBlockRowCardParticipantSmallforHost.appendChild(document.createTextNode(`目前人數 ${hostList.data[i].participant_count}，點閱次數 ${hostList.data[i].click_count}`))
        eventBlockRowCardParticipantforHost.appendChild(eventBlockRowCardParticipantSmallforHost)


        let eventBlockRowCardStatusforHost = document.createElement('p')
        eventBlockRowCardStatusforHost.setAttribute('class', 'card-text')

        let eventBlockRowCardStatusSmallforHost = document.createElement('small')
        eventBlockRowCardStatusSmallforHost.setAttribute('class', 'text-muted')

        let status_object = { '1': '已開團', '2': '招募中', '3': '已額滿', '4': '已結束', }

        eventBlockRowCardStatusSmallforHost.appendChild(document.createTextNode(`狀態 ${status_object[hostList.data[i].status]}`))
        eventBlockRowCardStatusforHost.appendChild(eventBlockRowCardStatusSmallforHost)

        eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardTitleforHost)
        // eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardTextforHost)
        eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardTimeforHost)
        eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardParticipantforHost)
        // eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardClickforHost)
        eventBlockRowCardBodyforHost.appendChild(eventBlockRowCardStatusforHost)

        eventBlockRowContentforHost.appendChild(eventBlockRowCardBodyforHost)

        eventBlockRowforHost.appendChild(eventBlockRowPicforHost)
        eventBlockRowforHost.appendChild(eventBlockRowContentforHost)

        eventBlockforHost.appendChild(eventBlockRowforHost)

        hostEvent.appendChild(eventBlockforHost)

    }


    // ---------------------------------------------------------------------------------


    //    --------------------------------------system messages block---------------------------- -->

    const renderSystemMessage = async function (accessToken) {

        let systemMessageRecord = await fetchData(`/api/1.0/chat/getsystemrecord`, accessToken)

        // console.log('systemMessageRecord.data[0].content', systemMessageRecord.data[0].content)

        let sysMessageList = document.getElementById('sys-message-list')

        for (let i in systemMessageRecord.data) {
            // console.log('current user.id', user.id)
            // console.log('chatRecord[i].user_id', chatRecord[i].user_id)
            let sysMessageItem = document.createElement('li');

            // console.log('comapre', 'chatRecord[i].user_id: ', chatRecord[i].user_id, 'user.id:', user.id)
            sysMessageItem.className = "list-group-item"
            sysMessageItem.innerText = systemMessageRecord.data[i].content
            let sysMessageItemSmall = document.createElement('small');
            sysMessageItemSmall.className = "text-muted";
            let startTime = new Date(systemMessageRecord.data[i].created_at);
            sysMessageItemSmall.innerText = `${startTime.getUTCFullYear()}-${((parseInt(startTime.getUTCMonth()) + 1) < 10 ? '0' : '') + (parseInt(startTime.getUTCMonth()) + 1)}-${(startTime.getUTCDate() < 10 ? '0' : '') + startTime.getUTCDate()}  ${(startTime.getUTCHours() < 10 ? '0' : '') + startTime.getUTCHours()}:${(startTime.getUTCMinutes() < 10 ? '0' : '') + startTime.getUTCMinutes()}`

            sysMessageItem.appendChild(sysMessageItemSmall)

            sysMessageList.appendChild(sysMessageItem);

        }


        sysMessageList.scrollBy(0, sysMessageList.scrollHeight)

    }


    renderSystemMessage(accessToken)


    // ---------------------------------------------------------------------------------------------- 


}


function onClick(form) {
    // console.log('type of form', typeof (form))
    // console.log('form', form)

    let dataToSent = new FormData(form)
    // console.log('dataToSent', dataToSent)

    alert('check')

    if (localStorage.getItem('token')) {
        var jwt = localStorage.getItem('token')
        // console.log('JWT', jwt)
        // console.log("files[0].size", document.getElementById("main_image").files[0].size)
        // console.log("files[0]", document.getElementById("main_image").files[0])


        if (!document.getElementById("main_image").files[0]) {
            Swal.fire({
                title: 'Error!',
                text: '圖片不可為空',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                return false;
            })
        } else if (document.getElementById("main_image").files[0].size > 2 * 1024 * 1024) {
            Swal.fire({
                title: 'Error!',
                text: '圖片尺寸過大',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                return false;
            })
        } else {
            Swal.fire({
                title: 'Success!',
                text: '資料格式正確，即將為您建檔！',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.reload();
            })
        }

    } else {
        alert('請先登入')
        window.location.href = '/admin/signIn.html'
    }
    // console.log("dataToSent", dataToSent)
    const accessToken = localStorage.getItem("token");

    let xhr = new XMLHttpRequest();
    let url = '/api/1.0//user/updatephoto';
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // console.log('apiResponse.data', xhr.responseText)
            // if (xhr.responseText == 'admin') {
            //     alert('已成功輸入一筆資料')
            //     window.location.href = '/admin/product.html'
            // } else {
            //     alert('無權限操作此頁')
            // }
            window.location.reload();
        }
    };
    xhr.send(dataToSent);

    // .finally(location.reload())

    return false
}





initProfile()