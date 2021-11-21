

let url = location.href
let tagValue = 'all'
let tagType
if (url.indexOf('?') !== -1) {
    tagType = url.split('?')[1].split('=')[0]
    tagValue = url.split('?')[1].split('=')[1]
}

let map;

// let bound = { Hb: {}, tc: {} }

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
        mapTypeControl: false,
        streetViewControl: false,
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



    let ne;
    let sw;
    let bound_w;
    let bound_e;
    let bound_s;
    let bound_n;

    map.addListener('bounds_changed', async function (e) {
        localStorage.removeItem("lat")
        localStorage.removeItem("lng")
        console.log('getBounds', map.getBounds())
        console.log('getBounds', typeof map.getBounds())

        ne = map.getBounds().getNorthEast();
        sw = map.getBounds().getSouthWest();

        bound_w = sw.lng()
        bound_e = ne.lng()
        bound_s = sw.lat()
        bound_n = ne.lat()

        // bound.Hb.g = map.getBounds().Hb.g
        // bound.Hb.i = map.getBounds().Hb.i
        // bound.tc.g = map.getBounds().tc.g
        // bound.tc.i = map.getBounds().tc.i
        // console.log('bound', bound)
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
            apiPath = `/api/1.0/getgatherings/search?keyword=${tagValue}&`
        } else {
            apiPath = '/api/1.0/getgatherings/all?'
        }

        let geomPath = `Hbg=${bound_w}&Hbi=${bound_e}&tcg=${bound_s}&tci=${bound_n}`

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
                gatheringList.style = `border-style: none; border-color: light; width:98%;`
                gatheringList.innerHTML = ''

                if (tagType === 'search') {
                    if (response.data.length == 0) {

                    }
                    var initPoint = { lat: response.data[0].lat, lng: response.data[0].lng };
                    map = new google.maps.Map(document.getElementById("map"), {
                        center: initPoint,
                        zoom: 14,
                    });
                }


                for (let i in response.data) {


                    marker = new google.maps.Marker({
                        position: { lat: response.data[i].lat, lng: response.data[i].lng },
                        map: map,
                        // icon: {
                        //     path: google.maps.SymbolPath.CIRCLE,
                        //     fillColor: '#FFFFFF',
                        //     fillOpacity: 1,
                        //     strokeColor: '#66A8FF',
                        //     strokeWeight: 3,
                        //     scale: 6
                        // },
                        icon: {
                            url: "../assets/3440906_map_marker_navigation_pin_icon.png", // url
                            scaledSize: new google.maps.Size(40, 40), // scaled size
                            // origin: new google.maps.Point(0, 0), // origin
                            // anchor: new google.maps.Point(0, 0) // anchor

                        }
                    });


                    // const clickGathering = function (gatheringId) {

                    //     console.log(gatheringId)
                    //     window.location.href = `/gathering.html?id=${gatheringId}`
                    // }

                    // <img src="要插入的圖片 URL" alt="圖片替代文字" title="要顯示的文字" border="圖片邊框"></img>





                    // <div class="card mb-3" style="max-width: 540px;">
                    //     <div class="row g-0">
                    //         <div class="col-md-4">
                    //             <img src="..." class="img-fluid rounded-start" alt="...">
                    //         </div>
                    //         <div class="col-md-8">
                    //             <div class="card-body">
                    //                 <h5 class="card-title">Card title</h5>
                    //                 <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    //                 <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>




                    let eventBlock = document.createElement('div')
                    eventBlock.setAttribute('class', 'card mb-3 border-light gathering')
                    // eventBlock.setAttribute('value', 'gathering')
                    // eventBlock.setAttribute('onclick', `return clickGathering(${response.data[i].id});`)
                    eventBlock.setAttribute('onclick', `location.href='/gathering.html?id=${response.data[i].id}';`)
                    eventBlock.setAttribute('id', response.data[i].id)
                    eventBlock.setAttribute('idvalue', response.data[i].id)
                    eventBlock.style = "max-width: 100%; cursor:pointer; margin-top: 1rem;"


                    let eventBlockRow = document.createElement('div')
                    eventBlockRow.setAttribute('class', 'row g-0')
                    eventBlockRow.setAttribute('idvalue', response.data[i].id)
                    let eventBlockRowPic = document.createElement('div')
                    eventBlockRowPic.setAttribute('class', 'col-md-4')
                    eventBlockRowPic.setAttribute('idvalue', response.data[i].id)
                    // eventBlockRowPic.style = "min-height:80%;"
                    eventBlockRowPic.style = "width:255px !important; height:170px !important; display: flex;justify-content: center;flex-direction: column;"

                    let eventPic = document.createElement('img')
                    eventPic.setAttribute('class', 'figure-img img-fluid rounded')
                    eventPic.setAttribute('src', response.data[i].picture)
                    eventPic.style = "margin: 0 0; object-fit: cover; width:90%;height:90%; border-radius: 0.8rem !important;"
                    eventPic.setAttribute('idvalue', response.data[i].id)

                    eventBlockRowPic.appendChild(eventPic)

                    let eventBlockRowContent = document.createElement('div')
                    eventBlockRowContent.setAttribute('class', 'col-md-8')
                    eventBlockRowContent.setAttribute('idvalue', response.data[i].id)
                    eventBlockRowContent.style = "width: 55% !important; flex-shrink: 1;"

                    let eventBlockRowCardBody = document.createElement('div')
                    eventBlockRowCardBody.setAttribute('class', 'card-body')
                    eventBlockRowCardBody.setAttribute('idvalue', response.data[i].id)

                    let eventBlockRowCardTitle = document.createElement('span')
                    eventBlockRowCardTitle.setAttribute('class', 'card-title')
                    eventBlockRowCardTitle.setAttribute('idvalue', response.data[i].id)
                    eventBlockRowCardTitle.appendChild(document.createTextNode(` ${response.data[i].title}`))

                    eventBlockRowCardTitle.style = "color: var(--card-typography-color-primary, #222222) !important;word-break: break-all !important;font-size: 18px !important;line-height: 24px !important;"

                    let shortDivider = document.createElement('div')
                    shortDivider.style = "margin-top: 11px; width: 32px;border-top: 1px solid rgb(221, 221, 221) !important;"


                    let eventBlockRowCardText = document.createElement('p')
                    eventBlockRowCardText.setAttribute('class', 'card-text')
                    eventBlockRowCardText.setAttribute('idvalue', response.data[i].id)
                    // eventBlockRowCardText.appendChild(document.createTextNode(` ${response.data[i].description.substring(0, 30)}...`))
                    eventBlockRowCardText.appendChild(document.createTextNode(response.data[i].description))


                    eventBlockRowCardText.style = "margin-top: 9px;color: rgb(113, 113, 113) !important;margin-right: 3px!important;line-height: 18px !important;max-height: 18px!important;overflow: hidden !important;text-overflow: ellipsis !important;display: -webkit-box !important;-webkit-line-clamp: 1 !important;-webkit-box-orient: vertical !important;animation-duration: 0.3s !important;animation-name: keyframe_18jn58a !important;animation-timing-function: ease-in-out !important;opacity: 1 !important;"

                    let eventBlockRowCardHost = document.createElement('p')
                    eventBlockRowCardHost.setAttribute('idvalue', response.data[i].id)
                    eventBlockRowCardHost.setAttribute('class', 'card-text')
                    eventBlockRowCardHost.style = "margin-top:3rem;"

                    let eventBlockRowCardHostSmall = document.createElement('small')
                    eventBlockRowCardHostSmall.setAttribute('idvalue', response.data[i].id)
                    eventBlockRowCardHostSmall.setAttribute('class', 'text-muted')

                    eventBlockRowCardHostSmall.appendChild(document.createTextNode(`發起人: ${response.data[i].name}`))
                    eventBlockRowCardHost.appendChild(eventBlockRowCardHostSmall)


                    eventBlockRowCardBody.appendChild(eventBlockRowCardTitle)
                    eventBlockRowCardBody.appendChild(shortDivider)

                    eventBlockRowCardBody.appendChild(eventBlockRowCardText)
                    eventBlockRowCardBody.appendChild(eventBlockRowCardHost)

                    eventBlockRowContent.appendChild(eventBlockRowCardBody)


                    eventBlockRow.appendChild(eventBlockRowPic)
                    eventBlockRow.appendChild(eventBlockRowContent)


                    eventBlock.appendChild(eventBlockRow)


                    gatheringList.appendChild(eventBlock)
                    // gatheringList.appendChild(document.createElement('br'))


                    let divider = document.createElement('div')
                    divider.style = 'margin-top: 6px; margin-bottom: 6px; border-style: solid; border-bottom: solid; border-color: rgb(235, 235, 235); border-width: 1px; width: 100%'

                    gatheringList.appendChild(divider)



                    {/* 

                    // eventBlock.style = `border - style: solid; border - color: grey; width: 100 %; cursor: pointer; border - left: grey; border - right: grey; `
                    eventBlock.style = `width: 100 %; cursor: pointer; border - left: grey; border - right: grey; `
                    let eventPic = document.createElement('img')
                    eventPic.src = response.data[i].picture
                    eventPic.style = `width: 200px; height: 200px; border - radius: 20 %; `
                    eventPic.setAttribute('title', response.data[i].title)
                    eventPic.setAttribute('class', 'eventPic')
                    // eventPic.title = response.data[i].title
                    eventBlock.appendChild(eventPic)
                    eventBlock.appendChild(document.createTextNode(` ${ response.data[i].title } `))
                    eventBlock.appendChild(document.createElement('br'))
                    eventBlock.appendChild(document.createTextNode(`團主: ${ response.data[i].name } `))


                    gatheringList.appendChild(eventBlock)
                    // gatheringList.appendChild(document.createElement('br'))


                    let divider = document.createElement('div')
                    divider.style = `margin - top: 12px; margin - bottom: 12px; border - style: solid; border - bottom: solid; border - color: rgb(235, 235, 235); border - width: 1px; width: 100 % `

                    gatheringList.appendChild(divider) */}





                    // gatheringList.appendChild(document.createElement('<br>'))

                }


            })

        }

        getGatheringList()


        // var socket = io();




        // socket.on('updateGatheringList', getGatheringList())



    });





    // const head = document.getElementsByTagName('HEAD').item(0);


    // style.href = './styles/home.css';
    // style.rel = 'stylesheet';
    // style.type = 'text/css';

    let mapForHost = new google.maps.Map(document.getElementById("mapForHost"), {
        center: initPoint,
        zoom: 14,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
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
    mapForHost.addListener('click', function (e) {

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
            // icon: "../assets/65867_pin_push_icon.png",
            // icon: {
            //     path: google.maps.SymbolPath.CIRCLE,
            //     fillColor: '#FFFFFF',
            //     fillOpacity: 1,
            //     strokeColor: '#00FF00',
            //     strokeWeight: 3,
            //     scale: 6
            // },
            map: mapForHost //這邊的map指的是第四行的map變數
        });

        // console.log('marker.map', marker.map)

        // console.log('getBounds', map.getBounds())


    });

}



module.exports = { initMap }


