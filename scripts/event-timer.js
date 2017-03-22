const moment = require('moment-timezone');

r = new snoowrap({
  userAgent: process.env.SW_USER_AGENT,
  clientId: process.env.SW_BOT_ID,
  clientSecret: process.env.SW_SECRET,
  username: process.env.SW_USER,
  password: process.env.SW_PASSWORD
});

const config = {
  targetSubreddit: 'r6moderatorscsstest',
  targetPage: 'index',
  event: {
    isActive: false,
    isMonth: true,
    fullDate: '',
    count: {
      years: '',
      months: '',
      days: ''
    },
    date: {
      years: '',
      months: '',
      days: '',
    }
  }
};

const wikiPage = r.getSubreddit(config.targetSubreddit).getWikiPage(config.targetPage);

function compareTime(now) {
  return moment(config.event.date.full).isBefore(now);
}

function countTimer(now) {

}

function eventHandler(currentTime) {
  if (config.event.isActive === false) {
    wikiPage.refresh().then(page => {
      let targetRecord = page['content_md'],
        targetArray = targetRecord.split(' ');
        targetDate = targetArray[0].split('-');
      
      config.event = {
        isActive: true,
        full: moment(targetRecord, 'YYYY-MM-DD HH:mm'),
        date: {
          years: targetDate[0],
          months: targetDate[1],
          days: targetDate[2]
        }
      };
      console.log('event date ' + config.event.date.months);
      console.log(moment(config.event.date).subtract({
        years: currentTime.format('YYYY'),
        months: currentTime.format('MM'),
        days: currentTime.format('DD')
      }).format('MM'));
    });
  } else {
    // config.event.count = {
    //   years: moment(config.event.date).subtract({ years: '1' }).format('MM')
    // }
  }
}

module.exports = {
  compareTime,
  eventHandler
};