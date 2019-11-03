"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rx_mini_1 = tslib_1.__importStar(require("rx.mini"));
var DataChannelService = /** @class */ (function () {
    function DataChannelService(pc) {
        var _this = this;
        this.pc = pc;
        this.pack = rx_mini_1.Pack();
        this.event = this.pack.event;
        this.onMessage = this.event();
        this.onOpenDC = this.event();
        this.dataChannels = {};
        this.creatingChannel = {};
        this.channelEvents = function (channel) {
            channel.onmessage = function (_a) {
                var data = _a.data;
                _this.onMessage.execute({ data: data, channel: channel });
            };
            channel.onerror = function (err) { return console.warn(err); };
            channel.onclose = function () { return delete _this.dataChannels[channel.label]; };
        };
        pc.ondatachannel = function (_a) {
            var channel = _a.channel;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, new Promise(function (r) { return (channel.onopen = function () { return r(); }); })];
                        case 1:
                            _b.sent();
                            this.channelEvents(channel);
                            this.dataChannels[channel.label] = channel;
                            this.onOpenDC.execute(channel);
                            return [2 /*return*/];
                    }
                });
            });
        };
    }
    DataChannelService.prototype.create = function (label) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var channel_1, event, channel;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.dataChannels[label]) {
                            return [2 /*return*/, this.dataChannels[label]];
                        }
                        if (!this.creatingChannel[label]) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.creatingChannel[label].asPromise()];
                    case 1:
                        channel_1 = _a.sent();
                        return [2 /*return*/, channel_1];
                    case 2:
                        event = new rx_mini_1.default();
                        this.creatingChannel[label] = event;
                        channel = this.pc.createDataChannel(label);
                        if (!(Object.keys(this.dataChannels).length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (r) { return (channel.onopen = function () { return r(); }); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, new Promise(function (r) { return setTimeout(r); })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        this.dataChannels[label] = channel;
                        this.channelEvents(channel);
                        this.onOpenDC.execute(channel);
                        event.execute(channel);
                        delete this.creatingChannel[label];
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    DataChannelService.prototype.send = function (data, label) {
        if (!this.dataChannels[label])
            throw new Error("no channel");
        this.dataChannels[label].send(data);
    };
    DataChannelService.prototype.dispose = function () {
        Object.values(this.dataChannels).forEach(function (channel) {
            channel.onmessage = null;
            channel.onopen = null;
            channel.onclose = null;
            channel.onerror = null;
            channel.close();
        });
        this.pack.finishAll();
    };
    return DataChannelService;
}());
exports.DataChannelService = DataChannelService;
//# sourceMappingURL=datachannel.js.map