import {Entity} from "@/game/entities/entity";
import {Engine, EntityOptions, GraphicsComponent, ImageSource, randomIntInRange, Rectangle, TransformComponent, Vector} from 'excalibur';
import {Material} from "@/game/materials/material";
import {Resources} from '@/resources';
import {watch} from 'vue';
import {State} from '@/game/utils/state';
import fragment from '@/game/materials/sources/background.frag?raw';

export class Background extends Entity<TransformComponent | GraphicsComponent> {
    protected static sprite: ImageSource|undefined;

    /**
     * Структура массива - [xPos, yPos]
     * @protected
     */
    protected points: Float32Array|undefined;

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
        Background.sprite ??= Resources.SpriteStars;

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
            images: {
                u_texture: Background.sprite,
            },
        });

        engine.screen.events.on('resize', () => {
            rect.width = engine.drawWidth;
            rect.height = engine.drawHeight;

            this.setPos(engine.getWorldBounds().left, engine.getWorldBounds().top);
            this.updatePoints();
        });

        watch(() => [State.blinkStars, State.starsCount], this.updateState.bind(this));

        this.updatePoints();
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

    protected updatePoints(): void {
        const width = this.getGraphic<Rectangle>().width;
        const height = this.getGraphic<Rectangle>().height;

        const maxStarsCount = Math.min(Math.round(width * height * .0008), 1_000);

        const attribCount = 2;

        this.points ??= new Float32Array(maxStarsCount * attribCount);
        const uniquePoints = new Set();

        let generateTries = 0;
        while (generateTries < 50 && uniquePoints.size < maxStarsCount) {
            const x = randomIntInRange(0, width);
            const y = randomIntInRange(0, height);

            const key = x + ',' + y;

            generateTries++;
            if (!uniquePoints.has(key)) {
                generateTries = 0;
                this.points[uniquePoints.size * attribCount] = x;
                this.points[uniquePoints.size * attribCount + 1] = y;
                uniquePoints.add(key);
            }
        }

        console.log(this.graphics.material?.getShader());
    }
}
