// ----------------------------Socket io block------------------------------ 

const toastFunc = async (id, message, type, verb) => {
    let toastPlaceholder = document.getElementById("toastPlaceholder");
    let toastDiv
    let toastHeader
    let toastSmall
    let toastStrong
    let toastButton
    let toastBody

    toastDiv = document.createElement('div')
    toastDiv.className = "toast fade show";
    toastDiv.id = id
    toastDiv.setAttribute("role", "alert")
    toastDiv.setAttribute("aria-live", "assertive")
    toastDiv.setAttribute("aria-atomic", "true")

    toastHeader = document.createElement('div')
    toastHeader.className = "toast-header"

    toastStrong = document.createElement('strong')
    toastStrong.className = "me-auto"
    toastStrong.appendChild(document.createTextNode(type))

    toastSmall = document.createElement('small')
    toastSmall.className = "text-muted"
    // toastImg.setAttribute("src", "...")
    toastSmall.appendChild(document.createTextNode("剛剛"))

    toastButton = document.createElement('button')
    toastButton.type = "button"
    toastButton.className = "btn-close"
    toastButton.setAttribute("data-bs-dismiss", "toast")
    toastButton.setAttribute("aria-label", "Close")

    toastHeader.appendChild(toastStrong)
    toastHeader.appendChild(toastSmall)
    toastHeader.appendChild(toastButton)

    toastBody = document.createElement('div')
    toastBody.className = "toast-body"
    toastBody.appendChild(document.createTextNode(`${message.participantName} ${verb} ${message.gatheringTitle} 活動`))
    toastBody.style = "width:max-content;"

    toastDiv.appendChild(toastHeader)
    toastDiv.appendChild(toastBody)

    toastPlaceholder.insertBefore(toastDiv, toastPlaceholder.firstChild);

    var toast = new bootstrap.Toast(toastDiv)

    toast.show()

}

function fetchData(src, accessToken) {
    // console.log('access', accessToken)
    function processStatus(response) {
        // 狀態 "0" 是處理本地檔案 (例如Cordova/Phonegap等等)
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
        const headers = {}
        return fetch(src)
            .then(processStatus)
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log(error);
            })
    }
}

let user = {}
var socket = io();

let tempId = { 'id': 0 }

if (localStorage.getItem("token")) {

    const accessToken = localStorage.getItem("token")

    let xhr = new XMLHttpRequest();
    let url = '/api/1.0/user/getmemberprofile';
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('apiResponse.data', xhr.responseText)
            console.log('JSON.parse(xhr.responseText).data.id', JSON.parse(xhr.responseText).data.id)

            user.id = JSON.parse(xhr.responseText).data.id
            // console.log('host_newParticipant_${user.id}', `host_newParticipant_${user.id}`)

            socket.on(`host_addParticipant_${user.id}`, async (message) => {
                // console.log('message', message)
                await toastFunc(`${tempId.id
                    }`, message, '加團', '剛加入您的')
                tempId.id += 1;
                renderSystemMessage(accessToken)
            })

            socket.on(`host_removeParticipant_${user.id}`, async (message) => {
                console.log('message', message)

                await toastFunc(`${tempId.id}`, message, '退團', '剛退出您的')

                tempId.id += 1;

                renderSystemMessage(accessToken)
            })

        }
    };
    xhr.send();


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
