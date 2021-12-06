const users = [
    {
        id: 1,
        provider: 'native',
        role: 1,
        email: 'test1@gmail.com',
        password: 'test1password',
        name: 'test1',
        popularity: 30,
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png',
        access_token: 'test1accesstoken',
        access_expired: (60 * 60),
        login_at: new Date('2020-01-01')
    },
    {
        id: 2,
        provider: 'native',
        role: 1,
        email: 'test2@gmail.com',
        password: 'test2passwod',
        name: 'test2',
        popularity: 30,
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png',
        access_token: 'test2accesstoken',
        access_expired: 0,
        login_at: new Date('2020-01-01')
    },
    {
        id: 3,
        provider: 'native',
        role: 1,
        email: 'test3@gmail.com',
        password: 'test3passwod',
        name: 'test3',
        popularity: 30,
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png',
        access_token: 'test3accesstoken',
        access_expired: 0,
        login_at: new Date('2020-01-01')
    },
    {
        id: 4,
        provider: 'native',
        role: 1,
        email: 'testsignin@gmail.com',
        password: 'testsigninpasswod',
        name: 'testsignin',
        popularity: 9999,
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/img/member/default_head_person_icon.png',
        access_token: 'testsigninaccesstoken',
        access_expired: 0,
        login_at: new Date('2020-01-01')
    },
];

const gatherings = [
    {
        id: 1,
        title: 'gathering1',
        description: 'gathering1',
        category: '美食美酒',
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg',
        host_id: 1,
        start_at: new Date('2022-01-01'),
        created_at: new Date('2021-11-01'),
        max_participant: 4,
        remaining_quota: 2,
        place: 'place1',
        lng: 121.5624462,
        lat: 25.02230243511096,
        status: 1
    },
    {
        id: 2,
        title: 'gathering2',
        description: 'gathering2',
        category: 'men',
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg',
        host_id: 2,
        start_at: new Date('2022-02-01'),
        created_at: new Date('2021-11-01'),
        max_participant: '12',
        remaining_quota: '12',
        place: 'place2',
        lng: 121.5624462,
        lat: 25.03230243511096,
        status: 1
    },
    {
        id: 3,
        title: 'gathering3',
        description: 'gathering3',
        category: 'men',
        picture: 'https://my-personal-project-bucket.s3.ap-northeast-1.amazonaws.com/gathering/%E4%B8%8B%E8%BC%89+(1).jpeg',
        host_id: 3,
        start_at: new Date('2022-03-01'),
        created_at: new Date('2021-11-01'),
        max_participant: '2',
        remaining_quota: '2',
        place: 'place3',
        lng: 121.5624462,
        lat: 25.04230243511096,
        status: 1
    },
];

const participants = [
    {
        gathering_id: 1,
        participant_id: 2,
        created_at: new Date('2020-01-01'),
    },
    {
        gathering_id: 1,
        participant_id: 3,
        created_at: new Date('2020-01-01'),
    }
];

module.exports = {
    users,
    gatherings,
    participants
};