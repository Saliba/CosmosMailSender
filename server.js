var express = require('express');
var app = express();

app.get('/:version/:time', function (req, res) {
	var nodemailer = require('nodemailer');
	var email = "";
	var password = "";
	var transporter = nodemailer.createTransport('smtps://'+email+':'+password+'@smtp.gmail.com');

	var fixVersion = req.params.version;
	var time = req.params.time;
	var request = require('request'),
	    username = "",
	    password = "",
	    url = "https://travix.atlassian.net/rest/api/2/search?jql=fixVersion%20%20%3D%20" + fixVersion,
	    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

	request(
	    {
	        url : url,
	        headers : {
	            "Authorization" : auth
	        }
	    },
	    function (error, response, body) {
	      var text = "";
	      text = `Hi all,<br><br>
			We would like to notify you of our intention to release version ${fixVersion} of the Travix backoffice systems to production at ${time} which includes a new version of Traxx.
			<br><br>
			Highlights of this release:<br><br>`;
	      JSON.parse(body).issues.forEach(function (item) {
	        text += '- ' + item.key + ': ' + item.fields.summary + '<br>';
	      });
	      text += `<br><br>Release notes can be found at http://jira-extension.dev.travix.nl/ReleaseNotes/index.html#!/${fixVersion}.`
	      var mailOptions = {
	          from: '"Cosmos Team" <'+ email +'>', // sender address
	          to: 'lucasaliba@gmail.com', // change this to prod-notify
	          subject: '[Cosmos] Intention to release ' + fixVersion + ' at '+ time, // Subject line
	          html: text
	      };

	      transporter.sendMail(mailOptions, function(error, info){
	        if(error){
	            return console.log(error);
	        }
	      });
	    }
	);


   res.send("Email sent");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
