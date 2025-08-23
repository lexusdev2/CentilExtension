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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const log_1 = __importDefault(require("@classes/log"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("@schemas/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _0x726f75746572 = express_1.default.Router();
_0x726f75746572.get("/signin", (_0x7175657279, _0x726573) => {
    var _a;
    const _0x636964 = process.env.C_ID;
    const _0x7265646972 = encodeURIComponent((_a = process.env.DISCORD_REDIRECT_URI) !== null && _a !== void 0 ? _a : "");
    const _0x73636f7065 = encodeURIComponent("identify guilds");
    const _0x617574685f75726c = `https://discord.com/oauth2/authorize?client_id=${_0x636964}&response_type=code&redirect_uri=${_0x7265646972}&scope=${_0x73636f7065}`;
    _0x726573.redirect(_0x617574685f75726c);
});
_0x726f75746572.get("/callback", (_0x7175657279, _0x726573) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const _0x646973636f7264 = "https://discord.com/api/v10";
        const _0x636964 = process.env.C_ID;
        const _0x6373656372 = process.env.C_SECRET;
        const _0x7265646972 = process.env.DISCORD_REDIRECT_URI;
        const { code: _0x636f6465 } = _0x7175657279.query;
        if (!_0x636f6465) {
            return _0x726573.status(400).json({
                error: "Code must be present in the query parameters",
                code: _0x636f6465,
            });
        }
        const _0x6f61757468 = yield fetch(`${_0x646973636f7264}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                client_id: _0x636964 !== null && _0x636964 !== void 0 ? _0x636964 : "",
                client_secret: _0x6373656372 !== null && _0x6373656372 !== void 0 ? _0x6373656372 : "",
                grant_type: "authorization_code",
                code: _0x636f6465,
                redirect_uri: _0x7265646972 !== null && _0x7265646972 !== void 0 ? _0x7265646972 : "",
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const _0x6f617574685f726573 = yield _0x6f61757468.json();
        const _0x757365725f726573 = yield fetch(`${_0x646973636f7264}/users/@me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${_0x6f617574685f726573.access_token}`,
            },
        });
        if (!_0x757365725f726573.ok) {
            log_1.default.error("ERROR", "Failed to fetch user data from Discord");
            return _0x726573.status(500).json({
                error: "Failed to fetch user data from Discord",
            });
        }
        const _0x75736572 = yield _0x757365725f726573.json();
        let user = yield User_1.default.findOne({ id: _0x75736572.id });
        if (!user) {
            user = new User_1.default({
                id: _0x75736572.id,
                username: _0x75736572.username,
                avatarHash: (_a = _0x75736572.avatar) !== null && _a !== void 0 ? _a : null,
                accessToken: _0x6f617574685f726573.access_token,
                refreshToken: _0x6f617574685f726573.refresh_token,
            });
            yield user.save();
        }
        else {
            user.username = _0x75736572.username;
            user.avatarHash = (_b = _0x75736572.avatar) !== null && _b !== void 0 ? _b : null;
            user.accessToken = _0x6f617574685f726573.access_token;
            user.refreshToken = _0x6f617574685f726573.refresh_token;
            yield user.save();
        }
        const tk = jsonwebtoken_1.default.sign({
            id: _0x75736572.id,
            username: _0x75736572.username,
            avatarHash: (_c = _0x75736572.avatar) !== null && _c !== void 0 ? _c : null,
        }, (_d = process.env.JWT_SECRET) !== null && _d !== void 0 ? _d : "", {
            expiresIn: "7d",
        });
        _0x726573
            .status(200)
            .cookie("token", tk, {
            domain: "localhost",
            httpOnly: true,
            expires: new Date(Date.now() + 6.948e8), // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 6.948e8,
        })
            .json({ success: true });
    }
    catch (error) {
        log_1.default.error("ERROR", error);
        _0x726573.status(500).json({ error: "Internal Server Error" });
    }
    return;
}));
exports.default = _0x726f75746572;
