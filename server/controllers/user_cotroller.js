const validator = require('validator');
const User = require('../models/user_model');
const { s3UploadFile } = require('../../util/util');

const signUp = async (req, res) => {

    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        res.status(400).send({ error: 'lack of name or email or password' })
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'invalid email format' })
        return;
    }
    let lengthOfName;
    if (/[\u4e00-\u9fa5]/.test(name)) {
        lengthOfName = name.length * 2;
    } else {
        lengthOfName = name.length;
    }
    if (lengthOfName > 20) {
        res.status(403).send({ error: 'Exceed the length limit!' });
        return;
    }

    const role = 1;
    const provider = 'native'

    const result = await User.signUp(name, email, password, provider, role)
    if (result.error) {
        res.status(403).send({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    res.status(200).send({
        data: {
            access_token: user.access_token,
            access_expired: user.access_expired,
            login_at: user.login_at,
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email,
                picture: user.picture
            }

        }
    })
    return;
}

const nativeSignIn = async (email, password) => {
    if (!email || !password) {
        return { error: 'Request Error: email and password are required.', status: 400 };
    }

    try {
        return await User.nativeSignIn(email, password);
    } catch (error) {
        return { error };
    }
};

const signIn = async (req, res) => {
    const data = req.body;
    console.log('req.body', req.body)
    let result;
    switch (data.provider) {
        case 'native':
            result = await nativeSignIn(data.email, data.password);
            break;
        case 'facebook':
            result = await facebookSignIn(data.access_token);
            break;
        default:
            result = { error: 'Wrong Request' };
    }

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user) {
        res.status(500).send({ error: 'Database Query Error' });
        return;
    }

    console.log('user.bonus', user.bonus)

    res.status(200).send({
        data: {
            access_token: user.access_token,
            access_expired: user.access_expired,
            login_at: user.login_at,
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email,
                picture: user.picture,
                bonus: user.bonus,
            }
        }
    });
    return;
}

const getMemberProfile = async (req, res) => {

    res.status(200).send({
        data: {
            id: req.user.id,
            provider: req.user.provider,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture,
            introduction: req.user.introduction,
            job: req.user.job,
            title: req.user.title,
            age: req.user.age,
            popularity: req.user.popularity,
            coin: req.user.coin,
        }

    });
    return;
}

const getProfile = async (req, res) => {

    let userId = req.query.id

    let result = await User.getProfile(userId)
    console.log('result ', result)
    res.status(200).send({
        data: {
            id: result.id,
            provider: result.provider,
            name: result.name,
            email: result.email,
            picture: result.picture,
            introduction: result.introduction,
            job: result.job,
            title: result.title,
            age: result.age,
            popularity: result.popularity,

        }
    });
    return;
}



const getUserRating = async (req, res) => {

    console.log('req.user.id', req.user.id)
    let result = await User.getUserRating(req.user.id);
    console.log('result', result)

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({ error: result.error });
        return;
    }


    res.status(200).send({ data: result });
    return;
}



const updatePhoto = async (req, res) => {

    try {

        console.log('req.files', req.files)
        const photo = {
            picture: req.files.main_image[0].path,
        }

        console.log('photo', photo)

        let uploadResult = await s3UploadFile(req.files.main_image[0], '/member')
        console.log('uploadResult', uploadResult)
        photo.picture = uploadResult.Location

        const result = await User.updatePhoto(photo, req.user.id)


        if (result.error) {
            res.status(403).send({ error: result.error });
            return;
        }

        // req.app.io.emit('updateGatheringList', 'DB updated');

        res.status(200).send({
            data: {
                photo: photo
            }
        })

    } catch (error) {
        res.status(404).send(error)
    }

    return;

}




module.exports = { signUp, signIn, getMemberProfile, getProfile, getUserRating, updatePhoto }