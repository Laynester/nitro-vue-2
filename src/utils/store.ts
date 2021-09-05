import { createStore } from 'vuex';

export default createStore({
    state: {
        app: {
            isReady: false,
            isError: false,
            percent: 0,
            hotelview: true,
            lastZ: null,
            login: false,
            texts: null,
            config: null
        },
        user: {
            credits: 0,
            currencies: new Map<number, number>()
        },
        uiVisible: {
            navigator: true,
            catalogue: false,
            looks: false,
            purse: false
        },
        navigator: {
            topLevelContexts: null,
            topLevelContext: null,
            categories: [],
            filter: null,
            lastSearchResults: [],
            lastSearch: '',
            data: null,
            tradeSettings: [],
            homeRoomId: -1,
            isSearching: false,
            isLoaded: false,
            isLoading: false,
            roomCreator: false,
            roomInfoShowing: false,
            selectedRoom: null,
            selectedCategory: null,
            selectedTab: null,
        },
        room: {
            widgetHandler: null,
            history: false,
            historyDragged: false,
            chat: [],
            info: null
        }
    }
});
