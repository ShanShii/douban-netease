import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import {
    setStore,
    removeStore
} from './api/mUtils'
import {
    getUser
} from './api/douban'

export default new Vuex.Store({
    state: {
        location: '',
        isLogin: false,
        userInfo: null
    },
    // localStorage中有userid就保存登陆状态
    mutations: {
        setLocation(state, location) {
            state.location = location;
            setStore('location', location);
        },
        setUserInfo(state, info) {
            state.isLogin = true;
            state.userInfo = info;
            setStore('user_id', info.user_id);
        },
        getUserInfo(state, info) {
            if (state.userInfo && (state.userInfo.username !== info.username)) {
                return;
            }
            if (!info.message) {
                state.isLogin = true;
                state.userInfo = {...info};
            } else {
                state.userInfo = null;
            }
        },
        logout(state) {
            state.isLogin = false;
            state.userInfo = null;
            removeStore('user_id');
        }
    },
    actions: {
        async getUser({ commit }) {
            let res = await getUser();
            commit('getUserInfo', res);
        }
    }
})
