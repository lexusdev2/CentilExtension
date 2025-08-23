"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const _Client_1 = __importDefault(require("./base/classes/_Client"));
const express_1 = __importDefault(require("express"));
const Ticket_1 = __importDefault(require("./base/schemas/Ticket"));
const base_router_1 = __importDefault(require("./router/base-router"));
const log_1 = __importDefault(require("@classes/log"));
const _0x59584277 = (0, express_1.default)();
const _0x706f7274 = 0x1f90;
_0x59584277.listen(_0x706f7274, () => {
    globalThis["\x63\x6f\x6e\x73\x6f\x6c\x65"]["\x6c\x6f\x67"](`Express server is running on port ${_0x706f7274}`);
});
_0x59584277.use("/", base_router_1.default);
const _0x5449434b4554 = new Ticket_1.default({
    guildId: "123456789012345678",
    ownerId: "987654321098765432",
    reason: "Test Ticket",
});
_0x5449434b4554
    .save()
    .then(() => {
    log_1.default.info("Ticket saved successfully:", `${_0x5449434b4554}`);
})
    .catch((error) => {
    log_1.default.error("Error saving ticket:", error);
});
new _Client_1.default()["\x49\x6e\x69\x74"]();
