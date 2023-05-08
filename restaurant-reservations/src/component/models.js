"use strict";
exports.__esModule = true;
exports.compareTimes = exports.dayAsNumeral = exports.timeInMinutes = exports.validatePassword = exports.SEAT = exports.STATUS = void 0;
;
var STATUS;
(function (STATUS) {
    STATUS[STATUS["UPCOMING"] = 0] = "UPCOMING";
    STATUS[STATUS["LATE"] = 1] = "LATE";
    STATUS[STATUS["ARRIVED"] = 2] = "ARRIVED";
    STATUS[STATUS["PAID"] = 3] = "PAID";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var SEAT;
(function (SEAT) {
    SEAT[SEAT["CLOSED"] = 0] = "CLOSED";
    SEAT[SEAT["RESERVED"] = 1] = "RESERVED";
    SEAT[SEAT["AVAILABLE"] = 2] = "AVAILABLE";
})(SEAT = exports.SEAT || (exports.SEAT = {}));
var validatePassword = function (password) {
    if (password.length < 8)
        return [false, "Password must contain more than 8 characters"];
    var uppercase = false;
    var lowercase = false;
    var num = false;
    for (var i = 0; i < password.length; i++) {
        var currChar = password.charAt(i);
        uppercase = uppercase || ('A' <= currChar && currChar <= 'Z');
        lowercase = lowercase || ('a' <= currChar && currChar <= 'z');
        num = num || ('0' <= currChar && currChar <= '9');
    }
    if (!(uppercase && lowercase && num)) {
        return [false, "Username and passwords must contain at least 1 lowercase, 1 uppercase and 1 numeical character."];
    }
    return [true, "Username and password are vaild."];
};
exports.validatePassword = validatePassword;
var timeInMinutes = function (time) {
    return (time[1]
        + (time[2] === 'PM' ? 12 * 60 : 0)
        + (time[0] === 12 ? 0 : time[0] * 60));
};
exports.timeInMinutes = timeInMinutes;
var dayAsNumeral = function (date) {
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var currYear = date[2];
    if (currYear % 400 == 0 || (currYear % 4 == 0 && currYear % 100 != 0)) {
        daysInMonth[1]++;
    }
    var daysToNow = 0;
    for (var i = 0; i < date[1] - 1; i++) {
        daysToNow += daysInMonth[i];
    }
    daysToNow += daysInMonth[date[1] - 1];
    return (daysToNow
        + date[2] * 1000);
};
exports.dayAsNumeral = dayAsNumeral;
var compareTimes = function (time1, time2) {
    var time1_minutes = (0, exports.timeInMinutes)(time1);
    var time2_minutes = (0, exports.timeInMinutes)(time2);
    if (time1_minutes < time2_minutes)
        return -1;
    else if (time1_minutes > time2_minutes)
        return 1;
    else
        return 0;
};
exports.compareTimes = compareTimes;
