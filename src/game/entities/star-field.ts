import {Entity} from "@/game/entities/entity";
import {Engine, EntityOptions, GraphicsComponent, Rectangle, TransformComponent, Vector} from 'excalibur';
import {Material} from "@/game/materials/material";
import {watch} from 'vue';
import {State} from '@/game/utils/state';
import fragment from '@/game/materials/sources/background.frag?raw';

export class StarField extends Entity<TransformComponent | GraphicsComponent> {
    constructor(options: Omit<EntityOptions<never>, 'components'> = {}) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent(),
            ],
        });
    }

    public onInitialize(engine: Engine) {
        this.setPos(engine.getWorldBounds().left, engine.getWorldBounds().top);

        const rect = new Rectangle({
            width: engine.drawWidth,
            height: engine.drawHeight,
        });

        this.graphics.use(rect);

        this.graphics.anchor = Vector.Zero;

        this.graphics.material = new Material({
            name: 'example',
            fragmentSource: fragment,
            uniforms: {
                u_stars_factor: State.starsCount,
                u_blinking_enabled: State.blinkStars,
            },
        });

        engine.screen.events.on('resize', () => {
            rect.width = engine.drawWidth;
            rect.height = engine.drawHeight;

            this.setPos(engine.getWorldBounds().left, engine.getWorldBounds().top);
        });

        watch(() => [State.blinkStars, State.starsCount], this.updateState.bind(this));
    }

    public onPreUpdate(engine: Engine, _elapsed: number) {
        this.graphics.material?.update(shader => shader.trySetUniformFloat('u_time', engine.clock.now()));
    }

    protected updateState(): void {
        this.graphics.material?.update(shader => {
            shader.trySetUniformFloat('u_stars_factor', State.starsCount);
            shader.trySetUniformBoolean('u_blinking_enabled', State.blinkStars);
        });
    }
}
