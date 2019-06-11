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
        userInfo: null,
        wanted: [],
        watched: [],
        celebrities: []
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
            let list = ['wanted', 'watched', 'celebrities']
            list.forEach(item => state[item] = [])
            removeStore('user_id');
        },

        addList(state, { name, obj }) {
            // console.log(state, name, obj)
            if(name === 'wanted') {
                for(let i=0; i < state.watched.length; i++) {
                    if(state.watched[i].id === obj.id) {
                        state.watched.splice(i, 1);
                        break;
                    }
                }
            } else {
                for(let i=0; i < state.wanted.length; i++) {
                    if(state.wanted[i].id === obj.id) {
                        state.wanted.splice(i, 1);
                        break;
                    }
                }
            }
            state[name].push(obj);
        }
    },
    actions: {
        async getUser({ commit }) {
            let res = await getUser();
            commit('getUserInfo', res);
        }
    }
})
