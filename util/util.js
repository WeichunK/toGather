require('dotenv').config();
const User = require('../server/models/user_model');
const { TOKEN_SECRET, AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const S3 = require('aws-sdk/clients/s3')

const authentication = (roleId) => {
    return async function (req, res, next) {
        let accessToken = req.get('Authorization');
        // console.log("req.get('Authorization')", accessToken)
        if (!accessToken) {
            if (roleId == 3) {
                console.log('no access token')
                next();
            } else {
                res.status(401).send({ error: 'Unauthorized' });
                return;
            }

        } else {

            accessToken = accessToken.replace('Bearer ', '');
            if (accessToken == 'null') {
                res.status(401).send({ error: 'Unauthorized' });
                return;
            }

            try {
                const user = jwt.verify(accessToken, TOKEN_SECRET);
                req.user = user;
                if (roleId == null) {
                    next();
                } else {
                    let userDetail;
                    if (roleId == 1 | roleId == 3) {
                        userDetail = await User.getUserDetail(user.email);
                    } else {
                        userDetail = await User.getUserDetail(user.email, roleId);
                    }
                    if (!userDetail) {
                        res.status(403).send({ error: 'Forbidden' });
                    } else {
                        req.user.id = userDetail.id;
                        req.user.name = userDetail.name;
                        req.user.picture = userDetail.picture;
                        req.user.role_id = userDetail.role;
                        req.user.introduction = userDetail.introduction
                        req.user.job = userDetail.job
                        req.user.title = userDetail.title
                        req.user.age = userDetail.age
                        req.user.popularity = userDetail.popularity
                        next();
                    }
                }
                return;
            } catch (err) {
                res.status(403).send({ error: 'Forbidden' });
                return;
            }
        }

    };
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // const gatheringId = req.body.gatheringId;
            const gatheringId = 'gathering_pic'
            const imagePath = path.join(__dirname, `../public/assets/${gatheringId}`);
            if (!fs.existsSync(imagePath)) {
                fs.mkdirSync(imagePath);
            }
            cb(null, imagePath);
        },
        filename: (req, file, cb) => {
            const customFileName = crypto.randomBytes(18).toString('hex').substr(0, 8);
            const fileExtension = file.mimetype.split('/')[1]; // get file extension from original file name
            cb(null, customFileName + '.' + fileExtension);
        }
    }),
    limits: { fileSize: 1000000 }
});

const getImagePath = (protocol, hostname, gatheringId) => {
    if (protocol == 'http') {
        return protocol + '://' + hostname + ':' + port + '/assets/' + gatheringId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + gatheringId + '/';
    }
};

const s3 = new S3({
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY
})

function s3UploadFile(file, path = '') {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME + path,
        Body: fileStream,
        Key: file.filename,
        ACL: 'public-read'
    }
    console.log('uploadParams', uploadParams)
    return s3.upload(uploadParams).promise()
}

module.exports = {
    authentication,
    upload,
    getImagePath,
    s3UploadFile,
};