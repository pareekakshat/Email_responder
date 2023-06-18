const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const fs = require('fs').promises;
const {authenticate} require('@google-cloud/local-auth');
const {google} = require('googleapis');
 
const SCOPES =[
  https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail. send',
    'https://www.googleapis.com/auth/gmail.) .labels',
    'https://mail.google.com/'
 ];  <- #11-16 const SCOPES
                   I
app.get('/', async (req, res) => {
  // Load client secrets from a local file.
  const credentials = await fs.readFile('credentials.json');
  app.get('/', async (req, res) => {
  
  // Load client secrets from a local file.
  const credentials = await fs.readFile('credentials.json');

  
  // Authorize a client with credentials, then call the Gmail APT.
  const auth = await authenticate({
    keyfilePath: path. join( __dirname, 'credentials. json'),
    scopes: SCOPES,
  });
   console.log("THIS is AUTH = ", auth);
   const gmail = google.gmail({version: 'V1', auth});
   const response = await gmail.users.labels.list({
      userId:'me',
   }

   ); <- #38-42 const response = await gmail.users.labels.list

   const LABEL_NAME = 'Vacation';


   //load credentials from file
   async function loadCredentials(){
    const filePath = path.join(process.cwd(), 'credentials.json');
    const content = await fs.readFile(filePath, {encoding: 'utf8'});
    return JSON.parse(content);
   }  <- #48 async function loadCredentials()


   //Get message that have no prior replies
   async function getUnrepliedMessages(auth){
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: '-in:chats - from:me -has:userlabels',
    });
    return res.data.messages || [];
   } <-#56-63 aync function getUnrepliedMessages(auth)

   //send reply to messages
   async function sendReply(auth, messages) {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: '-in:chats - from:me - has:userlabels',
    });
    return res.data.messages || [];
   } <- #56-63 async function getUnrepliedMessages(auth)

   //send replyu to a message
   async function sendReply(auth, message){
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
      format: 'metadata',
      metadataHeaders: ['Subject', 'From'],
    }); <- #68-73 const res = await gmail.users.messges.get

    const subject = res.data.payload.headers.find(
      (header) => header.name === 'Subject'
    ).value;
    const replyTo = from.match(/<(.*)>/)[1];
    const replySubject = subject.startWith('Re:') ? subject : `Re: ${subject}`;
    const replyBody = `Hi, \n\n I'm currently on vacation and will get back to you soon.\n\nBest, \nYour Name`;
    const rawMessage = [
      `From: me`,
      `To: ${replyTo}`,
      `Subject: ${replySubject}`;
      `In- Reply-To: ${message.id}`,
      `Reference: ${message.id}`,
      '',
      replyBody,
    ].join('\n'); <- #89-97 const rawMessage = 

    const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      }
    }); <- #103-108 await gmail.users.messages.send
  } <-#66-109 async function sendReply(auth, message)




  async function createLabel(auth){
    const gmail = google.gmail({version: 'v1', auth});


    try {
      const res = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: LABEL_NAME,
          labelListVisibility: 'labelShow',  //change this value
          messageListVisibility: 'show', // change this value
        });
        return res.data.id;
      }catch(err) {
        if(err.code === 409){
          //label already exists
          const res = await gmail.users.labels.lest({
            userId: 'me',
          });
          const label = res.data.labels.find((label)=> label.name === LABEL_NAME);
          return label.id;
        }
        else{ 
          throw err;
        }
      } <- #154-165 catch(err)
    } <-#140-166 async function createLabel(auth)

    //add label to a message and move it to the label folder
    async function addLabel(auth, message, labelId){
      const gmail = google.gmail({version: 'v1', auth});
      await gmail.users.messages.modify({
        userId: 'me',
        id: message.id,
        requestBody: {
          addLabelIds:[labelId],
          removeLabelIds: ['INBOX'],
        },
      }); <- #173 - 180 await gmail.users.message.modify
    } <- #171-181 asyncnction addLabel(auth, message, labelId)

    // Main function
    async function main(){


      // create a label for the app
      const labelId = await createLabel(auth);
      console.log(`created or found label with id ${labelId}`);

      //Repeat the following steps in random intervals
      setInterval(async() => {
        //get message that have no prior replies
        const messages  = await getUnrepliedMessages(auth);
        console.log(`Found ${messages.length} unreplied messages`);


        //foreach message
        for(const message of messages){
          //send reply to the message
          await sendReply(auth, message);
          console.log(`Sent reply to message with id ${message.id}`);

          //Add label to the message and move it to the label folder
          await addLabel(auth, message, labelId);
          console.log(`Added label to message with id $ {message.id}`);
        } <- #200-208 for (const message of messages)
      }, Math.floor(Math.random() * (120 -45 + 1) + 45) * 1000); //Random interval between 45 and 120 seconds 
        <- #194-209 setInterval 
    } <- #186-210 async function main()

    main(). catch(console.error);



    const labels = response.data.labels;
    res.send("You have successfully subscribed to our services.");
   });  <-#20-220 app.get


   app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
   });
