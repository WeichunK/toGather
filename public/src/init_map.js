

const url = location.href
let tagValue = 'all'
let tagType
if (url.indexOf('?') !== -1) {
    tagType = url.split('?')[1].split('=')[0]
    tagValue = url.split('?')[1].split('=')[1]
}

let map;

let bound = { Hb: {}, tc: {} }

function ajax(src, callback) {
    let response
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            response = JSON.parse(xhr.responseText)
            // response = xhr.responseText;
            callback(response)
        }
    }
    function sendAJAX() {
        xhr.open('GET', src)
        xhr.send()
    }
    sendAJAX()
}



function initMap() {
    var initPoint = { lat: 25.0467073, lng: 121.5137439 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: initPoint,
        zoom: 13,
    });

    console.log('getCenter', map.getCenter())

    // bound.Hb.g = 121.45881225937497
    // bound.Hb.i = 121.56867554062497
    // bound.tc.g = 25.035260739986995
    // bound.tc.i = 25.058152791492088

    // console.log('init_bound', bound)

    // map.addListener('tilesloaded', function (e) {
    //     console.log('getBounds', map.getBounds())
    //     bound.Hb.g = map.getBounds().Hb.g
    //     bound.Hb.i = map.getBounds().Hb.i
    //     bound.tc.g = map.getBounds().tc.g
    //     bound.tc.i = map.getBounds().tc.i
    //     console.log('bound', bound)
    // });



    // let points = [[25.0346425125241, 121.53486545775085],
    // [25.052683147025533, 121.5262823889032],
    // [25.053927230873104, 121.54104526732117],
    // [25.047395649810476, 121.54997165892273],
    // [25.04579224030345, 121.54449462890625],
    // [25.096991128467334, 121.57096582383441]]
    // let marker = new google.maps.Marker()
    // for (let i in points) {
    //     marker = new google.maps.Marker({
    //         position: { lat: points[i][0], lng: points[i][1] },
    //         map: map
    //     });
    // }

    // let latLng = new google.maps.LatLng(r.geometry.coordinates[0], r.geometry.coordinates[1]);

    // console.log('latLng', latLng)

    const svgMarker = {
        path: "M62.4861,29.9994,82.2446,10.2408A6,6,0,0,0,78.0022-.0017H18a5.9968,5.9968,0,0,0-6,6v84.003a6,6,0,0,0,12,0V60H78.0022a6,6,0,0,0,4.2424-10.2425ZM24,48V11.9987H63.5174L49.7591,25.757a5.9979,5.9979,0,0,0,0,8.4847L63.5174,48Z",
        fillColor: "red",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.4,
        anchor: new google.maps.Point(15, 100),
    };


    let marker = new google.maps.Marker()
    map.addListener('click', function (e) {

        // marker = new google.maps.Marker()
        marker.setMap(null);

        // if (!marker.map) {
        //     console.log('no marker')
        // }
        console.log('marker', marker)

        console.log('lat', e.latLng.lat())
        console.log('lng', e.latLng.lng())

        localStorage.setItem("lat", e.latLng.lat())
        localStorage.setItem("lng", e.latLng.lng())

        marker = new google.maps.Marker({
            position: { lat: e.latLng.lat(), lng: e.latLng.lng() }, //marker的放置位置
            // icon: {
            //     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            //     scale: 10
            // },
            // position: map.getCenter(),
            icon: svgMarker,
            map: map //這邊的map指的是第四行的map變數
        });

        // console.log('marker.map', marker.map)

        // console.log('getBounds', map.getBounds())


    });


    map.addListener('bounds_changed', function (e) {
        localStorage.removeItem("lat")
        localStorage.removeItem("lng")
        console.log('getBounds', map.getBounds())
        bound.Hb.g = map.getBounds().Hb.g
        bound.Hb.i = map.getBounds().Hb.i
        bound.tc.g = map.getBounds().tc.g
        bound.tc.i = map.getBounds().tc.i
        console.log('bound', bound)
        // console.log('getBounds_bounds_changed', map.getBounds())


        // const headers = {
        //     'mode': 'no-cors',
        //     'Access-Control-Allow-Origin': '*',
        //     'Content-Type': 'application/json',
        // }


        // fetch('http://localhost:3000/api/1.0/getgatherings?Hbg=${bound.Hb.g}&Hbi=${bound.Hb.i}&tcg=${bound.tc.g}&tci=${bound.tc.i}', { headers: headers })
        //     .then((response) => {
        //         return response.json();
        //     }).then((jsonData) => {
        //         console.log(jsonData);
        //         for (let i in jsonData.data) {


        //             marker = new google.maps.Marker({
        //                 position: { lat: jsonData.data[i].lat, lng: jsonData.data[i].lng },
        //                 map: map
        //             });

        //         }

        //     })

        let apiPath
        if (tagType === 'search') {
            apiPath = `http://localhost:3000/api/1.0/getgatherings/search?keyword=${tagValue}&`
        } else {
            apiPath = 'http://localhost:3000/api/1.0/getgatherings/all?'
        }

        let geomPath = `Hbg=${bound.Hb.g}&Hbi=${bound.Hb.i}&tcg=${bound.tc.g}&tci=${bound.tc.i}`

        marker.setMap(null);



        // fetch(apiPath + geomPath)
        //     .then((response) => {
        //         return response.json();
        //     }).then((response) => {
        //         console.log(jsonData);
        //         const gatheringList = document.getElementById('gathering-list')
        //         gatheringList.innerHTML = ''

        //         for (let i in response.data) {


        //             marker = new google.maps.Marker({
        //                 position: { lat: response.data[i].lat, lng: response.data[i].lng },
        //                 map: map
        //             });

        //             // <img src="要插入的圖片 URL" alt="圖片替代文字" title="要顯示的文字" border="圖片邊框"></img>
        //             let eventPic = document.createElement('img')
        //             eventPic.src = response.data[i].picture
        //             eventPic.style = `height: 100px;`
        //             eventPic.setAttribute('title', response.data[i].title)
        //             // eventPic.title = response.data[i].title
        //             gatheringList.appendChild(eventPic)
        //             gatheringList.appendChild(document.createTextNode(` ${response.data[i].title}`))
        //             gatheringList.appendChild(document.createElement('br'))

        //             // gatheringList.appendChild(document.createElement('<br>'))

        //         }
        //     })


        const getGatheringList = () => {

            ajax(apiPath + geomPath, function (response) {
                console.log(response);

                const gatheringList = document.getElementById('gathering-list')
                gatheringList.innerHTML = ''

                for (let i in response.data) {


                    marker = new google.maps.Marker({
                        position: { lat: response.data[i].lat, lng: response.data[i].lng },
                        map: map
                    });

                    // <img src="要插入的圖片 URL" alt="圖片替代文字" title="要顯示的文字" border="圖片邊框"></img>
                    let eventPic = document.createElement('img')
                    eventPic.src = response.data[i].picture
                    eventPic.style = `height: 100px;`
                    eventPic.setAttribute('title', response.data[i].title)
                    // eventPic.title = response.data[i].title
                    gatheringList.appendChild(eventPic)
                    gatheringList.appendChild(document.createTextNode(` ${response.data[i].title}`))
                    gatheringList.appendChild(document.createElement('br'))

                    // gatheringList.appendChild(document.createElement('<br>'))

                }


            })

        }

        getGatheringList()


        var socket = io();




        socket.on('updateGatheringList', getGatheringList())



    });


}



