const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var nodeMailer= require('nodemailer');
var helper = require('sendgrid').mail
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var app = express();
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
	res.render('index');
});

app.get('/about', (req, res)=>{
	res.render('about');
});

app.get('/contact', (req, res)=>{
	res.render('contact');
});

app.post('/contact/send', (req, res)=>{

	var msg = `You have a submission with the following details ... Name: ${req.body.name}, Message: ${req.body.message}`;
	var mailOptions = {
		'from': new helper.Email(req.body.email),
		'to_email': new helper.Email("shifatsalim@gmail.com"),
		'subject': 'Website Submission',
		'text': new helper.Content("text/plain",msg )
	}

	mail = new helper.Mail(mailOptions.from, mailOptions.subject, mailOptions.to_email, mailOptions.text);

	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON()
	});

	sg.API(request, (error, response)=> {
	 
	  if(error){
			console.log(error);
			res.redirect('/');
		}else{
			 console.log(response.statusCode)
		  console.log(response.body)
		  console.log(response.headers)
			res.redirect('/');

		}
	});
	

});

app.listen(3000);
console.log('Server is running on 3000');