const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'bqqj7ft0jq7wqqbfndsf-mysql.services.clever-cloud.com',
    user: 'uljgwl42yzupcehn',
    password: 'wkRs9YgtFvKWAAY6rafx',
    database: 'bqqj7ft0jq7wqqbfndsf',
    port : 3306
});

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('Connection to database successful!');
    }
} );

module.exports = {connection};