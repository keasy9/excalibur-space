import {Engine, EntityOptions, GraphicsComponent, Rectangle, TransformComponent, Vector} from 'excalibur';
import {Entity} from '@/game/entities/entity';

export abstract class Field extends Entity<GraphicsComponent | TransformComponent> {
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

        engine.screen.events.on('resize', () => {
            rect.width = engine.drawWidth;
            rect.height = engine.drawHeight;

            this.setPos(engine.getWorldBounds().left, engine.getWorldBounds().top);
        });
    }
}