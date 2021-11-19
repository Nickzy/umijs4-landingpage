export default {
    //命名空间
    namespace:'landingPage',
    state:{
        pageSytle: {
        },
        pageDetail: {
            title: '',
            name: '',
            model_id: '',
            form_id: '',
            landing_draft_id: '',
            landing_id: '',
            page_status: 0,
            link: '',
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_content: '',
            utm_term: '',
        },
        page: [],
        activeData: {},
        pagechange: false,
        siderShow: false,
        inputOnBlur: false,
        forbiddenClick: false,
        saveDrafLoading: false,
        saveLoading: false
    },
    //处理state－－同步
    reducers:{
        changeDrafLoading (state, data) {
            return {...state, saveDrafLoading: data.saveDrafLoading};
        },
        changeSaveLoading (state, data) {
            return {...state, saveLoading: data.saveLoading};
        },
        forbiddenCLICK (state, data) {
            return {...state, forbiddenClick: data.forbiddenClick};
        },
        clearAll (state) {
            return {
                pageSytle: {
                },
                pageDetail: {
                    title: '',
                    name: '',
                    model_id: '',
                    form_id: '',
                    landing_draft_id: '',
                    landing_id: '',
                    page_status: 0,
                    link: '',
                    utm_source: '',
                    utm_medium: '',
                    utm_campaign: '',
                    utm_content: '',
                    utm_term: '',
                },
                page: [],
                activeData: {},
                pagechange: false,
                siderShow: false,
                inputOnBlur: false
            };
        },
        siderStatusChange (state, data) {
            return {...state, siderShow: data.siderShow};
        },
        pageBgChange (state, data) {
            return {...state, pageSytle: data.pageSytle};
        },
        reloadStateInt (state, data) {
            return {...state, ...data.data};
        },
        stateInt (state, data) {
            let {page, activeData = {}} = data;
            let pageDetail = {};
            for (let key in state.pageDetail) {
                if (key) {
                    pageDetail[key] = data[key] || '';
                    if (key === 'page_status') {
                        pageDetail[key] = typeof data[key] === 'number' ? data[key] : 0;
                    }
                }
            }
            return {...state, page, activeData, pageDetail};
        },
        set_pageDetail (state, data) {
            let newState = {...state, pageDetail: {...state.pageDetail,  ...data.data}};
            localStorage.setItem('currentLandingPageData', JSON.stringify(newState));
            return newState;
        },
        textOnBlur (state, data) {
            return {...state, inputOnBlur: false};
        },
        activeData (state, data) {
            return {...state, page: data.page, activeData: data.activeData, pagechange: false};
        },
        activeDataChange (state, data) {
            let activeData = {...state.activeData, data: data.data};
            let {page} = state;
            page = page.map((item, index) => {
                let list = null;
                if (activeData.key) {
                    list = activeData.key.split(',');
                }
                if (list && index === Number(list[0])) {
                    if (!item[list[1]]) {
                        item = data.data;
                    } else {
                        if (item[list[1]][list[2]]) {
                            if (item[list[1]][list[2]][list[3]]) {
                                if (item[list[1]][list[2]][list[3]][list[4]]) {
                                    if (item[list[1]][list[2]][list[3]][list[4]][list[5]]) {
                                        if (item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]]) { 
                                            item[list[1]][list[2]][list[3]][list[4]][list[5]][list[6]] = data.data;
                                        } else {
                                            item[list[1]][list[2]][list[3]][list[4]][list[5]] = data.data;
                                        }
                                    } else {
                                        item[list[1]][list[2]][list[3]][list[4]] = data.data;
                                    }
                                } else {
                                    item[list[1]][list[2]][list[3]] = data.data;
                                }
                            } else {
                                item[list[1]][list[2]] = data.data;
                            }
                        } else {
                            item[list[1]] = data.data;
                        }
                    }
                }
                return item;
            });
            return {...state, page, activeData, pagechange: data.pagechange, inputOnBlur: data.inputOnBlur, forbiddenClick: data.forbiddenClick};
        }
    },
    // 异步
    // yield表示后面的方法执行完以后 call表示调用一个api接口
    // put表示一个派发
    effects:{
    }
};