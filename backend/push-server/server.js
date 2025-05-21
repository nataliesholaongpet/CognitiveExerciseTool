const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const cron = require('node-cron');
const path = require('path');

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

const reminder_file = path.join(__dirname, 'reminders.json');
const subscription_file = path.join(__dirname, 'subscriptions.json');

function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch {
    return [];
  }
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let reminders = loadJSON(reminder_file);
let subscriptions = loadJSON(subscription_file);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  if (!subscriptions.find(sub => JSON.stringify(sub) === JSON.stringify(subscription))) {
    subscriptions.push(subscription);
    saveJSON(subscription_file, subscriptions);
  }

  res.status(201).json({});
});

app.post('/reminder', (req, res) => {
  const { subscription, reminder } = req.body;

    const newReminder = {
    id: Date.now(),
    time: reminder.time,
    text: reminder.text,
    subscription
  };

  reminders.push(newReminder);
  saveJSON(reminder_file, reminders);

  res.status(201).json({ success: true });
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

cron.schedule('* * * * *', () => {
  const now = Date.now();

  const dueReminders = reminders.filter(r => new Date(r.time).getTime() <= now);

  for (const reminder of dueReminders) {
    const payload = JSON.stringify({
      title: 'Lifestyle Reminder',
      body: reminder.text,
      icon: '/CognitiveExerciseTool/app-icon.png'
    });

    webpush.sendNotification(reminder.subscription, payload).catch(console.error);
  }

  reminders = reminders.filter(r => new Date(r.time).getTime() > now);
  saveJSON(reminder_file, reminders);
});

app.listen(4000, () => console.log('Push server running on port 4000'));