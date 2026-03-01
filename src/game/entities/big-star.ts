import {Entity} from '@/game/entities/entity';
import {ActionsComponent, Engine, EntityOptions, GraphicsComponent, randomIntInRange, Sprite, SpriteSheet, TransformComponent} from 'excalibur';
import {Resources} from '@/game/resources';
import {Color} from '@/game/extend/color';
import {Colors} from '@/game/colors';
import {watch} from 'vue';
import {State} from '@/state';

export class BigStar extends Entity<GraphicsComponent | TransformComponent | ActionsComponent> {

    protected static texture: SpriteSheet|undefined;

    constructor(options: Omit<EntityOptions<never>, 'components'> = {}) {
        super({
            ...options,
            components: [
                new TransformComponent(),
                new GraphicsComponent(),
                new ActionsComponent(),
            ],
        });
    }

    protected static loadTexture(): SpriteSheet {
        BigStar.texture ??= SpriteSheet.fromImageSource({
            image: Resources.SpriteStars,
            grid: {
                rows: 1,
                columns: 6,
                spriteHeight: Resources.SpriteStars.height,
                spriteWidth: Resources.SpriteStars.width / 6,
            },
        });

        return BigStar.texture;
    }

    public onInitialize(_engine: Engine) {
        this.randomize();

        watch(() => State.blinkStars, this.onUpdateState.bind(this));
    }

    public randomize(): this {
        this.setGraphic(BigStar.loadTexture().sprites[randomIntInRange(0, 5)]);
        this.getGraphic<Sprite>().tint = Color.lerpLRGB(Colors.starYellow, Colors.starBlue, Math.random());
        this.setRotation(Math.random() * Math.PI * 2);

        this.stopBlink();

        if (Math.random() > .5) this.startBlink();

        return this;
    }

    protected startBlink(): void {
        const fadeDuration = randomIntInRange(500, 1000);

        this.actions
            .delay(randomIntInRange(1, 10) * 2000)
            .repeatForever((actions) => {
                actions.fade(0, fadeDuration)
                    .delay(100)
                    .fade(1, fadeDuration)
                    .delay(4500)
            });
    }

    protected stopBlink(): void {
        this.actions.clearActions();
        this.setOpacity(1);
    }

    protected onUpdateState(): void {
        if (State.blinkStars) this.startBlink();
        else this.stopBlink();
    }
}
