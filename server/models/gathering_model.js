const { pool } = require('./mysqlcon');

const getGatherings = async (pageSize, paging = 0, requirement = {}) => {
    const conn = await pool.getConnection();
    let result;
    const condition = { sql: '', binding: [] };
    if (requirement.keyword != null) {
        condition.sql = 'WHERE title LIKE ?';
        condition.binding = [`%${requirement.keyword}%`];
    } else if (requirement.boundary != null) {
        condition.sql = 'WHERE lng BETWEEN ? AND ? AND lat BETWEEN ? AND ?';
        condition.binding = requirement.boundary;

    }


    const gatheringQuery = 'SELECT * FROM gathering_2 ' + condition.sql;

    result = await pool.query(gatheringQuery, condition.binding);

    return result[0];

    // try {
    //     // await conn.query('START TRANSACTION');
    //     // const [result] = await conn.query('INSERT INTO product SET ?', product);
    //     // await conn.query('INSERT INTO variant(product_id, color_id, size, stock) VALUES ?', [variants]);
    //     // await conn.query('INSERT INTO product_images(product_id, image) VALUES ?', [images]);
    //     // await conn.query('COMMIT');
    //     if (Hbg) {
    //         console.log('model query', Hbg, Hbi, tcg, tci)
    //         let binding = [Hbg, Hbi, tcg, tci]
    //         result = await conn.query('select * from gathering_2 where lng between ? AND ? AND lat between ? and ?;', binding)
    //     } else {
    //         result = await conn.query('select * from gathering_2')
    //     }
    //     console.log('result', result[0])



    //     return result[0];
    // } catch (error) {
    //     await conn.query('ROLLBACK');
    //     console.log(error)
    //     return -1;
    // } finally {
    //     await conn.release();
    // }
};


module.exports = {
    getGatherings,
    // getProducts,
    // getHotProducts,
    // getProductsVariants,
    // getProductsImages,
};