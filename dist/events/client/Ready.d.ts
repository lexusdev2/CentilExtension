import Event from "../../base/classes/Events";
import _Client from "../../base/classes/_Client";
export default class Ready extends Event {
    constructor(client: _Client);
    Execute(...args: any[]): Promise<void>;
    private GetJson;
    private PrintCommandTable;
    private PrintDevCommandTable;
}
