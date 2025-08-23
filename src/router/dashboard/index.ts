import _0x7b1a6b7acb from "express";

//@ts-ignore
const _0x524f55544552 = _0x7b1a6b7acb.Router();

_0x524f55544552.get("/", (_0x726571, _0x726573) => {
    _0x726573.send("[GET] TICKET Router is working");
});

_0x524f55544552.post("/", (_0x726571, _0x726573) => {
    _0x726573.send("[POST] TICKET Router is working");
});

export default _0x524f55544552;
