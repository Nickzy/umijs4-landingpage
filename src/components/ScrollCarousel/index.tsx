import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

interface Iprops {
    children: any,
    disabled?: boolean,
    total?: number,
    heightItem: number,
    speed?: number,
}

function ScrollCarousel (props: Iprops) {

    let { disabled, heightItem = 50, speed = 1.5 } = props;

    const selfRef = useRef<any>();

    const timerRef = useRef<any>();

    const wrapRef = useRef<any>();

    const [styleOptions, set_styleOptions] = useState<any>({
        marginTop: 0, 
        transition: `margin-top ${speed}s linear`
    })

    const [options, set_options] = useState({
        currentIndex: 0,
        loop: true,
        total: 0
    })

    const [ItemHeight, set_ItemHeight] = useState(0);

    useEffect(() => {
        set_options({
            ...options,
            total: props.total || 0
        })
    }, [props.total])

    function MouseLeave () {
        console.log('leave')
        clearInterval(timerRef.current);
        if (disabled) {
            return false
        }
        let { scrollTop } = selfRef.current;
        set_options({
            ...options,
            loop: true, 
            currentIndex: Math.floor(scrollTop / ItemHeight )
        })
        set_styleOptions({
            marginTop: `-${scrollTop}px`, 
            transition: 'none'
        })
        ItemHeight && palyStart(0)
    }

    function palyStart (timer?: number) {
        // console.log(disabled)
        // return
        
        if (!wrapRef.current) {
            return
        } else {
            if (wrapRef.current.clientHeight >= selfRef.current.clientHeight / 2) {
                return
            }
        }
        if (disabled) { return }
        timerRef.current = setInterval(() => {
            let { total,  currentIndex} = options;
            let num = currentIndex
            if (total >= currentIndex + 1) {
                num = num + 1;
            } else {
                num = 1;
            }
            // console.log(num, total)
            set_options({
                ...options,
                currentIndex: num
            })
            
        }, typeof timer === 'number' ? timer : speed * 1000)
    }

    function MouseEnter () {
        let { total,  currentIndex} = options;
        clearInterval(timerRef.current);
        if (disabled) {
            return false
        }
        if (selfRef.current) {
            let { scrollTop, clientHeight } = selfRef.current;
            // console.log(scrollTop, clientHeight)
            set_options({
                ...options,
                loop: false
            })
            resetStyle()
        }
    }
    
    function visibilitychangeFn () {
        clearInterval(timerRef.current)
        if(document.hidden){
        } else {
            ItemHeight && palyStart()
        }
    }
    
    function initOption () {
        set_options({
            ...options,
            currentIndex: 0,
            total: props.children.length || 0
        })
    }

    function resetStyle () {
        set_styleOptions({
            marginTop: 0, 
            transition: 'none'
        })
    }

    useEffect(() => {
        // let doms = selfRef.current.querySelector('.scrollItem');
        // console.log('doms', doms, doms.clientHeight)
        set_ItemHeight(0)
        if (props.children) {
            resetStyle()
            setTimeout(() => {
                set_ItemHeight(selfRef.current ? selfRef.current.clientHeight / 2 / props.children.length : 0)
            }, 0);
            initOption()
        }
        return () => {
            clearInterval(timerRef.current);
        }
    }, [props.children && props.children.length])

    useEffect(() => {
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }, [])

    useEffect(() => {
        if (!disabled && options.total > 0) {
            // console.log(disabled, timerRef.current, options)
            let { total,  currentIndex} = options;
            set_styleOptions({
                marginTop: `-${currentIndex * ItemHeight}px`, 
                transition: `margin-top ${speed}s linear`,
            })
            if (total <= currentIndex) {
                setTimeout(() => {
                    set_styleOptions({
                        marginTop: 0, 
                    })
                }, speed * 1000 * (0.9))
            }
            clearInterval(timerRef.current)
            ItemHeight && props.children && palyStart()
        }
        // 监听是否离开当前窗口
        if (!disabled && options.total > 0) {
            document.addEventListener('visibilitychange', visibilitychangeFn, false)
        }
        return () => {
            document.removeEventListener('visibilitychange', visibilitychangeFn, false)
        }
    }, [options.currentIndex, options.total, ItemHeight])
    // let transitionStyle = {
    //     marginTop: `-${options.currentIndex * ItemHeight}px`, 
    //     transition: 'margin-top 1.5s linear'
    // }

    return <div className="ScrollCarousel" ref={wrapRef}>
        <div ref={selfRef} style={{...styleOptions}} onMouseLeave={MouseLeave} onMouseEnter={MouseEnter} className="ScrollCarousel_wrap">
            {
                props.children
            }
            {
                !disabled && options.loop && props.children
            }
        </div>
    </div>
}

export default ScrollCarousel;
