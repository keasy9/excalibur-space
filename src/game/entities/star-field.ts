import {ColliderComponent, Engine, EntityOptions, GraphicsComponent, Rectangle, TransformComponent, Vector} from 'excalibur';
import {Material} from "@/game/materials/material";
import {watch} from 'vue';
import {State} from '@/game/utils/state';
import fragment from '@/game/materials/sources/background.frag?raw';
//@ts-ignore что-то странное
import {Colors} from '@/game/colors';
import {Entity} from '@/game/entities/entity';

export class StarField extends Entity<TransformComponent | GraphicsComponent | ColliderComponent> {
    constructor(options: Omit<EntityOptions<never>, 'components'> = {}) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent({ anchor: Vector.Zero }),
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

        this.graphics.material = new Material({
            name: 'example',
            fragmentSource: fragment,
            uniforms: {
                u_stars_factor: State.starsCount,
                u_blinking_enabled: State.blinkStars,
            },
        });

        this.graphics.material?.update(shader => {
            shader.trySetUniform('uniform4fv', 'u_star_from_color', Colors.starYellow.toFloat());
            shader.trySetUniform('uniform4fv', 'u_star_to_color', Colors.starBlue.toFloat());
        });

        engine.screen.events.on('resize', () => {
            rect.width = engine.drawWidth;
            rect.height = engine.drawHeight;

            this.setPos(engine.getWorldBounds().left, engine.getWorldBounds().top);
        });

        watch(() => [State.blinkStars, State.starsCount], this.onUpdateState.bind(this));
    }

    public onPreUpdate(engine: Engine, _elapsed: number) {
        this.graphics.material?.update(shader => shader.trySetUniformFloat('u_time', engine.clock.now()));
    }

    protected onUpdateState(): void {
        this.graphics.material?.update(shader => {
            shader.trySetUniformFloat('u_stars_factor', State.starsCount);
            shader.trySetUniformBoolean('u_blinking_enabled', State.blinkStars);
        });
    }
}
