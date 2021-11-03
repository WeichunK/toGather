const validator = require('validator');
const User = require('../models/user_model');

const signUp = async (req, res) => {

    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        res.status(400).send({ error: 'lack of name or email or password' })
    }

    if (!validator.isEmail(email)) {
        res.status(400).send({ error: 'invalid email format' })
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
    });
    return;
}

const getMemberProfile = async (req, res) => {


    // console.log('req.user.id', req.user.id)
    // let memberData = await User.getUserDetail(req.user.email)



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

module.exports = { signUp, signIn, getMemberProfile }