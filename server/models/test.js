const { pool } = require('./mysqlcon');

// // let condition ={}
// // condition.sql = 'WHERE lng BETWEEN ? AND ? AND lat BETWEEN ? AND ?';
// // condition.binding = [
// //     '121.46997024887692',
// //     '121.55751755112301',
// //     '25.023143930846434',
// //     '25.07026614158626'
// //   ]

// // condition.order = 'ORDER BY created_at DESC;'

// let condition = {
//     sql: 'WHERE lng BETWEEN ? AND ? AND lat BETWEEN ? AND ?',
//     binding: [
//       '121.46997024887692',
//       '121.55751755112301',
//       '25.035042831461986',
//       '25.05837065894886'
//     ],
//     order: 'ORDER BY created_at DESC;'
// }

// const mysqlTest = async function () {



//     const gatheringQuery = 'SELECT g.*, m.email, m.name, m.gender, m.age, m.introduction, m.job, m.title AS host_title, m.picture AS host_pic, m.popularity ,m.coin FROM gathering g LEFT JOIN member m ON g.host_id = m.id ' + condition.sql + condition.order;
//     console.log('query')
//         let result = await pool.query(gatheringQuery, condition.binding);
//         console.log(result[0])

// };

// mysqlTest();





const mysqlTest = async function () {



  const gatheringQuery = 'SELECT * FROM member WHERE email ="test@test.com";'
  console.log('query')
  let [result] = await pool.query(gatheringQuery);
  console.log('result[0].login_at', result[0].login_at)
  let loginAtOld = result[0].login_at.getDate()
  console.log('loginAtOld', loginAtOld)

  const loginAt = new Date();
  console.log('loginAt.getDay()', loginAt.getDate())
  console.log('login', loginAt.getDate() - loginAtOld)
};

mysqlTest();

