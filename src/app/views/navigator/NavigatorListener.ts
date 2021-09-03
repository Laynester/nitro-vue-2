import { CantConnectMessageParser, ConvertGlobalRoomIdMessageComposer, DesktopViewComposer, GenericErrorEvent, IMessageEvent, LegacyExternalInterface, NavigatorCategoriesComposer, NavigatorCategoriesEvent, NavigatorCollapsedEvent, NavigatorEventCategoriesEvent, NavigatorHomeRoomEvent, NavigatorInitComposer, NavigatorLiftedEvent, NavigatorMetadataEvent, NavigatorOpenRoomCreatorEvent, NavigatorSearchComposer, NavigatorSearchesEvent, NavigatorSearchEvent, NavigatorSettingsComposer, NavigatorSettingsEvent, NavigatorTopLevelContext, Nitro, NitroToolbarEvent, RoomCreatedEvent, RoomDataParser, RoomDoorbellAcceptedEvent, RoomDoorbellEvent, RoomDoorbellRejectedEvent, RoomEnterErrorEvent, RoomForwardEvent, RoomInfoComposer, RoomInfoEvent, RoomInfoOwnerEvent, RoomScoreEvent, RoomSessionEvent, RoomSettingsUpdatedEvent, ToolbarIconEnum, UserInfoEvent } from "@nitrots/nitro-renderer";
import store from "../../../utils/store";

export class NavigatorListener
{
    private static _instance: NavigatorListener;
    private _messages: IMessageEvent[] = [];
    private static MAX_VISITOR_STEPPER: number = 10;
    private static MAX_VISITOR_INCREMENTOR: number = 5;

    public static SEARCH_FILTERS: any = [
        {
            name: 'anything',
            query: null
        },
        {
            name: 'room.name',
            query: 'roomname'
        },
        {
            name: 'owner',
            query: 'owner'
        },
        {
            name: 'tag',
            query: 'tag'
        },
        {
            name: 'group',
            query: 'group'
        }
    ];

    constructor()
    {
        NavigatorListener._instance = this;
        this.onRoomSessionEvent = this.onRoomSessionEvent.bind(this);
        this.registerMessages();
    }

    public static getInstance(): NavigatorListener
    {
        if (!NavigatorListener._instance) NavigatorListener._instance = new NavigatorListener();

        return NavigatorListener._instance;
    }

