const moment = require('moment');

const date = moment(new Date());

module.exports = (from, body) => {
    return {
        from,
        body,
        createdAt: date.format('h:mm A'),
    };
}; 
