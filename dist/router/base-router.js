"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticket_1 = __importDefault(require("./ticket"));
const auth_1 = __importDefault(require("./auth"));
const dashboard_1 = __importDefault(require("./dashboard"));
const _0x524f55544552 = express_1.default.Router();
_0x524f55544552.use("/auth", auth_1.default);
_0x524f55544552.use("/ticket", ticket_1.default);
_0x524f55544552.use("/dashboard", dashboard_1.default);
exports.default = _0x524f55544552;
