'use strict'

const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
//const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const { createMessageAdapter } = require('@slack/interactive-messages');
const slackInteractions = createMessageAdapter(VERIFICATION_TOKEN);

// middleware that is specific to this router
router.use(bodyParser.urlencoded({
	extended: false,
	type: "application/x-www-form-urlencoded"
}));

router.use('/', slackInteractions.expressMiddleware());

//3つのボタンから1つを選んだ場合の処理
slackInteractions.action('approval_process', (payload, respond) => {
     respond({
     	text: payload.actions[0].value + "の回答ありがとうございます。"
     });
});

//DialogでSubmitした場合の処理
//DialogでCancelした場合(type=dialog_cancellation)のハンドラーが現行SDKのバージョンだと書けない模様（Cancelすると常に404が返ってしまう）
slackInteractions.action({ callbackId: 'input_form', type: 'dialog_submission' }, (payload, respond) => {
     respond({
     	text: "登録ありがとうございます。"
     });
});

module.exports = router;

