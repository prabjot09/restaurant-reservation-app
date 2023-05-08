"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = exports.Restaurant = exports.restaurantSchema = exports.reservationSchema = exports.timeSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
;
exports.timeSchema = new mongoose_1.default.Schema({
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    time: { type: String, required: true },
});
const dateSchema = new mongoose_1.default.Schema({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true }
});
const tableSchema = new mongoose_1.default.Schema({
    num: { type: Number, required: true },
    capacity: { type: Number, required: true }
});
exports.reservationSchema = new mongoose_1.default.Schema({
    groupName: { type: String, required: true },
    restaurantName: { type: String, required: true },
    table: { type: tableSchema, required: true },
    persons: { type: Number, required: true },
    date: { type: dateSchema, required: true },
    time: { type: exports.timeSchema, required: true },
    duration: { type: { hours: Number, minutes: Number }, required: true },
    status: { type: Number, required: true }
});
exports.restaurantSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    tables: { type: [tableSchema], required: true },
    hours: { type: { open: exports.timeSchema, close: exports.timeSchema }, required: true },
    ownerKey: { type: String, required: true },
    staffKey: { type: String, required: true },
    reservations: { type: [mongoose_1.Schema.Types.ObjectId], required: true },
});
exports.restaurantSchema.statics.hasRestaurant = (function () {
    return __awaiter(this, void 0, void 0, function* () {
        const hasARestaurant = (yield this.find().countDocuments()) != 0;
        return hasARestaurant;
    });
});
exports.Restaurant = mongoose_1.default.model('Restaurant', exports.restaurantSchema);
exports.Reservation = mongoose_1.default.model('Reservation', exports.reservationSchema);
