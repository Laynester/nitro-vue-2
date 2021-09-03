import { createStore } from 'vuex';

export default createStore({
    state: {
        app: {
            isReady: false,
            isError: false,
            percent: 0,
            hotelview: true,
        },
        uiVisible: {
            navigator: true,
            catalogue: false,
            looks: false
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
            roomChat: null,
            roomChatHistory: null
        }
    }
});
