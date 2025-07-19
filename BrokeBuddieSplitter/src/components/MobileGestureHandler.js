import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';

const MobileGestureHandler = ({ children, onSwipe, onPinch, onRotate }) => {
    const containerRef = useRef(null);
    const [gestureState, setGestureState] = React.useState({
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0
    });

    // Spring animations for smooth gesture responses
    const [springProps, setSpringProps] = useSpring(() => ({
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        config: { mass: 1, tension: 300, friction: 30 }
    }));

    const bind = useGesture({
        onDrag: ({ offset: [x, y], velocity: [vx, vy], direction: [dx, dy], cancel }) => {
            // Detect swipe gestures
            if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal swipe
                    if (dx > 0) {
                        onSwipe?.('right');
                    } else {
                        onSwipe?.('left');
                    }
                } else {
                    // Vertical swipe
                    if (dy > 0) {
                        onSwipe?.('down');
                    } else {
                        onSwipe?.('up');
                    }
                }
            }
            
            setSpringProps({ x, y });
        },
        onPinch: ({ offset: [scale, rotate], velocity: [vs, vr] }) => {
            setSpringProps({ scale, rotate });
            onPinch?.({ scale, rotate });
        },
        onWheel: ({ offset: [, y] }) => {
            // Handle scroll-based gestures
            setSpringProps({ y });
        }
    }, {
        drag: {
            from: () => [springProps.x.get(), springProps.y.get()],
            bounds: { left: -100, right: 100, top: -100, bottom: 100 },
            rubberband: true
        },
        pinch: {
            from: () => [springProps.scale.get(), springProps.rotate.get()],
            bounds: { scale: [0.5, 2], rotate: [-180, 180] },
            rubberband: true
        }
    });

    // Reset gestures when component unmounts
    useEffect(() => {
        return () => {
            setSpringProps({ scale: 1, rotate: 0, x: 0, y: 0 });
        };
    }, []);

    return (
        <animated.div
            ref={containerRef}
            {...bind()}
            style={{
                ...springProps,
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none'
            }}
        >
            {children}
        </animated.div>
    );
};

export default MobileGestureHandler; 