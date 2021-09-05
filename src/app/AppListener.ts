import { ConfigurationEvent, LegacyExternalInterface, Nitro, NitroCommunicationDemoEvent, NitroEvent, NitroLocalizationEvent, NitroVersion, RoomEngineEvent, WebGL } from '@nitrots/nitro-renderer';
import store from '../utils/store';

export class AppListener
{
    private static _instance: AppListener;

    constructor()
    {
        AppListener._instance = this;
        //@ts-ignore
        if (!NitroConfig) throw new Error('NitroConfig is not defined!');

        if (!Nitro.instance)
        {
            NitroVersion.UI_VERSION = '0.0.1';
            Nitro.bootstrap();
        } else
        {

        }
        if (!WebGL.isWebGLAvailable()) Nitro.instance.events.dispatchEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE))
        else Nitro.instance.core.configuration.init();

        Nitro.instance.events.addEventListener(Nitro.WEBGL_CONTEXT_LOST, this.handler.bind(this));
        Nitro.instance.events.addEventListener(Nitro.WEBGL_UNAVAILABLE, this.handler.bind(this));
        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.handler.bind(this));
        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.handler.bind(this));
        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.handler.bind(this));
        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.handler.bind(this));
        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.handler.bind(this));
        Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.handler.bind(this));
        Nitro.instance.localization.events.addEventListener(NitroLocalizationEvent.LOADED, this.handler.bind(this));
        Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.LOADED, this.handler.bind(this));
        Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.FAILED, this.handler.bind(this));

    }

    public static getInstance(): AppListener
    {
        if (!AppListener._instance) AppListener._instance = new AppListener();

        return AppListener._instance;
    }

    public static reset(): AppListener
    {
        if (Nitro.instance) Nitro.instance.dispose();

        AppListener._instance = new AppListener();
        return this._instance
    }

    private getPreloadAssetUrls(): string[]
    {
        const urls: string[] = [];

        const assetUrls = Nitro.instance.getConfiguration<string[]>('preload.assets.urls');

        if (assetUrls && assetUrls.length)
        {
            for (const url of assetUrls)
            {
                urls.push(Nitro.instance.core.configuration.interpolate(url));
            }
        }

        return urls;
    }

    private handler(event: NitroEvent)
    {
        store.state.app.login = false;
        switch (event.type)
        {
            case ConfigurationEvent.LOADED:
                Nitro.instance.localization.init();
                this.setPercent(20);
                return;
            case ConfigurationEvent.FAILED:
                this.setIsError(true);
                return;
            case Nitro.WEBGL_UNAVAILABLE:
                this.setIsError(true);
                return;
            case Nitro.WEBGL_CONTEXT_LOST:
                this.setIsError(true);

                setTimeout(() => window.location.reload(), 1500);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                this.setPercent(20);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                this.setIsError(true);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                this.setPercent(20);
                Nitro.instance.init();
                return;
            case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                this.setIsError(true);
                store.state.app.hotelview = true;
                return;
            case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                if (Nitro.instance.roomEngine) Nitro.instance.roomEngine.dispose();

                this.setIsError(true);
                store.state.app.hotelview = true;

                LegacyExternalInterface.call('disconnect', -1, 'client.init.handshake.fail');
                return;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                this.setIsReady(true);
                this.setPercent(20);
                return;
            case NitroLocalizationEvent.LOADED:
                Nitro.instance.core.asset.downloadAssets(this.getPreloadAssetUrls(), (status: boolean) =>
                {
                    if (status)
                    {
                        this.setPercent(20);
                        Nitro.instance.communication.init();
                    }
                    else
                    {
                        this.setIsError(true);
                    }
                });
                return;
        }
    }

    private setPercent(percent: number): void
    {
        store.state.app.percent += percent;
    }

    private setIsError(set: boolean): void
    {
        store.state.app.isError = set;
    }

    private setIsReady(set: boolean): void
    {
        store.state.app.isReady = set;
    }
}
