"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var __1 = tslib_1.__importDefault(require("../../"));
var Worker = /** @class */ (function () {
    function Worker(jobs) {
        this.jobs = jobs;
        this.running = false;
    }
    Worker.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var job, func, args, event_1, res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        job = this.jobs.shift();
                        if (!job) return [3 /*break*/, 2];
                        this.running = true;
                        func = job.func, args = job.args, event_1 = job.event;
                        return [4 /*yield*/, func.apply(void 0, args)];
                    case 1:
                        res = _a.sent();
                        event_1.execute(res);
                        this.execute();
                        return [3 /*break*/, 3];
                    case 2:
                        this.running = false;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Worker.prototype.wakeup = function () {
        if (!this.running) {
            this.execute();
        }
    };
    return Worker;
}());
var JobSystem = /** @class */ (function () {
    function JobSystem(opt) {
        var _this = this;
        if (opt === void 0) { opt = { a: 5 }; }
        this.opt = opt;
        this.jobs = [];
        this.workers = [];
        var a = opt.a;
        this.workers = Array(a).slice().map(function () { return new Worker(_this.jobs); });
    }
    JobSystem.prototype.add = function (func, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var a, event;
            return tslib_1.__generator(this, function (_a) {
                a = this.opt.a;
                event = new __1.default();
                this.jobs.push({ func: func, args: args, event: event });
                if (this.jobs.length < a) {
                    this.workers.forEach(function (worker) { return worker.wakeup(); });
                }
                return [2 /*return*/, event.asPromise()];
            });
        });
    };
    return JobSystem;
}());
exports.default = JobSystem;
//# sourceMappingURL=index.js.map