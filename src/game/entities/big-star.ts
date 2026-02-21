import {Entity} from '@/game/entities/entity';
import {Engine, GraphicsComponent, randomInRange, randomIntInRange, Sprite, SpriteSheet, TransformComponent} from 'excalibur';
import {Resources} from '@/game/resources';
import {Color} from '@/game/utils/color';
import {Colors} from '@/game/colors';
import {State} from '@/game/utils/state';

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
        // todo refactor - написано нейросетью
        // Если мерцание отключено — ничего не делаем (оставляем текущую opacity)
        if (!State.blinkStars) {
            this.setOpacity(1.0);
            return;
        }

        const time: number = engine.clock.now() / 5000;
        const pos: [number, number] = [this.getX(), this.getY()];

        // Размер тайла должен совпадать с использованным в шейдере
        const TILE_SIZE = 20;
        const tileX = Math.floor(pos[0] / TILE_SIZE);
        const tileY = Math.floor(pos[1] / TILE_SIZE);

        // Детерминированная случайная функция от двух чисел (аналог шейдерной)
        const random = (x: number, y: number): number => {
            const a = 12.9898;
            const b = 78.233;
            const c = 43758.5453;
            const dot = x * a + y * b;
            const mod = dot % 3.14;         // как в шейдере mod(dot, 3.14)
            const s = Math.sin(mod);
            const r = s * c;
            return r - Math.floor(r);        // дробная часть
        };

        // Базовая яркость (аналог baseBrightness в шейдере: 0.3…1.0)
        const baseOpacity = random(tileX + 2, tileY + 2) * 0.7 + 0.3;

        // Вероятность мерцания (порог 0.2 = 20% звёзд)
        const blinkProb = random(tileX + 4, tileY + 4);
        if (blinkProb >= 0.5) {
            // Звезда не мерцает — используем только базовую яркость
            this.setOpacity(baseOpacity);
            return;
        }

        // Звезда мерцает — вычисляем все параметры
        const speed = random(tileX + 5, tileY + 5) * 3.0 + 2.0;      // 2…5 Гц
        const phase = random(tileX + 6, tileY + 6) * 2.0 * Math.PI; // фаза 0…2π
        const phaseSeed = random(tileX + 7, tileY + 7) * 20.0;      // для медленной активности

        // Медленная активность (плавно меняется от 0 до 1)
        const activity = 0.5 + 0.5 * Math.sin(time * 0.3 + phaseSeed);

        // Быстрое мерцание (коэффициент от 0.1 до 1.3)
        const blinkFactor = 0.7 + 0.6 * Math.sin(time * speed + phase);

        // Смешивание обычного режима и режима мерцания под управлением activity
        const mergedFactor = (1.0 - activity) * 1.0 + activity * blinkFactor;

        // Итоговая яркость с учётом базовой и ограничениями
        let finalBrightness = baseOpacity * mergedFactor;
        finalBrightness = Math.max(0.1, Math.min(1.0, finalBrightness)); // clamp [0.1, 1.0]

        this.setOpacity(finalBrightness);
    }

    public randomize(): this {
        this.graphics.use(BigStar.loadTexture().sprites[randomIntInRange(0, 5)]);
        this.getGraphic<Sprite>().tint = Color.lerp(Colors.starYellow, Colors.starBlue, randomInRange(0, 1));
        this.setRotation(Math.random() * Math.PI * 2);

        return this;
    }
}
