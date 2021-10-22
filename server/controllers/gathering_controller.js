// const _ = require('lodash');
// const util = require('../../util/util');
const Gatherings = require('../models/gathering_model');
const pageSize = 6;


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
                if (keyword) {
                    return await Gatherings.getGatherings(pageSize, paging, { keyword });
                }
                break;


            }

            default: {
                return await Gatherings.getGatherings(pageSize, paging, { boundary: [req.query.Hbg, req.query.Hbi, req.query.tcg, req.query.tci] });
            }

        };
    }





    const gatheringsList = await findGatherings(category);

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
    res.status(200).send({ data: gatheringsList });

};

module.exports = {
    getGatherings,

};

