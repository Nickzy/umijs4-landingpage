import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { Input, message } from 'antd';
const { Search } = Input;
import './index.scss';
import store from '../../redux/index';
import { string } from '@umijs/deps/compiled/yargs';

function DemoPage3() {

    let { formatMessage } = useIntl();

    const [state, setstate] = useState<{ type: string, list: [] } | {}>({})

    useEffect(() => {

        if (store.getState() && JSON.stringify(store.getState()) !== "{}") {
            setstate(store.getState())
        }

        //----------关键代码-----------start
        store.subscribe(storeChange) //订阅Redux的状态
        //----------关键代码-----------end

    }, [JSON.stringify(store.getState())])

    const onSearch = (v: string) => {
        let data = JSON.parse(JSON.stringify(state));
        if (v.trim()) {
            let l = data.list;
            
            if(l.includes(v)){
                message.error("添加内容已经存在");
                return false;
            }

            l.push(v)
            let action = {
                type: state.type,
                inputValue: v,
                list: l
            }
            store.dispatch(action);
        }
    }

    const storeChange = () => {
        setstate(store.getState())
    }

    const handleRemoveDom = (v: any) => {
        let data = JSON.parse(JSON.stringify(state));
        let l = data.list;
        l.splice(l.indexOf(v), 1)
        let action = {
            type: state.type,
            inputValue: v,
            list: l
        }
        store.dispatch(action);
    }

    return (
        <div className="demo3">
            <Search placeholder="input search text" onSearch={onSearch} enterButton />

            <hr />
            {
                JSON.stringify(state) !== "{}" ?
                    <div>
                        {
                            <h3>Type: {state.inputValue}</h3>
                        }
                        {
                            <ul>
                                {
                                    state.list.map((v: string, i: number) => {
                                        return <li key={String(i)} onClick={() => { handleRemoveDom(v); console.log(v, "~~~"); }}>{v}</li>
                                    })
                                }
                            </ul>
                        }
                    </div>
                    :
                    ""
            }
            demo3
        </div>
    );
}

export default DemoPage3