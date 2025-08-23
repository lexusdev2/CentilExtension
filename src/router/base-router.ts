import _0x7b1a6b7acb from "express";

import _0x5469636b6574526f75746548616e646c6572 from "./ticket";
import _0x41757468 from "./auth";
import _0x44617368626f617264 from "./dashboard";

const _0x524f55544552 = _0x7b1a6b7acb.Router();

_0x524f55544552.use("/auth", _0x41757468);
_0x524f55544552.use("/ticket", _0x5469636b6574526f75746548616e646c6572);
_0x524f55544552.use("/dashboard", _0x44617368626f617264);

export default _0x524f55544552;
