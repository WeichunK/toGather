const tracking = require('../models/tracking_model');

const setTracking = async (req, res) => {

    const category = req.params.category;
    let userId;
    if (!req.user) {
        userId = null
    } else {
        userId = req.user.id
    }
    let trackingResult
    switch (category) {
        case 'clickGatheringList':
            // console.log('clickGatheringList')
            if (!req.user) {
                trackingResult = await tracking.clickGatheringList(req.query.id, userId);
            } else {
                trackingResult = await tracking.clickGatheringList(req.query.id, userId);
            }
    };
    if (trackingResult.error) {
        res.status(403).send({ error: 'Wrong Request' });
        return;
    }
    res.status(200).send({ tracking: { gatheringId: req.query.id, userId: userId } });
};

module.exports = {
    setTracking,
};