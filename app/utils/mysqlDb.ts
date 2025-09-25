import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'srv1951.hstgr.io',
  user: 'u999765516_avanzia',
  password: '~w3R^!jYN[]4',
  database: 'u999765516_avanzia',
});

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: "root",
//   password: "",
//   database: "eventpro",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
//   });

export default pool;
