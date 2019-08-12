"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = tslib_1.__importDefault(require("../core"));
var rx_mini_1 = tslib_1.__importDefault(require("rx.mini"));
var Signaling = /** @class */ (function (_super) {
    tslib_1.__extends(Signaling, _super);
    function Signaling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Signaling.prototype.offer = function () {
        var event = new rx_mini_1.default();
        var unSubscribe = this.onSignal.subscribe(event.execute).unSubscribe;
        this.onConnect.once(unSubscribe);
        this.makeOffer();
        return event.returnListener;
    };
    Signaling.prototype.answer = function (signal) {
        var event = new rx_mini_1.default();
        var unSubscribe = this.onSignal.subscribe(event.execute).unSubscribe;
        this.onConnect.once(unSubscribe);
        this.setSdp(signal);
        return event.returnListener;
    };
    return Signaling;
}(core_1.default));
exports.default = Signaling;
//# sourceMappingURL=signaling.js.map