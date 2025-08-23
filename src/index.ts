import "module-alias/register";
import _0x436c69656e74 from "./base/classes/_Client";

import _0x7b1a6b7acb from "express";
import _0x6d6f6e676f6f7365 from "mongoose";
import _0x7469636b6574536368656d61 from "./base/schemas/Ticket";
import _0x524f55544552 from "./router/base-router";
import Logger from "@classes/log";
import JWT from "jsonwebtoken";

const _0x59584277 = _0x7b1a6b7acb();
const _0x706f7274 = 0x1f90;

_0x59584277.listen(_0x706f7274, () => {
    globalThis["\x63\x6f\x6e\x73\x6f\x6c\x65"]["\x6c\x6f\x67"](
        `Express server is running on port ${_0x706f7274}`
    );
});

_0x59584277.use("/", _0x524f55544552);

const _0x5449434b4554 = new _0x7469636b6574536368656d61({
    guildId: "123456789012345678",
    ownerId: "987654321098765432",
    reason: "Test Ticket",
});

_0x5449434b4554
    .save()
    .then(() => {
        Logger.info("Ticket saved successfully:", `${_0x5449434b4554}`);
    })
    .catch((error) => {
        Logger.error("Error saving ticket:", error);
    });

new _0x436c69656e74()["\x49\x6e\x69\x74"]();
