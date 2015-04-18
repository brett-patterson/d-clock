'use strict';

var basicAuth = require('basic-auth'),
    WebSocketServer = require('websocket').server,

    config = require('./config'),
    messages = require('./models/messages'),
    users = require('./models/users'),
    util = require('./util');

/**
 * Send messages to and bind message handlers for a web socket connection
 * @param {websocket.WebSocketConnection} connection - the web socket connection
 * @param {object} user - The connected user
 */
function handleConnection(connection, user) {
    var queueEmpty = false;

    util.asyncWhile(function () {
        return !queueEmpty;
    }, function () {
        return messages.queueFront(user.email).then(function (message) {
            if (message === undefined) {
                queueEmpty = true;
            } else {
                connection.send(JSON.stringify(message));
            }
        }).fail(function (error) {
            //TODO: log error
            queueEmpty = true;
        });
    });

    connection.on('message', function (wsMessage) {
        if (wsMessage.type === 'utf8') {
            var data = JSON.parse(wsMessage.utf8Data);
            if (data.received) {
                messages.dequeue(user.email, data.id);
            }
        }
    });
}

/**
 * Attach a WebSocket server to send messages to clients.
 * @param {http.Server} server - the HTTP server instance to attach to
 * @return {websocket.WebSocketServer} The websocket server instance
 */
var attach = function (server) {
    var wsServer = new WebSocketServer({
        httpServer: server
    });

    wsServer.on('request', function (request) {
        var auth, protocol = config.server.messageProtocol;

        if (request.resource !== config.server.messagesPath ||
                request.requestedProtocols.indexOf(protocol) < 0) {
            request.reject(400, 'Bad Request');
            return;
        }

        auth = basicAuth(request.httpRequest);
        if (auth !== undefined) {
            users.authenticate(auth.name, auth.pass).then(function (user) {
                if (user) {
                    handleConnection(request.accept(protocol, request.origin),
                                     user);
                } else {
                    request.reject(403, 'Forbidden');
                }
            }).fail(function () {
                request.reject(500, 'Internal Server Error');
            });
        } else {
            request.reject(401, 'Unauthorized');
        }
    });

    return wsServer;
};

module.exports = attach;
