var app = require('express')();

var fs = require('fs');
var url = require('url');
var config = require('./config.js');

const server = require('https').createServer({
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert),
    ca: fs.readFileSync(config.ca),
    requestCert: false,
    rejectUnauthorized: false
}, app);

server.listen(8443);

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.use((socket, next) => {
    if (authenticateUser(socket.request)) {
        next();
    }

    socket.emit({hello: 'You failed'}, data => {
        console.log(data);
        socket.disconnect(true);
    });
});

function authenticateUser(headers) {
    console.log(`TODO: Authenticate user with ${headers.bearer}`);
    return true;
}

var channel = io.on('connection', function (socket) {
    
    socket.emit('news', {hello: 'world'});
    socket.on('impulse', function(data) {
        channel.emit(data.id, {hello: 'world'});
        console.log(data);
    });
});
