// const _ = require('lodash');
// const util = require('../../util/util');
const Gatherings = require('../models/gathering_model');
const User = require('../models/user_model');
const pageSize = 6;
const { s3UploadFile } = require('../../util/util');

const { esSearch } = require('../../util/es_query')

const axios = require('axios')

// require('dotenv').config();
// const validator = require('validator');
// const { TAPPAY_PARTNER_KEY } = process.env;
// const Order = require('../models/order_model');


const getGatherings = async (req, res) => {

    // res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('mode', 'no-cors')
    // res.setHeader('Content-Type', 'application/json')

    const category = req.params.category;
    const paging = parseInt(req.query.paging) || 0;

    async function findGatherings(category) {
        switch (category) {
            case 'all':
                console.log('all')
                return await Gatherings.getGatherings(pageSize, paging, { boundary: [req.query.Hbg, req.query.Hbi, req.query.tcg, req.query.tci] });
            // return await Gatherings.getGatherings(pageSize, paging);
            case 'search': {
                console.log('search')
                const keyword = req.query.keyword;
                // if (keyword) {
                //     return await Gatherings.getGatherings(pageSize, paging, { keyword });
                // }
                // break;

                if (keyword) {
                    let result = await esSearch(keyword)
                    result = result.hits
                    // console.log('esSearch(keyword).hits', result)

                    result = result.map(x => x._source);

                    return await result;
                }
                break;

            }

            case 'details': {
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    return await Gatherings.getGatherings(pageSize, paging, { id });
                }
            }

            case 'participants': {
                console.log('participants')
                const id = parseInt(req.query.id);
                if (Number.isInteger(id)) {
                    return await Gatherings.getParticipants(pageSize, paging, { id });
                }
            }

            case 'mygatheringlist': {

                const userId = parseInt(req.query.id);
                if (Number.isInteger(userId)) {
                    console.log('mygatheringlist')
                    return await Gatherings.getGatherings(pageSize, paging, { userId });
                }
            }

            case 'myhostlist': {

                const hostId = parseInt(req.query.id);
                if (Number.isInteger(hostId)) {
                    console.log('myhostlist')
                    return await Gatherings.getGatherings(pageSize, paging, { hostId });
                }
            }

            default: {
                return await Gatherings.getGatherings(pageSize, paging, { boundary: [req.query.Hbg, req.query.Hbi, req.query.tcg, req.query.tci] });
            }

        };
    }


    const gatheringsList = await findGatherings(category);


    // console.log('gatherin/gsList', gatheringsList)

    if (!gatheringsList) {
        res.status(400).send({ error: 'Wrong Request' });
        return;
    }

    if (gatheringsList.length == 0) {
        if (category === 'details') {
            res.status(200).json({ data: null });
        } else {
            res.status(200).json({ data: [] });
        }
        return;
    }


    console.log('num of result: ', gatheringsList.length)

    if (req.user) {
        res.status(200).send({ data: gatheringsList, user: { name: req.user.name, id: req.user.id } });
    } else {
        res.status(200).send({ data: gatheringsList });
    }


};

// const getGatheringDetail = async (req, res) => {


// }



const hostGathering = async (req, res) => {
    console.log('req.files', req.files)

    console.log('req.body', req.body)

    try {
        let geoInput = `${req.body.county} ${req.body.district} ${req.body.place}`
        let geo = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(geoInput)}&key=AIzaSyBwLNX2P4gamMMFc7dckwq7LRmVYvmWmDI`)

        console.log('geo.data', geo.data)

        const gathering = {
            host_id: req.user.id,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            // picture: req.files.main_image[0].path,
            start_at: req.body.start_at,
            max_participant: req.body.max_participant,
            min_participant: req.body.min_participant,
            place: `${req.body.county} ${req.body.district} ${req.body.place}`,
            // lng: req.body.lng,
            // lat: req.body.lat
            lng: geo.data.results[0].geometry.location.lng,
            lat: geo.data.results[0].geometry.location.lat
        }

        console.log('gathering', gathering)

        let uploadResult = await s3UploadFile(req.files.main_image[0], '/gathering')
        console.log('uploadResult', uploadResult)
        gathering.picture = uploadResult.Location

        const result = await Gatherings.hostGathering(gathering)




        if (result.error) {
            res.status(403).send({ error: result.error });
            return;
        }

        // req.app.io.emit('updateGatheringList', 'DB updated');

        res.status(200).send({
            data: {
                gathering: gathering
            }
        })
        return;



    } catch (err) {
        console.log('err', err.message)
        res.status(403).send({ error: 'invalid address' });
        return;
    }





}


const attendGathering = async (req, res) => {

    let participant = {
        gathering_id: req.query.id,
        participant_id: req.user.id,

    }

    const action = req.params.action;

    let result;

    if (action == 'join') {
        console.log('join')
        result = await Gatherings.attendGathering(participant, 'join')

        // Gatherings.getParticipants(pageSize, paging, { id })

        // return await Gatherings.getGatherings(pageSize, paging);
    } else if (action == 'quit') {
        console.log('quit')
        result = await Gatherings.attendGathering(participant, 'quit')
    }



    participant.participant_name = req.user.name;

    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }


    // let memberData = await User.getUserDetail(req.user.email)

    // console.log('memberData', memberData)


    res.status(200).send({
        data: {
            participant: participant
        },
        action: action
    })
    return;


}




const removeParticipantAdmin = async (req, res) => {


    if (req.user.id != req.query.host_id) {
        res.status(403).send({ error: 'No Permission' });
        return;
    }

    let participant = {
        gathering_id: req.query.gathering_id,
        participant_id: req.query.participant_id,
    }



    let result;


    console.log('quit')
    result = await Gatherings.attendGathering(participant, 'quit')


    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }


    // let memberData = await User.getUserDetail(req.user.email)

    // console.log('memberData', memberData)


    res.status(200).send({
        data: {
            participant: participant
        },
        action: 'remove',
        hostId: req.user.id
    })
    return;


}




const postFeedback = async (req, res) => {


    const feedback = {
        gathering_id: req.body.gatheringId,
        host_id: req.body.hostId,
        user_id: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
    }

    console.log('feedback', feedback)

    const result = await Gatherings.postFeedback(feedback)




    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    // req.app.io.emit('updateGatheringList', 'DB updated');

    res.status(200).send({
        data: {
            feedback: feedback
        }
    })
    return;

}


const getComment = async (req, res) => {

    console.log('gatheringId_comment', req.query)
    let gatheringId = req.query.id

    // console.log('gatheringId_comment', gatheringId)

    const result = await Gatherings.getComment(gatheringId)


    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    // req.app.io.emit('updateGatheringList', 'DB updated');
    // console.log('comment', result)

    res.status(200).send({
        data: { comments: result }
    })
    return;


}



module.exports = {
    getGatherings,
    // getGatheringDetail,
    hostGathering,
    attendGathering,
    removeParticipantAdmin,
    postFeedback,
    getComment,

};

