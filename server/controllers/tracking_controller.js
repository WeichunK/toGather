const tracking = require('../models/tracking_model');

const setTracking = async (req, res) => {

    // res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('mode', 'no-cors')
    // res.setHeader('Content-Type', 'application/json')


    const category = req.params.category;
    let userId;

    // console.log('req.user', req.user)

    if (!req.user) {
        userId = null
    } else {
        userId = req.user.id
    }



    let result
    switch (category) {
        case 'clickGatheringList':
            console.log('clickGatheringList')

            if (!req.user) {
                result = await tracking.clickGatheringList(req.query.id, userId);

            } else {
                result = await tracking.clickGatheringList(req.query.id, userId);
            }


        // return await Gatherings.getGatherings(pageSize, paging);
        // case 'search': {
        //     console.log('search')
        //     const keyword = req.query.keyword;
        //     if (keyword) {
        //         return await Gatherings.getGatherings(pageSize, paging, { keyword });
        //     }
        //     break;

        // }

        // case 'details': {
        //     const id = parseInt(req.query.id);
        //     if (Number.isInteger(id)) {
        //         return await Gatherings.getGatherings(pageSize, paging, { id });
        //     }
        // }

        // case 'participants': {
        //     const id = parseInt(req.query.id);
        //     if (Number.isInteger(id)) {
        //         return await Gatherings.getParticipants(pageSize, paging, { id });
        //     }
        // }

        // default: {
        //     return await Gatherings.getGatherings(pageSize, paging, { boundary: [req.query.Hbg, req.query.Hbi, req.query.tcg, req.query.tci] });
        // }

    };




    if (!result) {
        res.status(400).send({ error: 'Wrong Request' });
        return;
    }

    if (result == 0) {

        res.status(200).json({ data: null });

    }





    res.status(200).send({ tracking: { gatheringId: req.query.id, userId: userId } });




};





module.exports = {
    setTracking,


};