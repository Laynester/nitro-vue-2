import { ActivityPointNotificationMessageEvent, IMessageEvent, Nitro, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserSubscriptionEvent } from "@nitrots/nitro-renderer";
import { NitroSoundEvent } from "@nitrots/nitro-renderer/src/nitro/events/NitroSoundEvent";
import store from "../../../utils/store";

export class PurseListener
{
    private static _instance: PurseListener;
    private _messages: IMessageEvent[] = [];

    constructor()
    {
        PurseListener._instance = this;

        this._messages = [
            new UserCreditsEvent(this.onUserCreditsEvent.bind(this)),
            new UserCurrencyEvent(this.onUserCurrencyEvent.bind(this)),
            new ActivityPointNotificationMessageEvent(this.onUserCurrencyUpdateEvent.bind(this)),
            new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this))
        ];

        for (const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);

        Nitro.instance.communication.connection.send(new UserCurrencyComposer());
    }

    public static getInstance(): PurseListener
    {
        if (!PurseListener._instance) PurseListener._instance = new PurseListener();

        return PurseListener._instance;
    }

    private onUserCreditsEvent(event: UserCreditsEvent): void
    {
        const parser = event.getParser();

        if (store.state.user.credits && store.state.user.credits !== parseInt(parser.credits)) this.playSound('credits')

        store.state.user.credits = parseInt(parser.credits);
    }

    private onUserCurrencyEvent(event: UserCurrencyEvent): void
    {
        const parser = event.getParser();

        store.state.user.currencies = parser.currencies;
    }

    private onUserCurrencyUpdateEvent(event: ActivityPointNotificationMessageEvent): void
    {
        const parser = event.getParser();

        store.state.user.currencies.set(parser.type, parser.amount);

        switch (parser.type)
        {
            case 0:
                return this.playSound('duckets')
        }
    }

    private onUserSubscriptionEvent(event: UserSubscriptionEvent): void
    {
        const parser = event.getParser();
    }

    private playSound(sound: string): void
    {
        Nitro.instance.events.dispatchEvent(new NitroSoundEvent(NitroSoundEvent.PLAY_SOUND, sound))
    }
}