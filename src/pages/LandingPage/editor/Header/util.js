import { api } from '../../../../../helpers/auth';
export const creteaHtml = (data, title, DownloadHtml, landing_id_draft, form_id) => {

    let newStr = typeof data === 'string' ? data : JSON.stringify(data);
    let textDataStr = newStr.match(/"textData":\[([\s\S]*?)\]/);
    let textData = JSON.parse(`{${textDataStr[0]}}`) || {};
    let result = textData.textData ? textData.textData.map(item => item.text) : [];
    let description = result.join(' ');
    let firstImgStr = newStr.match(/"imgData":{([\s\S]*?)src([\s\S]*?)}/);
    let firstImgData = JSON.parse(`{${firstImgStr[0]}}`) || {};
    let imgUrl = firstImgData.imgData ? firstImgData.imgData.src : '';

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" >
        <title>${title || 'landingPage'}</title>

        <meta name="description" content="${description}" />
        <meta name="shareImg" content="${imgUrl || ''}" />

        <meta property="og:title" content="${title || ''}" />
        <meta property="og:image" content="${imgUrl || ''}" />
        <meta property="og:description" content="${description}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@social" />
        <meta name="twitter:title" content="${title || ''}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image:src" content="${imgUrl || ''}" />
        <meta name="twitter:image" content="${imgUrl || ''}" />

        <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.0.2/antd.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.0.2/antd.js"></script>

        <script src="https://cdn.bootcss.com/babel-standalone/6.26.0/babel.min.js"></script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script>
            window.Component = React.Component;
        </script>
    </head>
    <style>
        html,body,div,span,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,abbr,address,cite,code,del,dfn,em,img,ins,kbd,q,samp,small,strong,sub,sup,var,b,i,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary,time,mark,audio,video {
            margin: 0;
            padding: 0;
            border: 0;
            outline: 0; /*设置4个边框的样式*/
            outline-style: none; /*FF*/
            vertical-align: middle;
            word-break: break-word;
        }
        .wrap {
            width: 100%;
            height: 100%;
        }
        .content_item {
            position: relative;
        }
        .logo_wrap {
            position: relative;
            max-width: 1200px;
            width: 100%;
            padding: 0 40px;
            padding-top: 28px;
        }
        .logo {
            width: 110px;
            line-height: 40px;
            background: #ffffff;
            color: rgba(95, 98, 240, 1);
            font-size: 17px;
            text-align: center;
        }
        .logo_img {
            width: 110px;
            color: rgba(95, 98, 240, 1);
            font-size: 17px;
            text-align: center;
        }
        .logo_img > img {
            display: block;
            width: 100%;
        }
        .flex {
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
        }
        .flex-zCenter {
            -webkit-box-pack: center;
            -moz-justify-content: center;
            -webkit-justify-content: center;
            justify-content: center;
        }
        /* 主轴两端对齐 */
        .flex-zBetween {
            -webkit-box-pack: justify;
            -moz-justify-content: space-between;
            -webkit-justify-content: space-between;
            justify-content: space-between;
        }
        .flex-sAround {
            -webkit-box-pack: space-around;
            -moz-justify-content: space-around;
            -webkit-justify-content: space-around;
            justify-content: space-around;
        }
        /* 主轴end对齐 */
        .flex-zEnd {
            -webkit-box-pack: end;
            -moz-justify-content: flex-end;
            -webkit-justify-content: flex-end;
            justify-content: flex-end;
        }
        /* 主轴start对齐 */
        .flex-zStart {
            -webkit-box-pack: start;
            -moz-justify-content: start;
            -webkit-justify-content: start;
            justify-content: start;
        }
        /* 侧轴居中 */
        .flex-cCenter {
            -webkit-box-align: center;
            -moz-align-items: center;
            -webkit-align-items: center;
            align-items: center;
        }
        /* 主轴从上到下 */
        .flex-column {
            -webkit-box-direction: normal;
            -webkit-box-orient: vertical;
            -moz-flex-direction: column;
            -webkit-flex-direction: column;
            flex-direction: column;
        }
        /* 主轴从下到上 */
        .flex-zBottomTop {
            -webkit-box-pack: end;
            -webkit-box-direction: reverse;
            -webkit-box-orient: vertical;
            -moz-flex-direction: column-reverse;
            -webkit-flex-direction: column-reverse;
            flex-direction: column-reverse;
        }
        /*换行，第一行在上方  */
        .flex-zWrap {
            -webkit-box-pack: wrap;
            -moz-flex-wrap: wrap;
            -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
        }
        /* 侧轴底部对齐 */
        .flex-cEnd {
            -webkit-box-align: end;
            -moz-align-items: flex-end;
            -webkit-align-items: flex-end;
            align-items: flex-end;
        }
        .gird {
            padding: 20px;
        }
        .Horizontal_around {
            -webkit-box-pack: space-around;
            -moz-justify-content: space-around;
            -webkit-justify-content: space-around;
            justify-content: space-around;
        }
        .Horizontal_center {
            -webkit-box-pack: center;
            -moz-justify-content: center;
            -webkit-justify-content: center;
            justify-content: center;
        }
        .Horizontal_left {
            -webkit-box-pack: start;
            -moz-justify-content: start;
            -webkit-justify-content: start;
            justify-content: start;
        }
        .Horizontal_right {
            -webkit-box-pack: end;
            -moz-justify-content: flex-end;
            -webkit-justify-content: flex-end;
            justify-content: flex-end;
        }
        .vertical_center {
            -webkit-box-align: center;
            -moz-align-items: center;
            -webkit-align-items: center;
            align-items: center;
        }
        .flex_wrap {
            -webkit-box-pack: wrap;
            -moz-flex-wrap: wrap;
            -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
        }
        .vertical_bottom {
            -webkit-box-align: end;
            -moz-align-items: flex-end;
            -webkit-align-items: flex-end;
            align-items: flex-end;
        }
        .flexDirection_column {
            -webkit-box-direction: normal;
            -webkit-box-orient: vertical;
            -moz-flex-direction: column;
            -webkit-flex-direction: column;
            flex-direction: column;
        }
        .flexDirection_column-reverse {
            -webkit-box-pack: end;
            -webkit-box-direction: reverse;
            -webkit-box-orient: vertical;
            -moz-flex-direction: column-reverse;
            -webkit-flex-direction: column-reverse;
            flex-direction: column-reverse;
        }
        /*第一个模块*/
        .first_gird {
            flex: 1;
        }
        /*第二个模块*/
        .second_gird {
            flex: 1;
        }
        .content {
            margin: 0 auto;
            max-width: 1200px;
            width: 100%;
            height: 100%;
        }
        .link {
            cursor: pointer;
        }
        .self_and_form .ant-form-item {
            margin: 0;
        }
        .self_and_form >div {
            width: 100%;
        }
        .self_and_form .label_s {
            width: 100px;
            font-size: 12px;
            flex-shrink: 0;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
        .def_mar_b_20 {
            margin-bottom: 20px;
        }
        .form_label {
            width: 100px;
            flex-shrink: 0;
        }
        .mar_b_10 {
            display: inline-block;
            margin-bottom: 10px;
        }
        .pc_img_icon {
            width: 26px;
            height: 26px;
            margin-right: 10px;
        }
        .mobile_img_icon {
            width: 52px;
            margin-bottom: 20px;
        }
        .mar_h_25 {
            margin-right: 25px;
        }
        .mar_b_25 {
            margin-bottom: 25px;
        }
        .w_100 {
            width: 100%;
        }
        .width_130 {
            width: 130px;
            height: auto;
        }
        .width_vw_19 {
            width: 20vw;
        }
        .mar_10_16 {
            margin: 10px 16px;
        }
        .mar_10_28 {
            margin: 10px 28px;
        }
        @media screen and (max-width: 800px) {
            p {
                text-align: center;
            }
        }
    </style>
    <body>
        <div class="wrap" id="root"></div>
    </body>
    <script>
        (function (designWidth, maxWidth) {
        var doc = document,
            win = window;
        var docEl = doc.documentElement;
        var tid;
        var rootItem, rootStyle;

        function refreshRem() {
            var width = docEl.getBoundingClientRect().width;//获取当前设备的屏幕分辨率

            if (!maxWidth) {//最大宽度不存在的时候
                maxWidth = 540;//最大宽度就等于540px
            };
            if (width > maxWidth) {//当前设备宽度大于最大宽度时
                width = maxWidth;
            }
            //根元素上的字体大小=获取当前设备的屏幕分辨率*100/设计图的最小可视宽度(开始变化的分辨率)
            var rem = width * 100 / designWidth;
            rootStyle = "html{font-size:" + rem + 'px !important}';//根元素字体大小
            //通过id获取或者创建一个标签style
            rootItem = document.getElementById('rootsize') || document.createElement("style");
            if (!document.getElementById('rootsize')) {//如果该（rootsize） id不存在
                document.getElementsByTagName("head")[0].appendChild(rootItem);//在head里面插入style标签
                rootItem.id = 'rootsize';//设置id
            }
            if (rootItem.styleSheet) {
                rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
            } else {
                try {
                      /*  在 try 里面的发生错误，不会执行错误后的 try 里面的代码
            ,如果没有错误代码正常执行*/
                    rootItem.innerHTML = rootStyle
                } catch (f) {
                     /*如果 try 里面的代码出错，catch 负责补抓到错误信息封装到里面*/
                    rootItem.innerText = rootStyle
                }
            }

            docEl.style.fontSize = rem + "px";
        };
        refreshRem();

        win.addEventListener("resize", function () {//窗口监听
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);//每300毫秒调用一次
        }, false);

        win.addEventListener("pageshow", function (e) {//pageshow 事件在每次加载页面时触发相当于load
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(refreshRem, 300);
            }
        }, false);

        if (doc.readyState === "complete") {
            doc.body.style.fontSize = "16px";
        } else {
            doc.addEventListener("DOMContentLoaded", function (e) {
                doc.body.style.fontSize = "16px";
            }, false);
        }
    })(750, 750);
    </script>
    <script type="text/babel">
        class App extends React.Component {
            constructor (props) {
                super(props);
                this.state = {
                    tabDevice: 'pc',
                    formData: {},
                    countryPhoneCode: '+86',
                    landing_id_draft: ${landing_id_draft || "''"},
                    form_id: ${form_id || '""'},
                    formRules: {
                        email: function (value, required) {
                            let reg = ${/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/};
                            if (required) {
                                if (!value) {
                                    return 'E-mail cannot be empty';
                                }
                            }
                            if (value) {
                                if (!reg.test(value)) {
                                    return 'E-mail format is wrong';
                                }
                            }
                            return ''
                        },
                        name: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'Name cannot be empty';
                                }
                            }
                            return '';
                        },
                        sex: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'Gender cannot be empty';
                                }
                            }
                            return '';
                        },
                        country: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'Country cannot be empty';
                                }
                            }
                            return '';
                        },
                        city: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'City cannot be empty';
                                }
                            }
                            return '';
                        },
                        age: function (value, required) {
                            let reg = /^([0-9]*)$/;
                            if (required) {
                                if (!value) {
                                    return 'Age cannot be empty';
                                }
                            }
                            if (!reg.test(value)) {
                                return 'Age format is wrong';
                            }
                            return '';
                        },
                        phone: function (value, required) {
                            let reg = /^([0-9]*)$/;
                            if (required) {
                                if (!value) {
                                    return 'Mobile cannot be empty';
                                }
                            }
                            if (!reg.test(value)) {
                                return 'Mobile format is wrong';
                            }
                            return '';
                        },
                        firstName: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'First Name cannot be empty';
                                }
                            }
                            return '';
                        },
                        lastName: function (value, required) {
                            if (required) {
                                if (!value) {
                                    return 'Last Name cannot be empty';
                                }
                            }
                            return '';
                        }
                    }
                }
                this.changePc = this.changePc.bind(this);
                this.getModuleElements = this.getModuleElements.bind(this);
                this.getButtonElements = this.getButtonElements.bind(this);
                this.getFormElements = this.getFormElements.bind(this);
                this.getTextElements = this.getTextElements.bind(this);
                this.linkClick = this.linkClick.bind(this);
                this.submit = this.submit.bind(this);
                this.countryPhoneCodeChange = this.countryPhoneCodeChange.bind(this);
                this.formInputChange = this.formInputChange.bind(this);
                this.getClassName = this.getClassName.bind(this);
                this.layout = {
                    pc: {
                        Horizontal: {
                            center: 'flex-zCenter',
                            left: '',
                            right: 'flex-zEnd',
                            around: 'flex-sAround'
                        },
                        vertical: {
                            center: 'flex-cCenter',
                            top: '',
                            bottom: 'flex-cEnd'
                        },
                        flexDirection: {
                            column: 'flex-column',
                            'column-reverse': 'flex-zBottomTop'
                        }
                    },
                    mobile: {
                        Horizontal: {
                            center: 'flex-zCenter',
                            left: '',
                            right: 'flex-zEnd'
                        },
                        vertical: {
                            center: 'flex-cCenter',
                            top: '',
                            bottom: 'flex-cEnd'
                        },
                        flexDirection: {
                            column: 'flex-column',
                            'column-reverse': 'flex-zBottomTop'
                        }
                    }
                }
                this.page = ${ JSON.stringify(data) }
            }
            componentWillMount () {
                let formData = {}
                let page = ${DownloadHtml ? 'JSON.parse(this.page)' : 'this.page'}
                for (let value of page) {
                    for (let source of value.source) {
                        if (!source.layout) {
                            continue;
                        } else {
                            if (source.layout.includes('formData')) {
                                for (let form of source.formData.content) {
                                    if ((form.type === 'input' || form.type === 'select')) {
                                        formData[form.key] = {};
                                        formData[form.key].value = '';
                                        if (form.type === 'select') {
                                            formData[form.key].value = null;
                                        }
                                        formData[form.key].required = form.required
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                this.setState({formData})
            }
            componentDidMount () {
                this.changePc()
                window.addEventListener('resize', this.changePc, false);
            }
            componentWillUnmount () {
                window.removeEventListener('resize', this.changePc, false);
            }
            countryPhoneCodeChange (e) {
                let value = e.target.value;
                if (!value || value === "+") {
                    value = "+"
                }
                this.setState({countryPhoneCode: value});
            }
            formInputChange (e, key) {
                let value = e.target.value;
                let {formData} = this.state;
                formData[key].value = value
                this.setState({formData})
            }

            submit (success_text) {
                let reg = /^[\+][0-9]{1}[0-9]*$/
                let {formData, formRules, countryPhoneCode, landing_id_draft, form_id} = this.state;
                let error = [];
                let data = {};
                for (let namekey in formData) {
                    let resultstr = formRules[namekey](formData[namekey].value, formData[namekey].required);
                    data[namekey] = formData[namekey].value
                    if (resultstr) {
                        error.push(resultstr);
                    }
                }
                if (error.length) {
                    return antd.message.error(error[0]);
                }
                if (!reg.test(countryPhoneCode)) {
                    return antd.message.error('Area code format is wrong');
                }
                if (data.phone) {
                    data.phone = ${'`' + '${countryPhoneCode} ${data.phone}' + '`'}
                }
                if (data.firstName && data.lastName) {
                    data.name = [data.firstName, data.lastName].join(' ')
                }
                let postData = new FormData();
                postData.append('landing_id_draft', landing_id_draft);
                postData.append('form_id', form_id);
                for (let key in data) {
                    postData.append(key, data[key]);
                }
                axios.post('url', postData).then(res => {
                    if (res.data.status_code === 200) {
                        antd.message.success(success_text ? success_text : 'Submitted successfully')
                    } else {
                        antd.message.error(res.data.message)
                    }
                })
            }

            linkClick (url) {
                if (url) {
                    window.open(url);
                }
            }

            changePc (e) {
                let width = window.innerWidth;
                let tabDevice = "pc";
                if (!window.innerWidth) {
                    if (document.body) {
                        if (document.body.clientWidth) {
                            width = document.body.clientWidth;
                        }
                    }
                };
                if (width < 800) {
                    tabDevice = 'mobile';
                };
                if (tabDevice !== this.state.tabDevice) {
                    this.setState({tabDevice});
                };
            }

            getClassName (data, _this, device) {
                if (!data) {
                    return '';
                }
                if (!Object.keys(data).length) {
                    return '';
                }
                let arr = [];
                for (let i in data) {
                    if (data[i]) {
                        arr.push(${'`' + '${i}_${data[i]}' + '`'});
                    }
                }
                return arr.join(' ');
            }
            getTextElements (data) {
                let {tabDevice} = this.state;
                if (!data) {
                    return null;
                };
                if (Array.isArray(data)) {
                    return <div className={tabDevice === 'mobile' ? 'flex flex-column flex-cCenter' : ''}>
                        {
                            data.map((item, index) => {
                                return <p className={item.link ? 'link' : ''} onClick={() => {this.linkClick(item.link)}} key={index} {...item.props}>{item.text}</p>
                            })
                        }
                    </div>
                }
                return <p className={data.link ? 'link' : ''}  onClick={() => {this.linkClick(data.link)}} {...data.props}>{data.text}</p>
            }
            getFormElements (data) {
                let ref = React.createRef(null)
                if (!data) {
                    return null;
                }
                let className = '', label_className = 'mar_b_10';
                if (data.props.layout === "horizontal" || data.props.labelCol) {
                    className = "flex";
                    label_className = 'form_label';
                }
                return <form ref={ref} className="self_and_form" {...data.props}>
                    {
                        data.content.map((item, index) => {
                            let labelProps = item.props;
                            if (label_className) {
                                labelProps = Object.assign({}, labelProps, {style: {...labelProps.style, textAlign: data.props.labelAlign}})
                            }
                            let label = item.label;
                            if (item.required) {
                                if (!item.label.includes("*")) {
                                    label = ${'`' + '${item.label} *' + '`'}
                                }
                            }
                            if (item.type === 'input') {
                                if (item.key === 'phone') {
                                    return <div className={${'`' + 'def_mar_b_20 ${className}' + '`'}} key={index} {...item.wrapProps}>
                                        <label className={"flex vertical_center"} {...labelProps}><span  className={label_className + ' label_s'} {...labelProps}>{label}</span></label>
                                        <div className="flex w_100">
                                            <antd.Input style={{width: '50px'}} onChange={this.countryPhoneCodeChange} value={this.state.countryPhoneCode} />
                                            <antd.Input onChange={(e) => {this.formInputChange(e, item.key)}} value={this.state.formData[item.key].value} placeholder={item.placeholder || item.label} />
                                        </div>
                                    </div>
                                }
                                return <div className={${'`' + 'def_mar_b_20 ${className}' + '`'}} key={index} {...item.wrapProps}>
                                    <label className={"flex vertical_center"} {...labelProps}><span  className={label_className + ' label_s'} {...labelProps}>{label}</span></label>
                                    <antd.Input onChange={(e) => {this.formInputChange(e, item.key)}} value={this.state.formData[item.key].value} placeholder={item.placeholder || item.label} />
                                </div>
                            }
                            if (item.type === 'select') {
                                return <div className={${'`' + 'def_mar_b_20 ${className}' + '`'}} key={index} {...item.wrapProps}>
                                <label className={"flex vertical_center"} {...labelProps}><span  className={label_className + ' label_s'} {...labelProps}>{label}</span></label>
                                    <antd.Select placeholder={item.placeholder || 'Choose Gender'} onChange={(value) => {this.formInputChange({target: { value }}, item.key)}}>
                                        <antd.Select.Option value="男">Male</antd.Select.Option>
                                        <antd.Select.Option value="女">Female</antd.Select.Option>
                                    </antd.Select>
                                </div>;
                            }
                            if (item.type === 'button') {
                                return <div  key={index} className={className}>
                                    {
                                        className ? <label className={label_className}></label> : null
                                    }
                                    <antd.Button  onClick={() => {this.submit(item.success_text)}} {...item.props} type="primary">{item.content || item.button_text}</antd.Button>
                                </div>
                            }
                            return null;
                        })
                    }
                </form>
            }
            getButtonElements (data) {
                if (!data) {
                    return null;
                }
                return <antd.Button  onClick={() => {this.linkClick(data.link)}} {...data.props}>{data.text}</antd.Button>
            }
            getModuleElements (data, device) {
                if (!data) {
                    return null;
                }
                let _this = this;
                function getBaseDom (baseData) {
                    let { layout = [] } = baseData;
                    return layout.map(type => {
                        if (!baseData[type]) {
                            return null;
                        }
                        if (type === 'imgData') {
                            let { classData = {} } = baseData[type];
                            return <img onError={(e)=>{e.target.src=''}}className={baseData[type].link ? 'link' : '' + classData[device]}  onClick={() => {_this.linkClick(baseData[type].link)}} src={baseData[type].src} alt="" {...baseData[type].props}/>;
                        }
                        if (type === 'textData') {
                            return _this.getTextElements(baseData[type]);
                        }
                        if (type === 'formData') {
                            return _this.getFormElements(baseData[type]);
                        }
                        if (type === 'buttonData') {
                            return _this.getButtonElements(baseData[type]);
                        }
                    })
                }
                if (data.source) {
                    let {classData = {}} = data
                    let class_name = ${'`' + 'flex ${_this.getClassName(classData[device], _this, device)}' + '`'}
                    return <div className={class_name}>
                        {_this.getModuleElements(data.source, device)}
                    </div>
                }
                if (Array.isArray(data)) {
                    return data.map((item, index) => {
                        return <div key={index}>
                            {_this.getModuleElements(item, device)}
                        </div>
                    });
                } else {
                    return getBaseDom(data);
                }

            }
            getDom (data, is_mobile) {
                let {source = [], layout, props, logo, wrapLayout = {}} = data;
                let fatherProps = props || [];
                let device = is_mobile ? 'mobile' : 'pc';
                let _this = this;

                return <div className={"content_item flex flex-column flex-cCenter"} {...fatherProps} >
                    {
                        logo ?
                            <div  className={"logo_wrap flex " + _this.getClassName(logo.layout[device], _this, device)}>
                                <div className="logo_img">
                                    {logo.src ? <img onError={(e)=>{e.target.src=''}}src={logo.src} alt=""/> : <div className="logo">Logo</div>}
                                </div>
                            </div>
                            :
                            null
                    }
                    <div className={${'`' + 'content flex ${_this.getClassName(wrapLayout[device], _this, device)}' + '`'}}>
                        {
                            source.map((sourceItem, sourceIndex) => {
                                return <div key={${'`' + 'sourceItem_${sourceIndex}' + '`'}} className={${'`' + 'gird first_gird flex ${_this.getClassName(layout[sourceIndex][device], _this, device)}' + '`'}}>
                                    {this.getModuleElements(sourceItem, device)}
                                </div>
                            })
                        }
                    </div>
                </div>
            }
            render () {
                let {tabDevice} = this.state;
                let page = ${DownloadHtml ? 'JSON.parse(this.page)' : 'this.page'}
                return <div className="content_wrap">
                    {
                        page.map(item => {
                            return this.getDom(item, tabDevice === 'mobile')
                        })
                    }
                </div>
            }
        }
        window.onload = function () {
            if (ReactDOM) {
                ReactDOM.render(<App />, document.getElementById('root'));
            }
        }
    </script>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-186093442-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-186093442-1');
    </script>
    </html>`;
};
