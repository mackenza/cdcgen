const sql = require('mssql');
const insert = require('sql-bricks').insert;

var stocks, cptys;
const numInserts = process.argv[2];

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const getStocks = async () => {
    try {
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'Password1',
            server: 'sqlserver-azure-aus.soldemo.net', 
            database: 'solace' 
        });
        await pool.connect();
        const request = new sql.Request(pool);
        const result = await request.query('select * from dbo.stocks');
        //console.log(result.recordset);
        stocks = result.recordset;
        pool.close();
    } catch (err) {
        console.error(err);
    }
}

const getCptys = async () => {
    try {
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'Password1',
            server: 'sqlserver-azure-aus.soldemo.net', 
            database: 'solace' 
        });
        await pool.connect();
        const request = new sql.Request(pool);
        const result = await request.query('select * from dbo.counterparty');
        //console.log(result.recordset);
        cptys = result.recordset;
        pool.close();
    } catch (err) {
        console.error(err);
    }
}
getStocks()
    .then(() => {
        //console.log('stocks retrieved');
        getCptys()
            .then(() => {
                //console.log('cptys retrieved')
                let numStocks = stocks.length
                let numCptys = cptys.length
                //console.log(numStocks,numCptys);
                for (let i=0; i < numInserts; i++) {
                    console.log(insert('trades', {
                             'qty': randomInt(1000),
                             'stock': stocks[randomInt(numStocks)].symbol,
                             'cpty': cptys[randomInt(numCptys)].cpty
                        }).toString());
                }
            })        
    });
