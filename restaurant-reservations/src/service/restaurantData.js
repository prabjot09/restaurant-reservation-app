"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.loadTodayReservations = exports.loadRestaurantReservationsOrdered = exports.loadStaffAccessKey = exports.loadRestaurantReservations = exports.loadRestaurantTables = exports.loadRestaurantHours = exports.loadRestaurant = exports.getRestaurant = exports.saveRestaurant = void 0;
var models_1 = require("../component/models");
var baseURL = "http://localhost:5000/restaurants/";
var saveRestaurant = function (restaurant) { return __awaiter(void 0, void 0, void 0, function () {
    var result, req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [true, ''];
                req = new XMLHttpRequest();
                req.addEventListener("load", function () {
                    if (req.responseText !== "Success") {
                        result = [false, req.responseText];
                    }
                });
                req.open("POST", baseURL);
                req.setRequestHeader("Content-Type", "application/json");
                return [4 /*yield*/, req.send(JSON.stringify({ restaurant: restaurant }))];
            case 1:
                _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.saveRestaurant = saveRestaurant;
var getRestaurant = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, req;
    return __generator(this, function (_a) {
        result = [false, null];
        req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            var response = JSON.parse(req.response);
            result[0] = response.hasRestaurant;
            result[1] = response.restaurant;
            console.log(response);
        });
        req.open("GET", baseURL, false);
        req.send();
        return [2 /*return*/, result];
    });
}); };
exports.getRestaurant = getRestaurant;
var loadRestaurant = function (restaurantName) { return __awaiter(void 0, void 0, void 0, function () {
    var restaurant, req;
    return __generator(this, function (_a) {
        restaurant = { name: '', location: '', tables: [], hours: { open: [-1, -1, ''], close: [-1, -1, ''] }, staffKey: '', ownerKey: '', reservations: [] };
        req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            restaurant = JSON.parse(req.response).restaurant;
        });
        req.open("GET", baseURL + restaurantName, false);
        req.send();
        return [2 /*return*/, restaurant];
    });
}); };
exports.loadRestaurant = loadRestaurant;
var loadRestaurantHours = function (restaurantName) { return __awaiter(void 0, void 0, void 0, function () {
    var hours, req;
    return __generator(this, function (_a) {
        hours = { open: [-1, -1, ''], close: [-1, -1, ''] };
        req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            if (req.responseText !== "")
                hours = JSON.parse(req.response);
        });
        req.open("GET", baseURL + "hours/" + restaurantName, false);
        req.send();
        return [2 /*return*/, hours];
    });
}); };
exports.loadRestaurantHours = loadRestaurantHours;
var loadRestaurantTables = function (restaurantName) { return __awaiter(void 0, void 0, void 0, function () {
    var tables;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tables = [];
                return [4 /*yield*/, (0, exports.loadRestaurant)(restaurantName)
                        .then(function (restaurant) {
                        tables = restaurant.tables;
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, tables];
        }
    });
}); };
exports.loadRestaurantTables = loadRestaurantTables;
var loadRestaurantReservations = function (restaurantName) {
    var reservations = [];
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        if (req.responseText !== "")
            reservations = JSON.parse(req.response);
    });
    req.open("GET", baseURL + "reservations/" + restaurantName, false);
    req.send();
    return reservations;
};
exports.loadRestaurantReservations = loadRestaurantReservations;
var loadStaffAccessKey = function (restaurantName, inputKey, callback) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        if (req.responseText.slice(0, 5) === "Error") {
            console.log("Specified restaurant was not found for staff access key request");
            return;
        }
        callback(JSON.parse(req.response).accessKey);
    });
    req.open("GET", baseURL + "staff_key/" + restaurantName, false);
    req.send();
};
exports.loadStaffAccessKey = loadStaffAccessKey;
var convertTimeToTuple = function (resTime) {
    return [resTime.hour, resTime.minute, resTime.time];
};
/*
const sortReservationsByTime = (resArr: Reservation[]): void => {
    for (let i = 0; i < resArr.length - 1; i++) {
        let earliest = i;

        for (let j = i+1; j < resArr.length; j++) {
            const timeEarliest = convertTimeToTuple(resArr[earliest].time);
            const timeCurr = convertTimeToTuple(resArr[j].time);
            if (compareTimes(timeEarliest, timeCurr) < 0) {
                earliest = j;
            }
        }

        const temp = resArr[i];
        resArr[i] = resArr[earliest];
        resArr[earliest] = temp;
    }
}
*/
var mergeSort = function (list, s, e, compare) {
    if (s >= e) {
        return;
    }
    var mid = Math.floor((s + e) / 2);
    mergeSort(list, s, mid, compare);
    mergeSort(list, mid + 1, e, compare);
    var p1 = s;
    var p2 = mid + 1;
    var temp = [];
    while (p1 < mid + 1 && p2 < e + 1) {
        if (compare(list[p1], list[p2]) == true)
            temp.push(list[p1++]);
        else
            temp.push(list[p2++]);
    }
    while (p1 < mid + 1)
        temp.push(list[p1++]);
    while (p2 < e + 1)
        temp.push(list[p2++]);
    for (var i = s; i <= e; i++) {
        list[i] = temp[i - s];
    }
};
var loadRestaurantReservationsOrdered = function (restaurantName, callback) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        if (req.responseText === "")
            return;
        var reservations = JSON.parse(req.response);
        mergeSort(reservations, 0, reservations.length - 1, function (r1, r2) {
            var t1 = [r1.time.hour, r1.time.minute, r1.time.time];
            var t2 = [r2.time.hour, r2.time.minute, r2.time.time];
            return ((0, models_1.timeInMinutes)(t1) <= (0, models_1.timeInMinutes)(t2));
        });
        mergeSort(reservations, 0, reservations.length - 1, function (r1, r2) {
            var d1 = [r1.date.day, r1.date.month, r1.date.year];
            var d2 = [r2.date.day, r2.date.month, r2.date.year];
            return ((0, models_1.dayAsNumeral)(d1) <= (0, models_1.dayAsNumeral)(d2));
        });
        console.log(reservations);
        callback(reservations);
    });
    req.open("GET", baseURL + "reservations/" + restaurantName, false);
    req.send();
};
exports.loadRestaurantReservationsOrdered = loadRestaurantReservationsOrdered;
var loadTodayReservations = function (restaurantName) { return __awaiter(void 0, void 0, void 0, function () {
    var reservations, req;
    return __generator(this, function (_a) {
        reservations = [];
        req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            reservations = JSON.parse(req.response);
            mergeSort(reservations, 0, reservations.length - 1, function (r1, r2) {
                var t1 = [r1.time.hour, r1.time.minute, r1.time.time];
                var t2 = [r2.time.hour, r2.time.minute, r2.time.time];
                return ((0, models_1.timeInMinutes)(t1) <= (0, models_1.timeInMinutes)(t2));
            });
        });
        req.open("GET", baseURL + "reservations/" + restaurantName + "/today", false);
        req.send();
        return [2 /*return*/, reservations];
    });
}); };
exports.loadTodayReservations = loadTodayReservations;
