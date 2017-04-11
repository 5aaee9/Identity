/**
 * Created by Indexyz on 2017/4/11.
 */
'use strict';

const ONEDAYTIME = 86400000;

module.exports.getZeroTime = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date
};

module.exports.getNextDay = (date) => {
    return new Date(date.getTime() + ONEDAYTIME)
};

module.exports.getNextTimesDay = (times, date) => {
    return new Date(date.getTime() + ONEDAYTIME * times)
};

module.exports.getPreDay = (date) => {
    return new Date(date.getTime() - ONEDAYTIME)
};

module.exports.getPreTimesDay = (times, date) => {
    return new Date(date.getTime() - ONEDAYTIME * times)
};