import {Entity} from '@/game/entities/entity';
import {clamp, Engine, GraphicsComponent, randomIntInRange, Sprite, SpriteSheet, TransformComponent} from 'excalibur';
import {Resources} from '@/game/resources';
import {Color} from '@/game/utils/color';
import {Colors} from '@/game/colors';
import {State} from '@/game/utils/state';
import {randomByVec} from '@/game/utils/math';

export class BigStar extends Entity<GraphicsComponent | TransformComponent> {

    protected static texture: SpriteSheet|undefined;

    constructor() {
        super([new GraphicsComponent(), new TransformComponent()]);
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
    }

    public onPreUpdate(engine: Engine, _elapsed: number) {
        if (!State.blinkStars) {
            this.setOpacity(1.0);
            return;
        }

        // вычисляем мерцание в рантайме, чтобы не следить за сменой позиции

        const time: number = engine.clock.now() / 5000;
        const pos: [number, number] = [this.getX(), this.getY()];

        const tileSize = 20;
        const tileX = Math.floor(pos[0] / tileSize);
        const tileY = Math.floor(pos[1] / tileSize);

        // базовая яркость
        const baseOpacity = randomByVec(tileX + 2, tileY + 2) * 0.7 + 0.3;

        // вероятность мерцания (порог 0.5 = 50% звёзд)
        if (randomByVec(tileX + 4, tileY + 4) >= 0.5) {
            // не мерцает
            this.setOpacity(baseOpacity);
            return;
        }

        const speed = randomByVec(tileX + 5, tileY + 5) * 3.0 + 2.0; // частота
        const phase = randomByVec(tileX + 6, tileY + 6) * 2.0 * Math.PI; // фаза
        const phaseSeed = randomByVec(tileX + 7, tileY + 7) * 20.0; // для медленной активности

        // медленная активность (плавно меняется от 0 до 1)
        const activity = 0.5 + 0.5 * Math.sin(time * 0.3 + phaseSeed);

        // быстрое мерцание (коэффициент от 0.1 до 1.3)
        const blinkFactor = 0.7 + 0.6 * Math.sin(time * speed + phase);

        // смешивание обычного режима и режима мерцания под управлением activity
        const mergedFactor = (1.0 - activity) + (activity * blinkFactor);

        // итоговая яркость с учётом базовой и ограничений
        const finalBrightness = clamp(baseOpacity * mergedFactor, 0.1, 1.0);

        this.setOpacity(finalBrightness);
    }

    public randomize(): this {
        this.setGraphic(BigStar.loadTexture().sprites[randomIntInRange(0, 5)]);
        this.getGraphic<Sprite>().tint = Color.lerp(Colors.starYellow, Colors.starBlue, Math.random());
        this.setRotation(Math.random() * Math.PI * 2);

        return this;
    }
}
