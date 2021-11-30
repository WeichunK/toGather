

function fetchData(src, accessToken) {

    function processStatus(response) {
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response)
        } else if (response.status === 403) {

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
        const headers = {}
        return fetch(src)
            .then(processStatus)
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log(error);
            })
    }
}

async function initMap() {

    var socket = io();
    var hostInfo = {};
    var user = {}
    var gathering = {}

    const accessToken = localStorage.getItem("token")

    let url = location.href

    if (url.indexOf('?') !== -1 & url.split('?')[1].split('=')[0] == 'id') {
        const gatheringId = url.split('?')[1].split('=')[1]
        // console.log('gatheringId', gatheringId)

        let participantsData = await fetchData(`/api/1.0/getgatherings/participants?id=${gatheringId}`, accessToken)

        console.log('participantsData', participantsData, gatheringId)
        gathering.numOfParticipants = participantsData.data.length

        // console.log('gathering', gathering)

        let getgatheringDetails = await fetchData(`/api/1.0/getgatherings/details?id=${gatheringId}`, accessToken)

        let commentList = await fetchData(`/api/1.0/gatherings/getcomment?id=${gatheringId}`, accessToken)

        // console.log('commentList', commentList)

        // console.log('getgatheringDetails.data[0].lat', getgatheringDetails.data[0].lat)
        gathering.title = getgatheringDetails.data[0].title

        // console.log('getgatheringDetails', getgatheringDetails)

        // console.log('getgatheringDetails.user', getgatheringDetails.user)

        // console.log('getgatheringDetails.data[0]', getgatheringDetails.data[0])

        // initMap(response.data[0].lat, response.data[0].lng)

        hostInfo.hostName = getgatheringDetails.data[0].name
        hostInfo.hostId = getgatheringDetails.data[0].host_id
        hostInfo.rating = getgatheringDetails.data[0].avg_rating
        hostInfo.picture = getgatheringDetails.data[0].host_pic
        // console.log('hostInfo', hostInfo)

        const gatheringDetail = document.getElementById('gatheringDetail')

        gatheringDetail.class = "card"

        let eventPic = document.createElement('img')
        eventPic.src = getgatheringDetails.data[0].picture

        eventPic.className = "card-img-top"


        eventPic.style = "width:82%; object-fit: contain;background-image:url('https://mir-s3-cdn-cf.behance.net/project_modules/disp/a5f35a112938979.601ee0c09cecd.gif')"

        eventPic.style = "width:82%; object-fit: contain;background-image:url('./assets/grey-background.jpg')"


        let cardBody = document.createElement('div')
        cardBody.className = "card-body";

        let cardTitle = document.createElement('h5')
        cardTitle.className = "card-title";
        cardTitle.appendChild(document.createTextNode(` ${getgatheringDetails.data[0].title}`))


        let cardDescriptiion = document.createElement('p')
        cardDescriptiion.className = "card-text";
        cardDescriptiion.style = "white-space: pre-line;"
        cardDescriptiion.appendChild(document.createTextNode(` ${getgatheringDetails.data[0].description}`))
        // console.log(getgatheringDetails.data[0].description)

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardDescriptiion)

        let listGroup = document.createElement('ul');
        listGroup.className = "list-group list-group-flush";

        let listGroupItem = document.createElement('li');
        listGroupItem.className = "list-group-item";
        listGroupItem.appendChild(document.createTextNode(`地點 ${getgatheringDetails.data[0].place}`))


        let startTime = new Date(getgatheringDetails.data[0].start_at)


        let time = document.createElement('li');
        time.className = "list-group-item";
        time.appendChild(document.createTextNode(`時間 ${startTime.getUTCFullYear()}-${((parseInt(startTime.getUTCMonth()) + 1) < 10 ? '0' : '') + (parseInt(startTime.getUTCMonth()) + 1)}-${(startTime.getUTCDate() < 10 ? '0' : '') + startTime.getUTCDate()}  ${(startTime.getUTCHours() < 10 ? '0' : '') + startTime.getUTCHours()}:${(startTime.getUTCMinutes() < 10 ? '0' : '') + startTime.getUTCMinutes()}`))


        let maxParticipant = document.createElement('li');
        maxParticipant.className = "list-group-item";
        maxParticipant.appendChild(document.createTextNode(`人數上限 ${getgatheringDetails.data[0].max_participant}`))


        let currentParticipant = document.createElement('li');
        currentParticipant.className = "list-group-item";
        currentParticipant.appendChild(document.createTextNode(`目前人數 ${parseInt(gathering.numOfParticipants)}`))

        // ---------------------status-----------------------

        let statusObject = { 1: "已開團", 2: "招募中", 3: "已額滿", 4: "已結束" }
        let statusBarValue = { 1: "3%", 2: "33%", 3: "66%", 4: "100%" }

        joinEventButton = document.getElementById('joinEvent')
        quitEventButton = document.getElementById('quitEvent')
        fullEventButton = document.getElementById('fullEvent')
        expiredEventButton = document.getElementById('expiredEvent')


        document.getElementById('progressbar').style = `width: ${statusBarValue[getgatheringDetails.data[0].status]};`

        if (getgatheringDetails.data[0].status == 4) {
            joinEventButton.style = "display: none;"
            fullEventButton.style = "display: none;"
            expiredEventButton.style = "display: block;"
        }

        let host = document.createElement('li');
        host.className = "list-group-item";
        host.appendChild(document.createTextNode(`主揪 ${hostInfo.hostName}`))



        // console.log('check', parseInt(gathering.numOfParticipants), getgatheringDetails.data[0].max_participant)
        if ((parseInt(gathering.numOfParticipants)) >= getgatheringDetails.data[0].max_participant) {
            joinEventButton.style = "display: none;"
            fullEventButton.style = "display: block;"
        } else {
            joinEventButton.style = "display: block;"
            fullEventButton.style = "display: none;"
        }


        listGroup.appendChild(listGroupItem)
        listGroup.appendChild(time)

        listGroup.appendChild(maxParticipant)
        listGroup.appendChild(currentParticipant)


        listGroup.appendChild(host)

        listGroup.appendChild(document.createElement('br'))


        gatheringDetail.insertBefore(listGroup, gatheringDetail.firstChild)


        gatheringDetail.insertBefore(cardBody, gatheringDetail.firstChild)

        gatheringDetail.insertBefore(eventPic, gatheringDetail.firstChild)

        let commentListBlock = document.getElementById('commentList')
        commentListBlock.style = "width: 80%; margin-top: 15px;"

        for (i in commentList.data.comments) {

            let commentCard = document.createElement('div')
            commentCard.id = "commentCard";
            commentCard.className = "card";
            commentCard.style = "height: 10rem;"
            let commentCardBody = document.createElement('div')
            let commentCardTitle = document.createElement('h5')
            commentCardTitle.className = "card-title"
            commentCardTitle.textContent = commentList.data.comments[i].name
            let commentCardDate = document.createElement('h6')
            commentCardDate.className = "card-subtitle mb-2 text-muted"
            let startTime = new Date(commentList.data.comments[i].created_at)
            commentCardDate.textContent = `時間 ${startTime.getUTCFullYear()}-${((parseInt(startTime.getUTCMonth()) + 1) < 10 ? '0' : '') + (parseInt(startTime.getUTCMonth()) + 1)}-${(startTime.getUTCDate() < 10 ? '0' : '') + startTime.getUTCDate()}  ${(startTime.getUTCHours() < 10 ? '0' : '') + startTime.getUTCHours()}:${(startTime.getUTCMinutes() < 10 ? '0' : '') + startTime.getUTCMinutes()}`

            let commentText = document.createElement('p')
            commentText.className = "card-text";
            commentText.textContent = commentList.data.comments[i].comment

            commentCardBody.appendChild(commentCardTitle)
            commentCardBody.appendChild(commentCardDate)
            commentCardBody.appendChild(commentText)

            commentCard.appendChild(commentCardBody)


            commentListBlock.appendChild(commentCard)

        }


        let returnHome = document.createElement('a');
        returnHome.className = "btn btn-primary btn-sm box4";


        returnHome.setAttribute("onclick", 'location.href="/index.html"')
        returnHome.setAttribute("data-bs-toggle", "button")
        returnHome.setAttribute("autocomplete", "off")
        returnHome.appendChild(document.createTextNode("回首頁"))

        gatheringDetail.appendChild(document.createElement('br'))

        gatheringDetail.appendChild(returnHome)


        // -------------------------- current rating ---------------------

        let ratingScore = parseFloat(getgatheringDetails.data[0].avg_rating).toFixed(2)
        // let ratingScore = 3.51

        if (ratingScore == 0) {
            document.getElementById('rating-description').textContent = '目前尚未有人給評分'
        } else {
            document.getElementById('rating-description').textContent = `${ratingScore} / 5`
        }

        const stars = document.querySelector(".ratingResult").children;
        // let ratingValue
        let index //目前選到的星星

        for (let j = 0; j < stars.length; j++) {
            stars[j].classList.remove("fa-star")//reset 所有星星
            stars[j].classList.add("fa-star-o")
        }
        for (let j = 0; j < ratingScore - 0.5; j++) {
            stars[j].classList.remove("fa-star-o")
            stars[j].classList.add("fa-star")
        }

        const initPoint = { lat: getgatheringDetails.data[0].lat, lng: getgatheringDetails.data[0].lng };
        console.log('initPoint', initPoint)
        map = new google.maps.Map(document.getElementById("left-map"), {
            center: initPoint,
            zoom: 16,
            fullscreenControl: false,
            mapTypeControl: false,
            styles: [
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#f7f1df"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#d0e3b4"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural.terrain",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                // {
                //     "featureType": "poi",
                //     "elementType": "labels",
                //     "stylers": [
                //         {
                //             "visibility": "off"
                //         }
                //     ]
                // },
                {
                    "featureType": "poi.business",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.medical",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#fbd3da"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#bde6ab"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffe15f"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#efd151"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "black"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.airport",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#cfb2db"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#a2daf2"
                        }
                    ]
                }
            ]
        });


        let marker = new google.maps.Marker()

        marker = new google.maps.Marker({
            position: initPoint, //marker的放置位置

            map: map
        });


        let participant;
        url = location.href

        const messages = document.getElementById('messages');
        const form = document.getElementById('messagesForm');
        const input = document.getElementById('messageInput');
        const right = document.getElementById('right');
        const joinEvent = document.getElementById('joinEvent');
        const quitEvent = document.getElementById('quitEvent');
        const actionButtons = document.getElementById('action-buttons')


        // ----------------------------------------------------------------------------------------


        if (accessToken) {

            let profile = await fetchData('/api/1.0/user/getmemberprofile', accessToken)

            console.log('response getmemberprofile', profile)


            user = profile.data
            console.log('user', user)
            // messages.style = "display:block;"
            // form.style = "display:block;"
            // right.style = "display:block;"

            if (user.id == hostInfo.hostId) {
                console.log('is host')
                right.style = "display:block;"
                joinEvent.style = "display:none;"
                fullEvent.style = "display:none;"
                quitEvent.style = "display:none;"
                actionButtons.style = "display:none;"
                // gatheringDetail.style = "width: 45%"

            }

            let participantsData = await fetchData(`/api/1.0/getgatherings/participants?id=${gatheringId}`, accessToken)


            console.log('participantsData', participantsData)

            let participants = document.getElementById('participants')


            // ---------------Host Block-------------

            // const hostNameForChatRoom = document.createElement('li');

            // hostNameForChatRoom.textContent = `主揪 ${hostInfo.hostName} `

            // participants.appendChild(hostNameForChatRoom);

            const hostForChatRoom = document.createElement('div');

            hostForChatRoom.setAttribute('class', 'card-header host-header')

            hostForChatRoom.setAttribute('onclick', `location.href='/profile.html?id=${hostInfo.hostId}';`)

            hostForChatRoom.style = " cursor:pointer;"

            let hostRow = document.createElement('div')
            hostRow.setAttribute('class', 'row g-0')
            hostRow.style = "align-items: center;"

            let hostRowPic = document.createElement('div')
            hostRowPic.setAttribute('class', 'col-md-4')
            hostRowPic.style = "display: flex; flex-direction:column; justify-content:center;width:min-content;"

            let hostPic = document.createElement('img')
            hostPic.setAttribute('class', 'figure-img img-fluid rounded participant-pic')
            hostPic.setAttribute('src', hostInfo.picture)
            hostPic.style = "margin: 3px; object-fit: contain; height: 50%; max-width:45px;"

            hostRowPic.appendChild(hostPic)

            let hostRowContent = document.createElement('div')
            hostRowContent.setAttribute('class', 'col-md-8')

            let hostRowCardBody = document.createElement('div')
            hostRowCardBody.setAttribute('class', 'card-body')

            let hostRowCardText = document.createElement('p')
            hostRowCardText.setAttribute('class', 'card-text')
            hostRowCardText.appendChild(document.createTextNode(` ${hostInfo.hostName}`))

            hostRowCardBody.appendChild(hostRowCardText)

            hostRowContent.appendChild(hostRowCardBody)

            hostRow.appendChild(hostRowPic)
            hostRow.appendChild(hostRowContent)

            hostForChatRoom.appendChild(hostRow)

            participants.appendChild(hostForChatRoom);

            // ----------------------------------------------

            // joinEvent.style = "display:block;"
            // quitEvent.style = "display:none;"

            // --------------- render participant --------------         

            async function renderParticipants() {

                participantsData = await fetchData(`/api/1.0/getgatherings/participants?id=${gatheringId}`, accessToken)
                participants.innerHTML = ""
                participants.appendChild(hostForChatRoom);

                for (let i in participantsData.data) {

                    console.log('participantsData.data[i]', participantsData.data[i].id, user.id)

                    if (user.id == participantsData.data[i].id) {
                        console.log('in participant list')
                        right.style = "display:block;"
                        joinEvent.style = "display:none;"
                        fullEvent.style = "display:none;"
                        quitEvent.style = "display:block;"
                        actionButtons.style = "display:none;"

                    }

                    let subParticipants = document.createElement('div')

                    let participant = document.createElement('div')
                    participant.setAttribute('class', 'card mb-3 participant')

                    participant.setAttribute('id', participantsData.data[i].id)
                    participant.style = "max-width: 100%; cursor:pointer; margin:0!important;"

                    let participantRow = document.createElement('div')
                    participantRow.setAttribute('class', 'row g-0')
                    participantRow.style = "align-items: center; width:10rem;"
                    participantRow.setAttribute('onclick', `location.href='/profile.html?id=${participantsData.data[i].id}';`)


                    let participantRowPic = document.createElement('div')
                    participantRowPic.setAttribute('class', 'col-md-4')
                    participantRowPic.style = "display: flex; flex-direction:column; justify-content:center;width:min-content;"

                    let participantPic = document.createElement('img')
                    // participantPic.setAttribute('class', 'figure-img img-fluid rounded participant-pic')
                    participantPic.setAttribute('class', 'figure-img img-fluid participant-pic')

                    participantPic.setAttribute('src', participantsData.data[i].picture)
                    participantPic.style = "margin: 3px; object-fit: contain; height: 50%; max-width:45px;"

                    participantRowPic.appendChild(participantPic)

                    let participantRowContent = document.createElement('div')
                    participantRowContent.setAttribute('class', 'col-md-8')

                    let participantRowCardBody = document.createElement('div')
                    participantRowCardBody.setAttribute('class', 'card-body')

                    let participantRowCardText = document.createElement('p')
                    participantRowCardText.setAttribute('class', 'card-text')
                    participantRowCardText.style = "width:10rem;"
                    participantRowCardText.appendChild(document.createTextNode(` ${participantsData.data[i].user_name}`))

                    participantRowCardBody.appendChild(participantRowCardText)

                    participantRowContent.appendChild(participantRowCardBody)

                    participantRow.appendChild(participantRowPic)
                    participantRow.appendChild(participantRowContent)

                    let removeIcon = document.createElement('img');
                    removeIcon.setAttribute('src', "https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/103763_close_user_remove_icon.png")
                    // removeIcon.setAttribute('onclick', `removeParticipant(${gatheringId}, ${participantsData.data[i].id})`)
                    // removeIcon.setAttribute('class', "btn btn-primary")
                    removeIcon.setAttribute('data-bs-toggle', "modal")
                    removeIcon.setAttribute('data-bs-target', "#removeParticipantModal")

                    removeIcon.setAttribute('data-bs-participantId', participantsData.data[i].id)
                    removeIcon.setAttribute('data-bs-participantName', participantsData.data[i].user_name)
                    removeIcon.setAttribute('data-bs-GatheringId', gatheringId)
                    removeIcon.setAttribute('data-bs-HostId', hostInfo.hostId)
                    removeIcon.setAttribute('type', "button")
                    removeIcon.setAttribute('data-bs-whatever', "@mdo")

                    if (user.id == hostInfo.hostId) {
                        removeIcon.style = "width:1.3rem; height:1.3rem; margin-right: 5px;"
                    } else {
                        removeIcon.style = "width:1.3rem; height:1.3rem;  margin-right: 5px; display:none;"

                    }

                    participant.appendChild(participantRow)
                    participant.appendChild(removeIcon)

                    participants.appendChild(participant)

                }

                if (getgatheringDetails.data[0].status == 4) {
                    joinEventButton.style = "display: none;"
                    fullEventButton.style = "display: none;"
                    expiredEventButton.style = "display: block;"
                }

            }

            renderParticipants()

            let removeParticipantModal = document.getElementById('removeParticipantModal')
            removeParticipantModal.addEventListener('show.bs.modal', function (event) {

                let button = event.relatedTarget

                let participantId = button.getAttribute('data-bs-participantId')
                let gatheringId = button.getAttribute('data-bs-gatheringId')
                let participantName = button.getAttribute('data-bs-participantName')
                let hostId = button.getAttribute('data-bs-hostId')

                let modalBody = removeParticipantModal.querySelector('#removeParticipantModalBody')

                modalBody.textContent = `確定要將 ${participantName} 移出活動嗎？`

                let removeParticipantModalConfirm = document.getElementById('removeParticipantModalConfirm')

                removeParticipantModalConfirm.addEventListener('click', async function (event) {

                    let removeParticipantAdmin = await fetchData(`/api/1.0/gatherings/removeparticipantadmin?gathering_id=${gatheringId}&participant_id=${participantId}&host_id=${hostId}`, accessToken)

                    if (removeParticipantAdmin.error == 'No Permission') {
                        Swal.fire({
                            title: 'Error!',
                            text: '您無權限進行此操作',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })

                    } else {
                        Swal.fire({
                            title: 'Success!',
                            text: '已將用戶移出',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            // window.location.reload();
                            let participantData = { gatheringId: gatheringId, gatheringTitle: gathering.title, hostId: hostInfo.hostId, hostName: hostInfo.hostName, participantName: participantName, participantId: participantId }

                            socket.emit('removeParticipantAdmin', participantData)

                        }).then(function () {
                            console.log('renderParticipants()')
                            renderParticipants()
                        })

                    }


                })

            })

            // ------------------------------------------------------------------------------------

            let chatRecord
            socket.on('addRoom', message => {
                console.log(message)

            })


            // let room = 'room1'
            let room = location.href.split('?')[1].split('=')[1]

            // console.log('{ room: room, userId: user.id }', room, user.id)
            socket.emit('addRoom', { room: room, userId: user.id })

            socket.on(`${room}+${user.id}`, chatRecord => {
                // console.log('chatRecord', chatRecord)
                // item.textContent = userName + ':' + msg;
                // let messages = document.getElementById('messages')
                let item;
                for (let i in chatRecord) {
                    // console.log('current user.id', user.id)
                    // console.log('chatRecord[i].user_id', chatRecord[i].user_id)
                    item = document.createElement('li');
                    item.setAttribute('class', 'rounded-pill')

                    // console.log('comapre', 'chatRecord[i].user_id: ', chatRecord[i].user_id, 'user.id:', user.id)

                    if (chatRecord[i].user_id == user.id) {
                        // item.style = 'margin: 3px 3px 3px auto;'
                        item.classList.add('class', 'message-myself')
                        item.textContent = `${chatRecord[i].content} `
                    } else {
                        item.textContent = `${chatRecord[i].user_name}: ${chatRecord[i].content} `;
                        // item.style = 'margin: 3px 3px 3px 3px;'
                        item.classList.add('class', 'message-others')
                    }

                    messages.appendChild(item);
                }
                document.getElementById('messages').scrollBy(0, document.getElementById('messages').scrollHeight)

            })

            const messages = document.getElementById('messages');
            const form = document.getElementById('messagesForm');
            const input = document.getElementById('messageInput');

            let messagesList = []
            let chat
            form.addEventListener('submit', function (e) {
                console.log('submit')
                e.preventDefault();
                if (input.value) {
                    console.log('input.value', input.value)
                    console.log('user.id', user.id)
                    chat = { speaker: user.name, content: input.value, roomId: room, userId: user.id }
                    // chat.speaker = user.name
                    // chat.content = input.value
                    socket.emit('chat message', chat);

                    messagesList.push(chat)
                    input.value = '';
                    console.log(messagesList)
                }
            })


            let item;
            socket.on('chat message', function (msg) {
                item = document.createElement('li');
                // item.textContent = userName + ':' + msg;

                // console.log('comapre', 'msg.speaker: ', msg.speaker, 'user.name:', user.name)
                item.setAttribute('class', 'rounded-pill')
                if (msg.speaker == user.name) {
                    // item.style = 'margin: 3px 3px 3px auto;'
                    item.textContent = `${msg.content}`;
                    item.classList.add('class', 'message-myself')
                } else {
                    item.textContent = `${msg.speaker}: ${msg.content} `;
                    // item.style = 'margin: 3px 3px 3px 3px;'
                    item.classList.add('class', 'message-others')

                    Swal.fire({
                        title: `${msg.speaker} say: ${msg.content} `,
                        position: 'bottom-end',
                        showClass: {

                            popup: 'animate__animated animate__fadeIn'
                        },

                        timer: 1500,
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        },
                        backdrop: false,
                        width: '18rem',
                    })

                }

                messages.appendChild(item);

                document.getElementById('messages').scrollBy(0, document.getElementById('messages').scrollHeight)

            })

            socket.on(`all_changeParticipant_${location.href.split('?')[1].split('=')[1]}`, function (msg) {

                // window.location.reload()

                renderParticipants()

            })

            // console.log(`all_changeParticipant_${location.href.split('?')[1].split('=')[1]}_${user.id}`, `all_changeParticipant_${location.href.split('?')[1].split('=')[1]}_${user.id}`)

            socket.on(`all_changeParticipant_${location.href.split('?')[1].split('=')[1]}_${user.id}`, async function (msg) {

                // console.log(`all_changeParticipant_${location.href.split('?')[1].split('=')[1]}_${user.id}`, `all_changeParticipant_${location.href.split('?')[1].split('=')[1]}_${user.id}`)

                await Swal.fire({
                    title: 'Warning!',
                    text: '您已被管理者移出活動',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                })
                window.location.href = '/index.html'

            })


        } else {
            // messages.style = "display:none;"
            // form.style = "display:none;"
            right.style = "display:none;"
            gatheringDetail.style = "width:90%;"

        }

        document.getElementById("joinEvent").addEventListener('click', async () => {

            // console.log('userjoinEvent', user)
            if (accessToken) {

                if (parseInt(user.popularity) < 5) {

                    Swal.fire({
                        title: 'Error!',
                        text: '積分點數不足',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(function () {
                        window.location.href = '/index.html'
                    })

                } else {

                    let joinGathering = await fetchData(`/api/1.0/gatherings/attendGathering/join?id=${gatheringId}`, accessToken)

                    if (joinGathering.error == 'Participant Full!') {

                        Swal.fire({
                            title: 'Error!',
                            text: '名額已被其他用戶加入',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            window.location.reload();
                        })
                        // return false;
                    }

                    // console.log('joinGathering', joinGathering)

                    if (joinGathering.error == 'Gathering Expired!') {

                        Swal.fire({
                            title: 'Error!',
                            text: '活動已結束',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        }).then(function () {
                            window.location.reload();
                        })
                        // return false;
                    }


                    let participantData = { gatheringId: gatheringId, gatheringTitle: gathering.title, hostId: hostInfo.hostId, hostName: hostInfo.hostName, participantName: joinGathering.data.participant.participant_name, participantId: joinGathering.data.participant.participant_id }


                    // console.log('participantData', participantData)


                    socket.emit('addParticipant', participantData)

                    Swal.fire({
                        title: 'Success!',
                        text: '成功加入，已為您扣除5點積分',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(function () {
                        renderParticipants()

                        right.style = "display:block;"
                        joinEvent.style = "display:none;"
                        fullEvent.style = "display:none;"
                        quitEvent.style = "display:block;"
                        actionButtons.style = "display:none;"

                    })

                }

            } else {

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

        document.getElementById("quitEvent").addEventListener('click', async () => {

            // const gatheringId = url.split('?')[1].split('=')[1]

            // const accessToken = localStorage.getItem("token")

            if (accessToken) {

                let quitGathering = await fetchData(`/api/1.0/gatherings/attendGathering/quit?id=${gatheringId}`, accessToken)

                // console.log('quitGathering', quitGathering)

                let participantData = { gatheringId: gatheringId, gatheringTitle: gathering.title, hostId: hostInfo.hostId, hostName: hostInfo.hostName, participantName: quitGathering.data.participant.participant_name, participantId: quitGathering.data.participant.participant_id }

                // console.log('participantData', participantData)

                alert('成功退出')
                socket.emit('removeParticipant', participantData)

                window.location.reload();

            } else {

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


    } else {
        console.log('wrong parameter')
    }

    if (user.id == hostInfo.hostId) {

        joinEvent.style = "display:none;"
        fullEvent.style = "display:none;"
        quitEvent.style = "display:none;"
        actionButtons.style = "display:none;"
    }

    //    --------------------------------------system messages block---------------------------- -->

    const renderSystemMessage = async function (accessToken) {

        let systemMessageRecord = await fetchData(`/api/1.0/chat/getsystemrecord`, accessToken)

        // console.log('systemMessageRecord.data[0].content', systemMessageRecord.data[0].content)

        let sysMessageList = document.getElementById('sys-message-list')


        for (let i in systemMessageRecord.data) {
            // console.log('current user.id', user.id)
            // console.log('chatRecord[i].user_id', chatRecord[i].user_id)
            let sysMessageItem = document.createElement('li');

            // console.log('compare', 'chatRecord[i].user_id: ', chatRecord[i].user_id, 'user.id:', user.id)
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


    var ratingScore = {}

    var commentModal = document.getElementById('commentModal')
    commentModal.addEventListener('show.bs.modal', function (event) {

        var button = event.relatedTarget

        ratingScore.score = button.getAttribute('data-bs-rating')

        var modalTitle = commentModal.querySelector('.modal-title')


        modalTitle.textContent = '您給的分數為 ' + ratingScore.score + ' 顆星'

    })

    const sendCommentButton = document.getElementById('sendCommentButton')
    sendCommentButton.addEventListener('click', async function (event) {
        if (!accessToken) {
            console.log('請先登入再進行評論')
            await Swal.fire({
                title: 'Error!',
                text: '請先登入再進行評論',
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.href = '/sign.html';
            })
        }

        let commentData = {
            gatheringId: location.href.split('?')[1].split('=')[1],
            hostId: hostInfo.hostId,
            rating: ratingScore.score,
            comment: document.getElementById('message-text').value
        }

        console.log('commentData', commentData)

        const commentHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        fetch('/api/1.0/gatherings/feedback', { headers: commentHeaders, body: JSON.stringify(commentData), method: 'POST' })

            .then((response) => { return response.json(); })
            .then((response) => { console.log('comment successful', response) })
            .then(() => {

                Swal.fire({
                    title: 'Success!',
                    text: '您的評論已送出',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(function () {
                    window.location.reload();
                })

            })
            .catch((error) => {
                console.log(error);
            })

    })

}
