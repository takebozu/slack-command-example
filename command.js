'use strict'

const VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();

const request = require('request-promise')

// middleware that is specific to this router
router.use(bodyParser.urlencoded({
	extended: false,
	type: "application/x-www-form-urlencoded"
}));

// define the home page route
router.post('/', function(req, res) {
	const verificationToken = req.body.token;
	const text = req.body.text;

	if(verificationToken != VERIFICATION_TOKEN) {
		res.status(401);
		res.send("Invalid Request.");
		return;
	} 

	let json = null;
	if (text == "weather") {
		json = getTextMessage();
	} else if (text == "dialog") {
		json = showDialog(req.body.trigger_id);
	} else if (text == "button") {
		json = getButtonMessage();
	} else {
		json = {text: text + "は解釈できませんでした。"};
	}

	res.status(200);
	if (json != null) {
		res.set("Content-Type","application/json");
		res.send(json);
	} else {
		res.end();
	}
});

module.exports = router;

/**
 * テキスト形式のメッセージを返す。
 */
function getTextMessage() {
	return {
		"response_type": "in_channel",	// in_channel or ephemeral
		"text": "It's 80 degrees right now.",
		"attachments": [
    		{
        		"text":"Partly cloudy today and tomorrow"
    		}
		]
	};
}

/**
 * ボタン形式のメッセージを返す。
 * 
 * @param {isEphemeral} trueにすると自分にしか見えないメッセージ。
 */
function getButtonMessage(isEphemeral = true) {
	return {
		"response_type": (isEphemeral? "ephemeral":"in_channel"),	
	    "text": "申請名: プロジェクター購入申請",
	    "attachments": [
	        {
				"title": "詳細を表示",
				"title_link": "https://www.terrasky.co.jp/",

	            "text": "承認しますか？",
	            "callback_id": "approval_process",
	            "attachment_type": "default",
	            "actions": [
	                {
	                    "name": "approval",
	                    "text": "Accept",
	                    "type": "button",
						"style": "primary",
	                    "value": "Accept"
	                },
	                {
	                    "name": "approval",
	                    "text": "I don't know",
	                    "type": "button",
						"value": "None"
	                },
					{
	                    "name": "approval",
	                    "text": "Decline",
	                    "type": "button",
						"style": "danger",
						"value": "Decline"
	                }
	            ]
	        }
	    ]
	};
}

/**
 * Dialog（入力フォーム）を表示する。
 */
function showDialog(triggerId) {

	const json = {
		"trigger_id": triggerId,
  		"dialog": {
	    	"callback_id": "input_form",
	    	"title": "Request a Ride",
	    	"submit_label": "Submit",
	    	"notify_on_cancel": true,
	    	"elements": [
	        	{
	            	"type": "text",
	            	"label": "Pickup Location",
	            	"name": "loc_origin"
	        	},
	        	{
	            	"type": "text",
	            	"label": "Dropoff Location",
	            	"name": "loc_destination"
	        	}
	    	]
  		}
	};

	var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }

    var options = {
        url: "https://slack.com/api/dialog.open",
        method: 'POST',
        headers: headers,
        json: json
    }

    request(options)
    .then(function(response) {
    	//console.log(response.body);
    }).catch(function(e) {
    	console.log(e);
    });
}