    private registerMessages(): void
    {
        Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent);
        Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent);

        this._messages = [
            new UserInfoEvent(this.onUserInfoEvent.bind(this)),
            new RoomForwardEvent(this.onRoomForwardEvent.bind(this)),
            new RoomInfoOwnerEvent(this.onRoomInfoOwnerEvent.bind(this)),
            new RoomInfoEvent(this.onRoomInfoEvent.bind(this)),
            new RoomEnterErrorEvent(this.onRoomEnterErrorEvent.bind(this)),
            new RoomCreatedEvent(this.onRoomCreatedEvent.bind(this)),
            new RoomDoorbellEvent(this.onRoomDoorbellEvent.bind(this)),
            new RoomDoorbellAcceptedEvent(this.onRoomDoorbellAcceptedEvent.bind(this)),
            new RoomScoreEvent(this.onRoomScoreEvent.bind(this)),
            new RoomSettingsUpdatedEvent(this.onRoomSettingsUpdatedEvent.bind(this)),
            new GenericErrorEvent(this.onGenericErrorEvent.bind(this)),
            new RoomDoorbellRejectedEvent(this.onRoomDoorbellRejectedEvent.bind(this)),
            new NavigatorCategoriesEvent(this.onNavigatorCategoriesEvent.bind(this)),
            new NavigatorCollapsedEvent(this.onNavigatorCollapsedEvent.bind(this)),
            new NavigatorEventCategoriesEvent(this.onNavigatorEventCategoriesEvent.bind(this)),
            new NavigatorLiftedEvent(this.onNavigatorLiftedEvent.bind(this)),
            new NavigatorMetadataEvent(this.onNavigatorMetadataEvent.bind(this)),
            new NavigatorOpenRoomCreatorEvent(this.onNavigatorOpenRoomCreatorEvent.bind(this)),
            new NavigatorSearchesEvent(this.onNavigatorSearchesEvent.bind(this)),
            new NavigatorSearchEvent(this.onNavigatorSearchEvent.bind(this)),
            new NavigatorSettingsEvent(this.onNavigatorSettingsEvent.bind(this)),
            new NavigatorHomeRoomEvent(this.onNavigatorHomeRoomEvent.bind(this)),

        ];

        for (const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if (!event) return;

        switch (event.type)
        {
            case RoomSessionEvent.CREATED:
                store.state.uiVisible.navigator = false;
                return;
            case RoomSessionEvent.ENDED:
                store.state.uiVisible.navigator = true;
                return
        }
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        Nitro.instance.communication.connection.send(new NavigatorCategoriesComposer());
        Nitro.instance.communication.connection.send(new NavigatorSettingsComposer());
    }

    private onRoomForwardEvent(event: RoomForwardEvent): void
    {
        if (!(event instanceof RoomForwardEvent)) return;

        const parser = event.getParser();

        if (!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, false, true));
    }

    private onRoomInfoOwnerEvent(event: RoomInfoOwnerEvent): void
    {
        if (!(event instanceof RoomInfoOwnerEvent)) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.data.currentRoomOwner = false;
        store.state.navigator.data.currentRoomOwner = parser.isOwner;
        store.state.navigator.data.currentRoomId = parser.roomId;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, true, false));

        LegacyExternalInterface.call('legacyTrack', 'navigator', 'private', [parser.roomId]);
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if (!(event instanceof RoomInfoEvent)) return;

        const parser = event.getParser();

        if (!parser) return;

        if (parser.roomEnter)
        {
            store.state.navigator.data.enteredGuestRoom = parser.data;
            store.state.navigator.data.staffPick = parser.data.roomPicker;

            const isCreatedRoom = (store.state.navigator.data.createdRoomId === parser.data.roomId);

            if (!isCreatedRoom && parser.data.displayRoomEntryAd)
            {
                // display ad
            }

            store.state.navigator.data.createdRoomId = 0;
        }
        else
        {
            if (parser.roomForward)
            {
                if ((parser.data.ownerName !== Nitro.instance.sessionDataManager.userName) && !parser.isGroupMember)
                {
                    switch (parser.data.doorMode)
                    {
                        case RoomDataParser.DOORBELL_STATE:
                            //this.openRoomDoorbell(parser.data);
                            return;
                        case RoomDataParser.PASSWORD_STATE:
                            //this.openRoomPassword(parser.data);
                            return;
                    }
                }

                this.goToRoom(parser.data.roomId);
            }
            else
            {
                store.state.navigator.data.enteredGuestRoom = parser.data;
                store.state.navigator.data.staffPick = parser.data.roomPicker;
            }
        }
    }

    private onRoomEnterErrorEvent(event: RoomEnterErrorEvent): void
    {
        if (!(event instanceof RoomEnterErrorEvent)) return;

        const parser = event.getParser();

        if (!parser) return;

        switch (parser.reason)
        {
            case CantConnectMessageParser.REASON_FULL:
                //this._notificationService.alert('${navigator.guestroomfull.text}', '${navigator.guestroomfull.title}');
                break;
            case CantConnectMessageParser.REASON_QUEUE_ERROR:
                //this._notificationService.alert('${room.queue.error. ' + parser.parameter + '}', '${room.queue.error.title}');
                break;
            case CantConnectMessageParser.REASON_BANNED:
                //this._notificationService.alert('${navigator.banned.text}', '${navigator.banned.title}');
                break;
            default:
                //this._notificationService.alert('${room.queue.error.title}', '${room.queue.error.title}');
                break;
        }


        Nitro.instance.communication.connection.send(new DesktopViewComposer());

        const toolbarEvent = new NitroToolbarEvent(NitroToolbarEvent.TOOLBAR_CLICK);

        toolbarEvent.iconName = ToolbarIconEnum.HOTEL_VIEW;

        Nitro.instance.roomEngine.events.dispatchEvent(toolbarEvent);
    }

    private onRoomCreatedEvent(event: RoomCreatedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.data.createdRoomId = parser.roomId;
        store.state.navigator.roomInfoShowing = false;

        this.goToRoom(parser.roomId);
    }

    private onRoomDoorbellEvent(event: RoomDoorbellEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        if (!parser.userName || (parser.userName.length === 0))
        {
            //this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, true)));
        }
    }

    private onRoomDoorbellAcceptedEvent(event: RoomDoorbellAcceptedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        if (!parser.userName || (parser.userName.length === 0))
        {
            //this._ngZone.run(() => (this._component && this._component.closeRoomDoorbell()));
        }
    }

    private onRoomScoreEvent(event: RoomScoreEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.data.canRate = parser.canLike;
    }

    private onRoomSettingsUpdatedEvent(event: RoomSettingsUpdatedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, false, false));
    }

    private onGenericErrorEvent(event: GenericErrorEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        switch (parser.errorCode)
        {
            case -100002:
                //this._ngZone.run(() => (this._component && this._component.openRoomPassword(null, true)));
                break;
            case 4009:
                // this._notificationService.alert('${navigator.alert.need.to.be.vip}', '${generic.alert.title}');
                break;
            case 4010:
                //this._notificationService.alert('${navigator.alert.invalid_room_name}', '${generic.alert.title}');
                break;
            case 4011:
                //this._notificationService.alert('${navigator.alert.cannot_perm_ban}', '${generic.alert.title}');
                break;
            case 4013:
                //this._notificationService.alert('${navigator.alert.room_in_maintenance}', '${generic.alert.title}');
                break;
        }
    }

    private onRoomDoorbellRejectedEvent(event: RoomDoorbellRejectedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        if (!parser.userName || (parser.userName.length === 0))
        {
            //this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, false, true)));
        }
    }

    private onNavigatorCategoriesEvent(event: NavigatorCategoriesEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.categories = parser.categories;
    }

    private onNavigatorCollapsedEvent(event: NavigatorCollapsedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;
    }

    private onNavigatorEventCategoriesEvent(event: NavigatorEventCategoriesEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;
    }

    private onNavigatorLiftedEvent(event: NavigatorLiftedEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;
    }

    private onNavigatorMetadataEvent(event: NavigatorMetadataEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.topLevelContexts = parser.topLevelContexts;

        if (store.state.navigator.topLevelContexts.length > 0) this.setCurrentContext(store.state.navigator.topLevelContexts[0]);

        this.clearSearch();
    }

    private onNavigatorOpenRoomCreatorEvent(event: NavigatorOpenRoomCreatorEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        //if(!this._component) return;

        //this._component.openRoomCreator()
    }

    private onNavigatorSearchEvent(event: NavigatorSearchEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        const resultSet = parser.result;

        if (!resultSet) return;

        this.setCurrentContextByCode(resultSet.code);

        store.state.navigator.lastSearchResults = resultSet.results;
        store.state.navigator.isSearching = false;
    }

    private onNavigatorSearchesEvent(event: NavigatorSearchesEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;
    }

    private onNavigatorSettingsEvent(event: NavigatorSettingsEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;
    }

    private onNavigatorHomeRoomEvent(event: NavigatorHomeRoomEvent): void
    {
        if (!event) return;

        const parser = event.getParser();

        if (!parser) return;

        store.state.navigator.homeRoomId = parser.homeRoomId;
    }

    public getMaxVisitors(count: number): number[]
    {
        const maxVisitors = [];

        let i = NavigatorListener.MAX_VISITOR_STEPPER;

        while (i <= count)
        {
            maxVisitors.push(i);

            i += NavigatorListener.MAX_VISITOR_INCREMENTOR;
        }

        return maxVisitors;
    }


    public goToRoom(roomId: number, password: string = null): void
    {
        Nitro.instance.roomSessionManager.createSession(roomId, password);
    }

    public goToPrivateRoom(roomId: number): void
    {
        Nitro.instance.communication.connection.send(new RoomInfoComposer(roomId, false, true));
    }

    private setTradeSettings(): void
    {
        store.state.navigator.tradeSettings = [];

        store.state.navigator.tradeSettings.push(...[
            '${navigator.roomsettings.trade_not_allowed}',
            '${navigator.roomsettings.trade_not_with_Controller}',
            '${navigator.roomsettings.trade_allowed}'
        ]);
    }

    public goToHomeRoom(): boolean
    {
        if (store.state.navigator.homeRoomId < 1) return false;

        this.goToRoom(store.state.navigator.homeRoomId);

        return true;
    }


    public linkReceived(k: string): void
    {
        const parts = k.split('/');

        if (parts.length < 2) return;

        switch (parts[1])
        {
            case 'goto':
                if (parts.length > 2)
                {
                    switch (parts[2])
                    {
                        case 'home':
                            this.goToHomeRoom();
                            break;
                        default: {
                            const roomId = parseInt(parts[2]);

                            if (roomId > 0) this.goToPrivateRoom(roomId);
                        }
                    }
                }
                return;
        }
    }

    public enterRoomWebRequest(k: string, _arg_2: boolean = false, _arg_3: string = null)
    {
        //this._webRoomReport = _arg_2;
        //this._webRoomReportedName = _arg_3;
        Nitro.instance.communication.connection.send(new ConvertGlobalRoomIdMessageComposer(k));
    }

    public getContextByCode(code: string): NavigatorTopLevelContext
    {
        if (!code) return null;

        for (const context of store.state.navigator.topLevelContexts)
        {
            if (!context || (context.code !== code)) continue;

            return context;
        }

        return null;
    }

    public setCurrentContext(context: NavigatorTopLevelContext, search: boolean = true): void
    {
        if (!context || (store.state.navigator.topLevelContext === context)) return;

        store.state.navigator.topLevelContext = context;
    }

    public setCurrentContextByCode(code: string, search: boolean = true): void
    {
        if (!code) return;

        const topLevelContext = this.getContextByCode(code);

        if (!topLevelContext) return;

        this.setCurrentContext(topLevelContext, search);
    }

    public setCurrentFilter(filter: any): void
    {
        if (!filter || (store.state.navigator.filter === filter)) return;

        store.state.navigator.filter = filter;
    }

    public search(value: string = null): void
    {
        if (!store.state.navigator.topLevelContext || store.state.navigator.isSearching) return;

        if (!store.state.navigator.filter) this.setCurrentFilter(NavigatorListener.SEARCH_FILTERS[0]);

        const query = ((store.state.navigator.filter && store.state.navigator.filter.query) ? store.state.navigator.filter.query + ':' : '');

        let search = value;

        if (search === null) search = store.state.navigator.lastSearch;

        store.state.navigator.lastSearch = (search || '');

        this.sendSearch(store.state.navigator.topLevelContext.code, (query + store.state.navigator.lastSearch));
    }

    public clearSearch(): void
    {
        this.setCurrentFilter(NavigatorListener.SEARCH_FILTERS[0]);

        store.state.navigator.lastSearch = null;

        (store.state.navigator.isLoaded && this.search());
    }

    private sendSearch(code: string, query: string): void
    {
        if (!code) return;

        store.state.navigator.isSearching = true;

        Nitro.instance.communication.connection.send(new NavigatorSearchComposer(code, query));
    }

    public get eventUrlPrefix(): string
    {
        return 'navigator';
    }

    public loadNavigator(): void
    {
        Nitro.instance.communication.connection.send(new NavigatorInitComposer());

        store.state.navigator.isLoaded = true;
    }

    public toggleRoomCreator(): void
    {
        store.state.navigator.roomCreator = !store.state.navigator.roomCreator;
    }
}