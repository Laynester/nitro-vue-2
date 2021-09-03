import { IConfigurationManager, MouseEventType, Nitro } from "@nitrots/nitro-renderer";

const ConfigManager = (): IConfigurationManager =>
{
    if (!Nitro.instance) return null

    return Nitro.instance.core.configuration;
}

let didMouseMove = false;
let lastClick = 0;
let clickCount = 0;

const DispatchMouseEvent = (roomId: number, canvasId: number, event: MouseEvent) =>
{
    const x = event.clientX;
    const y = event.clientY;

    let eventType = event.type;

    if (eventType === MouseEventType.MOUSE_CLICK)
    {
        if (lastClick)
        {
            clickCount = 1;

            if (lastClick >= Date.now() - 300) clickCount++;
        }

        lastClick = Date.now();

        if (clickCount === 2)
        {
            if (!didMouseMove) eventType = MouseEventType.DOUBLE_CLICK;

            clickCount = 0;
            lastClick = null;
        }
    }

    switch (eventType)
    {
        case MouseEventType.MOUSE_CLICK:
            break;
        case MouseEventType.DOUBLE_CLICK:
            break;
        case MouseEventType.MOUSE_MOVE:
            didMouseMove = true;
            break;
        case MouseEventType.MOUSE_DOWN:
            didMouseMove = false;
            break;
        case MouseEventType.MOUSE_UP:
            break;
        default: return;
    }

    Nitro.instance.roomEngine.setActiveRoomId(roomId)
    Nitro.instance.roomEngine.dispatchMouseEvent(canvasId, x, y, eventType, event.altKey, (event.ctrlKey || event.metaKey), event.shiftKey, false);
}

const ResultCode = (res): string =>
{
    let name = res.code;
    if (
        (!name || name.length == 0) &&
        res.data &&
        res.data.length > 0
    )
    {
        return res.data;
    }
    if (res.code.startsWith("${"))
    {
        name = name.substr(2, name.length - 3);
    } else
    {
        name = "navigator.searchcode.title." + name;
    }
    return name;
}

const localizeText = (val: string, parameters: string[] = null, replacements: string[] = null) =>
{
    return Nitro.instance.localization.getValueWithParameters(val, parameters, replacements);
}

export { ConfigManager, DispatchMouseEvent, ResultCode, localizeText };

