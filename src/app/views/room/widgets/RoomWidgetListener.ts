import { Nitro, RoomSessionChatEvent, RoomSessionEvent } from "@nitrots/nitro-renderer/src";
import store from "../../../../utils/store";
import { RoomWidgetHandlerManager } from "../handlers";

export class RoomWidgetListener
{
    private static _instance: RoomWidgetListener;
    private _widgetHandler: RoomWidgetHandlerManager;

    constructor()
    {
        RoomWidgetListener._instance = this;
    }

    public static getInstance(): RoomWidgetListener
    {
        if (!RoomWidgetListener._instance) RoomWidgetListener._instance = new RoomWidgetListener();

        return RoomWidgetListener._instance;
    }

    public load(): void
    {
        this._widgetHandler = Object.assign(store.state.room.widgetHandler);

        Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this))
    }

    public reset(): void
    {
        console.log('reset')
        Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this))
    }

    public onRoomSessionEvent(event: RoomSessionEvent): void
    {
        console.log(this)
        if (!this._widgetHandler) return;

        this._widgetHandler.processEvent(event);
    }
}