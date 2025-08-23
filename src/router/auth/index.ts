require("dotenv").config();
import _0x6c6f67676572 from "@classes/log";
import _0x65787072657373 from "express";
import _0x7573657273 from "@schemas/User";
import JWT from "jsonwebtoken";

const _0x726f75746572 = _0x65787072657373.Router();

_0x726f75746572.get("/signin", (_0x7175657279, _0x726573) => {
    const _0x636964 = process.env.C_ID;
    const _0x7265646972 = encodeURIComponent(
        process.env.DISCORD_REDIRECT_URI ?? ""
    );
    const _0x73636f7065 = encodeURIComponent("identify guilds");

    const _0x617574685f75726c = `https://discord.com/oauth2/authorize?client_id=${_0x636964}&response_type=code&redirect_uri=${_0x7265646972}&scope=${_0x73636f7065}`;

    _0x726573.redirect(_0x617574685f75726c);
});

_0x726f75746572.get("/callback", async (_0x7175657279, _0x726573) => {
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

        const _0x6f61757468 = await fetch(`${_0x646973636f7264}/oauth2/token`, {
            method: "POST",
            body: new URLSearchParams({
                client_id: _0x636964 ?? "",
                client_secret: _0x6373656372 ?? "",
                grant_type: "authorization_code",
                code: _0x636f6465 as string,
                redirect_uri: _0x7265646972 ?? "",
            }).toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const _0x6f617574685f726573 = await _0x6f61757468.json();

        const _0x757365725f726573 = await fetch(
            `${_0x646973636f7264}/users/@me`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${_0x6f617574685f726573.access_token}`,
                },
            }
        );

        if (!_0x757365725f726573.ok) {
            _0x6c6f67676572.error(
                "ERROR",
                "Failed to fetch user data from Discord"
            );
            return _0x726573.status(500).json({
                error: "Failed to fetch user data from Discord",
            });
        }

        const _0x75736572 = await _0x757365725f726573.json();

        let user = await _0x7573657273.findOne({ id: _0x75736572.id });

        if (!user) {
            user = new _0x7573657273({
                id: _0x75736572.id,
                username: _0x75736572.username,
                avatarHash: _0x75736572.avatar ?? null,
                accessToken: _0x6f617574685f726573.access_token,
                refreshToken: _0x6f617574685f726573.refresh_token,
            });

            await user.save();
        } else {
            user.username = _0x75736572.username;
            user.avatarHash = _0x75736572.avatar ?? null;
            user.accessToken = _0x6f617574685f726573.access_token;
            user.refreshToken = _0x6f617574685f726573.refresh_token;
            await user.save();
        }

        const tk = JWT.sign(
            {
                id: _0x75736572.id,
                username: _0x75736572.username,
                avatarHash: _0x75736572.avatar ?? null,
            },
            process.env.JWT_SECRET ?? "",
            {
                expiresIn: "7d",
            }
        );

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
    } catch (error) {
        _0x6c6f67676572.error("ERROR", error as string);
        _0x726573.status(500).json({ error: "Internal Server Error" });
    }

    return;
});

export default _0x726f75746572;
