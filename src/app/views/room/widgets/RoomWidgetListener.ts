import { Nitro, RoomEngineDimmerStateEvent, RoomEngineEvent, RoomId, RoomSessionChatEvent, RoomSessionEvent, RoomZoomEvent } from "@nitrots/nitro-renderer/src";
import { RoomWidgetRoomEngineUpdateEvent } from "../events";
import { RoomWidgetHandlerManager } from "../handlers";

export class RoomWidgetListener
{
    private static _instance: RoomWidgetListener;
    private _widgetHandler: RoomWidgetHandlerManager;

    constructor()
    {
        RoomWidgetListener._instance = this;
        this.load();
    }

    public static getInstance(): RoomWidgetListener
    {
        if (!RoomWidgetListener._instance) RoomWidgetListener._instance = new RoomWidgetListener();

        return RoomWidgetListener._instance;
    }

    public load(): void
    {
        Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this));
        Nitro.instance.roomEngine.events.addEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent.bind(this));
    }

    public onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if (!this._widgetHandler) return;

        this._widgetHandler.processEvent(event);
    }

    public onRoomEngineEvent(event: RoomEngineEvent)
    {
        if (!this._widgetHandler.eventDispatcher || RoomId.isRoomPreviewerId(event.roomId)) return;

        switch (event.type)
        {
            case RoomEngineEvent.NORMAL_MODE:
                this._widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.NORMAL_MODE, event.roomId));
                return;
            case RoomEngineEvent.GAME_MODE:
                this._widgetHandler.eventDispatcher.dispatchEvent(new RoomWidgetRoomEngineUpdateEvent(RoomWidgetRoomEngineUpdateEvent.GAME_MODE, event.roomId));
                return;
            case RoomZoomEvent.ROOM_ZOOM: {
                const zoomEvent = (event as RoomZoomEvent);

                let zoomLevel = ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1)));

                if (zoomEvent.forceFlip || zoomEvent.asDelta) zoomLevel = zoomEvent.level;

                Nitro.instance.roomEngine.setRoomInstanceRenderingCanvasScale(event.roomId, 1, zoomLevel, null, null, false, zoomEvent.asDelta);

                return;
            }
            case RoomEngineDimmerStateEvent.ROOM_COLOR: {
                return;
            }
        }
    }

    public setHandler(handler: RoomWidgetHandlerManager)
    {
        this._widgetHandler = handler;
    }
}