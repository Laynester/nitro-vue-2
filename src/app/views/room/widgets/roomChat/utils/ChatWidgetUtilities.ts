import { INitroPoint, IVector3D, Nitro, NitroPoint } from '@nitrots/nitro-renderer';

export function GetBubbleLocation(roomId: number, userLocation: IVector3D, canvasId = 1): INitroPoint
{
    const geometry = Nitro.instance.roomEngine.getRoomInstanceGeometry(roomId, canvasId);
    const scale = Nitro.instance.roomEngine.getRoomInstanceRenderingCanvasScale(roomId, canvasId);

    let x = ((document.body.offsetWidth * scale) / 2);
    let y = ((document.body.offsetHeight * scale) / 2);

    if (geometry && userLocation)
    {
        const screenPoint = geometry.getScreenPoint(userLocation);

        if (screenPoint)
        {
            x = (x + (screenPoint.x * scale));
            y = (y + (screenPoint.y * scale));

            const offsetPoint = Nitro.instance.roomEngine.getRoomInstanceRenderingCanvasOffset(roomId, canvasId);

            if (offsetPoint)
            {
                x = (x + offsetPoint.x);
                y = (y + offsetPoint.y);
            }
        }
    }

    return new NitroPoint(x, y);
}
