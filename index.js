const fs = require('fs');
const { Client, LocalAuth   } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Path where the session data will be stored
//const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook("https://discord.com/api/webhooks/911622536620564480/3rq7eWc1czZ-HJW0R9mXahCYbPbhn0Oc2igOrTJowKHWV60vwCX29rYEQAws9tMGsxgz");
// Load the session data
// Load the session data

const client = new Client({ authStrategy: new LocalAuth({ clientId: "client-one" })
                           ,    puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}

                          });
                          





  
/*
new Client({  authStrategy: new LegacySessionAuth({
        session: sessionCfg
    }),puppeteer: { headless: true }, args: ['--no-sandbox'],

	});
*/	

 client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
	
	qrcode.generate(qr, {small: true}, function (qrcode) {
    console.log(qrcode)
});
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
	console.log(session)
	/*
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
	*/
});
 

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    console.log('MESSAGE RECEIVED', msg);
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
	if(msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = "";
        let mentions = [];
        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }
		console.log("text",text)
		console.log("mentions",mentions)
        await chat.sendMessage(text, { mentions });
    }
});



client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
		hook.send(`${before.from}: ${before.body}`)
    }
});


client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

client.initialize();
