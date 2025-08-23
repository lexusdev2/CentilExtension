"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const path_1 = __importDefault(require("path"));
const glob_1 = require("glob");
/**
 * @typedef {import("discord.js").Client} Client
 * @typedef {import("../interfaces/ICommand").default} Command
 * @class Handler
 * @description This class is used to handle the loading of events and commands.
 */
class Handler {
    constructor(client) {
        this.client = client;
    }
    /**
     * Load all events from the events folder.
     * @returns {Promise<void>}
     */
    LoadEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = (yield (0, glob_1.glob)(`dist/events/**/*.js`)).map((filePath) => path_1.default.resolve(filePath));
            for (const file of files) {
                const mod = yield Promise.resolve(`${file}`).then(s => __importStar(require(s)));
                const EventClass = mod.default;
                if (typeof EventClass !== "function") {
                    console.warn(`[Event Loader] Skipped: ${file} (no valid class export)`);
                    continue;
                }
                const event = new EventClass(this.client);
                if (!event.name) {
                    delete require.cache[require.resolve(file)];
                    console.log(`[Event Loader] Missing name: ${file.split("/").pop()}`);
                    continue;
                }
                const execute = (...args) => event.Execute(...args);
                // @ts-ignore
                if (event.once)
                    this.client.once(event.name, execute);
                // @ts-ignore
                else
                    this.client.on(event.name, execute);
                delete require.cache[require.resolve(file)];
            }
        });
    }
    /**
     * Load all commands from the commands folder.
     * @returns {Promise<void>}
     */
    LoadCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const files = (yield (0, glob_1.glob)(`dist/commands/**/*.js`)).map((filePath) => path_1.default.resolve(filePath));
            for (const file of files) {
                const mod = yield Promise.resolve(`${file}`).then(s => __importStar(require(s)));
                const CommandClass = mod.default;
                if (typeof CommandClass !== "function") {
                    console.warn(`[Command Loader] Skipped: ${file} (no valid class export)`);
                    continue;
                }
                const command = new CommandClass(this.client);
                if (!command.name) {
                    delete require.cache[require.resolve(file)];
                    console.log(`[Command Loader] Missing name: ${file.split("/").pop()}`);
                    continue;
                }
                const isSubCommand = (_a = file.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[2];
                if (isSubCommand) {
                    this.client.subCommands.set(command.name, command);
                }
                else {
                    this.client.Commands.set(command.name, command);
                }
                delete require.cache[require.resolve(file)];
            }
        });
    }
}
exports.default = Handler;
