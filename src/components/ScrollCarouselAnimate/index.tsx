import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

interface Iprops {
    children: any,
    total?: number,
    speed: number
}

function ScrollCarouselAnimate (props: Iprops) {

    let { speed = 1 } = props;

    const wrapRef = useRef<any>();
    const dataBox = useRef<any>();
    
    const animatRef = useRef<any>();

    const [loop, setLoop] = useState(true);

    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
    
    function palyStart () {
        
        if(!dataBox.current || !loop){
            return;
        }
        let { offsetHeight } = dataBox.current;
        let { scrollTop } = wrapRef.current;

        if (scrollTop > offsetHeight + 5) {
            wrapRef.current.scrollTop = 0;
        } else {
            wrapRef.current.scrollTop = scrollTop + speed;
        }
        
        animatRef.current = requestAnimationFrame(palyStart);
    }

    function MouseEnter () {
        setLoop(false);
    }

    function MouseLeave () {
        setLoop(true);
    }
    
    useEffect(()=>{
        if(!wrapRef.current || !props.children){
            return;
        }
        let dataHeight = dataBox.current.offsetHeight;
        let wrapHeight = wrapRef.current.offsetHeight;
        
        if(loop && dataHeight > wrapHeight){
            animatRef.current = requestAnimationFrame(palyStart);
        }else{
            if(animatRef.current){
                window.cancelAnimationFrame(animatRef.current);
            };
        }
        return ()=>{
            if(animatRef.current){
                cancelAnimationFrame(animatRef.current);
            }
        }
    },[loop, props.children])

    return <div className='ScrollCarouselAnimate_wrap' ref={wrapRef}  onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
        <div className='ScrollCarouselAnimate'>
            <div ref={dataBox}>
                {
                    props.children
                }
            </div>
            {
                props.children
            }
        </div>

    </div>

}

export default ScrollCarouselAnimate;
