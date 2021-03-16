import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    position:"北京",
}

const mutations = {
    setPosition(state,val){
        state.position = val
    }
}

const actions  = {
    setPosition({commit},val){
        //异步请求后端位置数据
        commit("setPosition",val)
        console.log(val)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})