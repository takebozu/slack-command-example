'use strict'

const express = require('express')
const app = express()

//--------------------------------------------------------------------------------
// APIサーバーとしての機能
//--------------------------------------------------------------------------------

app.set('port', (process.env.PORT || 5000))

const command = require('./command.js');
app.use('/command', command);

const interactive = require('./interactive.js');
app.use('/interactive', interactive);

// サーバー起動
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
