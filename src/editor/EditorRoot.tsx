import { useRef, useEffect } from 'react';
import { Application, Container } from 'pixi.js';

import { IViewportOptions, Viewport } from 'pixi-viewport';
import { useStore } from '../stores/EditorStore';
import { METER } from './editor/constants';
// import { InteractionManager } from '@pixi/interaction';
import { extensions } from '@pixi/core';
import { EventSystem } from '@pixi/events';
import { Main } from './editor/Main';
import { InteractionManager } from '@pixi/interaction';

extensions.remove(InteractionManager);

export let main: Main;

export function EditorRoot() {
    const ref = useRef<HTMLDivElement>(null);
    const { setApp } = useStore();
    useEffect(() => {
        const app = new Application();

        (async () => {
            await app.init({
                view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                backgroundColor: 0xebebeb,
                antialias: true,
                resizeTo: window,
            });

            app.canvas.oncontextmenu = (e) => {
                e.preventDefault();
            };

            const viewportSettings = {
                screenWidth: app.screen.width,
                screenHeight: app.screen.height,
                worldWidth: 50 * METER,
                worldHeight: 50 * METER,
                events: app.renderer.events,
                eventMode: 'static',
            };
            main = new Main(viewportSettings);

            ref.current!.appendChild(app.canvas);
            app.start();

            app.stage.addChild(main);

            setApp(app);
        })();

        return () => {
            // On unload completely destroy the application and all of its children
            app.destroy(true, true);
        };
    }, []);

    return <div ref={ref} />;
}
