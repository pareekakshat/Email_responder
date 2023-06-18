# Email_responder
A Node.js based app that is able to respond to emails sent to your Gmail mailbox while you’re out on a vacation. 

## **App Functionality**

1. The app check for new emails in a given Gmail ID.
  
2. The app should send replies to Emails that have no prior replies
     The app  identify and isolate the email threads in which no prior email has been sent by you.
      This means that the app should only reply to first time email threads sent by others to your mailbox.
    
3. The app add a Label to the email and move the email to the label
    
    After sending the reply, the email tagged with a label in Gmail. 
    
5. The app repeat this sequence of steps 1-3 in random intervals of 45 to 120 seconds
