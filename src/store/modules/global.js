import { categoryAll } from '@/api/common';

const global = {
    state: {
        category: JSON.parse(localStorage.getItem('category')) || [],
        categoryIds: JSON.parse(localStorage.getItem('Ids')) || []
    },
    mutations: {
        SET_CATEGORY: (state, data) => {
            state.category = data
        },
        SET_CATEGORYIDS: (state, data) => {
            state.categoryIds = data
        },
    },
    actions: {
        getCategory({ commit }) {
            categoryAll().then((res) => {
                commit('SET_CATEGORY', res);
                localStorage.setItem('category', JSON.stringify(res))
            });
        },
        setCategoryIds({ commit }, Ids) {
            commit('SET_CATEGORYIDS', Ids);
            localStorage.setItem('Ids', JSON.stringify(Ids))
        },
    },
}

export default global;