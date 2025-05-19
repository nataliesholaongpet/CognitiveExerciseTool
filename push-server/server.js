const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const publicVapidKey = 'BPAz2Rvk6nj4t7cUBaJc3B70ZXOUxfuEoi-LohzpbMbosWwLjBcRRlhq09w_kM2FjYZhPuy6uCE-s3mTu9sq2ig';
const privateVapidKey = 'A5GPCqIVn0j5kLsbTx9uD2DR9OsJnxXBhmi2tkSCVUg';

webpush.setVapidDetails(
  'mailto:crownofnatalie@gmail.com',
  publicVapidKey,
  privateVapidKey
);

let subscriptions = []; 

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log('New subscription: ', subscription);
});

app.post('/send', async (req, res) => {
  const notificationPayload = {
    title: 'Reminder',
    body: 'This is a test push notification!',
    icon: '/icon.png',
  };

  const payload = JSON.stringify(notificationPayload);

  try {
    for (const sub of subscriptions) {
      await webpush.sendNotification(sub, payload);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Push Error:', error);
    res.sendStatus(500);
  }
});

app.listen(4000, () => console.log('Push server running on port 4000'));

const reminders = [];

app.post('/reminders', (req, res) => {
  const { subscription, reminder } = req.body;
  const delay = new Date(reminder.time).getTime() - Date.now();

  if (delay > 0) {
    setTimeout(() => {
      const payload = JSON.stringify({
        title: reminder.title,
        body: reminder.body,
        icon: '/icon.png'
      });

      webpush.sendNotification(subscription, payload).catch(console.error);
    }, delay);
  }

  res.status(201).json({ success: true });
});
