/////////////////////////////////////////////////////////////USE OF CODE ///////////////////////////
//Login('tom@tom.com','pass')
//AddUser('gib','hansome','tom@tom.com','pass','davedave')

var colors = require("colors");
var mysql = require('mysql');
var crypto = require('crypto');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

colors.setTheme({
  title: ['white', 'italic'],
  error: ['bgRed', 'white', 'bold'],
  info: ['bgYellow', 'white', 'italic'],
  success: ['bgGreen', 'white'],
});

var databaseModule = function() {
    var self = this;
    
    //connect to server
    
    function kissOfLife() {
        connection = mysql.createConnection({
            host: '185.38.45.194',
            user: 'hexcompu_ref',
            password: 'AWDRGY123123',
            database: 'hexcompu_refresh'
        });
        
        connection.connect(function(err) {
            if (err) {
                //console.log('error when connecting to db:', err);
                setTimeout(kissOfLife, 2000);
            }
        });
        
        connection.on("error", function(err) {
            if(err.code === 'PROTOCOL_CONNECTION_LOST') {
                kissOfLife();
            } else {
                throw err;
            }
        });
    }
    
    kissOfLife();

    var SaltLength = 9;
    
    function createHash(password,salt) {
        var hash = md5(password + salt);
        return hash;
    }

    function validateHash(hash, password, salt) {

        var validHash = md5(password + salt);
        return hash === validHash;
    }

    function generateSalt(len) {
        var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
            setLen = set.length,
            salt = '';
        for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
            salt += set[p];
        }
        return salt;
    }

    function md5(string) {
        return crypto.createHash('md5').update(string).digest('hex');
    }
    
    self.addUser = function(fName, lName, eMail, pass, uName, callback) {
        salt = generateSalt(SaltLength);

        connection.query('INSERT INTO UserData SET FirstName=?, LastName=?, Email=?, Hash=?, UserName=?, Salt=?', [fName, lName, eMail,createHash(pass,salt), uName,salt], function (err, rows, fields) {
        if (err) throw err;
        callback(true);
        });
    };
    
    self.login = function(eMail, pass, callback){
        connection.query('SELECT Hash, Salt FROM UserData WHERE Email=?', [eMail], function (err, rows, fields) {
            if (err) console.log( err );
            try {
                if (validateHash(rows[0]['Hash'],pass,rows[0]['Salt']) == true) {
                    //console.log("Database.JS".title + ":" + "Login Successful".success);
                    callback(true);
                    }
                else{

                    console.log("Database.JS".title + ":" + "Login Failed".error);
                    callback(false);
                }
            }
            catch (error){
                if (error.name === "TypeError"){
                    kissOfLife();
                }
            }

        });
    };
    
    self.createSyllabusEntry = function(eMail, examBoard, examSubject, examSyllabus, callback) {
        var toStore = examBoard + ":" + examSubject + ":" + examSyllabus + ";";
        connection.query('UPDATE UserData SET Sylabii = ? WHERE Email = ?', [toStore, eMail], function(err, rows, fields) {
            if (err) console.log(err);
            callback();
        });
    };
};

module.exports = databaseModule;
