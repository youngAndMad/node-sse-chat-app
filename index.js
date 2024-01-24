const express = require('express');
const app = express();

let users = []
let messages = []
let userIdCounter = 1

app.use('/mychat', express.static('mychat'))

app.get('/', (req, res) => {
    res.send('Hello World from Danekerscode')
});

app.get('/json', (req, res) => {
    res.json(
        {
            text: "hi",
            numbers: [1, 2, 3]
        }
    )
})

app.get('/echo', (req, res) => {
    const param = req.query.param
    res.json(
        {
            param: param,
            length: param.length
        }
    )
})

app.get('/sse', async function (req, res, next) {
    const username = req.query.username

    const user = {
        id: userIdCounter++,
        username: username,
        connection: res
    }

    users.push(user)
    console.log('new connection ', user.username);

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'X-User-Id': user.id
    });
    res.flushHeaders();

    req.on('close', () => {
        console.log(`${username} Connection closed`);
    });

});


const sendEventsToAll = (newMsg) => {
    users.forEach(user => user.connection.write(`data: ${JSON.stringify(newMsg)}\n\n`))
}

app.post('/message', (req, res, next) => {
    const value = req.query.value;
    const username = req.query.username
    messages.push(value);
    res.json({ success: true })
    return sendEventsToAll(`author: ${username}: ${value}`);
})

app.listen(3000, () => console.log('Server Up And Running. Listening On Port 3000'));