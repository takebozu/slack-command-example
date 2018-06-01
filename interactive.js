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
	let json = JSON.parse(req.body.payload);

	const verificationToken = json.token;
	if(verificationToken != VERIFICATION_TOKEN) {
		res.status(401);
		res.send("Invalid Request.");
		return;
	} 

	console.log(json);
	let responseJson = null;
	switch (json.type) {
		case "interactive_message":
			if (json.callback_id == "approval_process") {
				responseJson = getButtonResponse(json.actions[0].value + "の回答ありがとうございます。");
			}
			break;
		case "dialog_submission":
			if (json.callback_id == "input_form") {
				// Do something such as valication
				postMessage(json.channel.id, "登録ありがとうございます。");
			}
			break;
		case "dialog_cancellation":
			if (json.callback_id == "input_form") {
				// Do something such as valication
			}
			break;
		default:
			break;
	}



	res.status(200);
	if(responseJson != null) {
		res.set("Content-Type", "application/json")
		res.send(responseJson);
	} else {
		res.end();
	}
});

module.exports = router;

function getButtonResponse(message) {
	return {
		//"type": "interactive_message",
		"text": message
	};
}

function postMessage(channel, text) {
	const json = {
		"channel": channel,
  		"text": text,
  		"as_user": false
	};

	var headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN
    }

    var options = {
        url: "https://slack.com/api/chat.postMessage",
        method: 'POST',
        headers: headers,
        json: json
    }

    request(options)
    .then(function(response) {
    	//console.log(response);
    }).catch(function(e) {
    	console.log(e);
    });
}