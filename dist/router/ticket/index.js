"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//@ts-ignore
const _0x524f55544552 = express_1.default.Router();
_0x524f55544552.get("/", (_0x726571, _0x726573) => {
    _0x726573.send("[GET] TICKET Router is working");
});
_0x524f55544552.post("/", (_0x726571, _0x726573) => {
    _0x726573.send("[POST] TICKET Router is working");
});
exports.default = _0x524f55544552;
