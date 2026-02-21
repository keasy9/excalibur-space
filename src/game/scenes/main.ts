import {Engine, RentalPool, Scene} from 'excalibur';
import {StarField} from "@/game/entities/star-field";
import {BigStar} from '@/game/entities/big-star';
import {watch} from 'vue';
import {State} from '@/game/utils/state';

export class Main extends Scene {
    protected bigStars: BigStar[] = [];
    protected bigStarsPool: RentalPool<BigStar>|undefined;

    public onInitialize(engine: Engine) {
        this.makeStars();
        this.makeBigStars();

        engine.screen.events.on('resize', () => this.onResize());

        watch(State, this.onUpdateState.bind(this));
    }

    protected makeStars() {
        this.add(new StarField().setZ(0));
    }

    protected makeBigStars() {
        this.bigStars.forEach(star => this.bigStarsPool?.return(star));
        this.bigStars = [];

        this.bigStarsPool ??= new RentalPool(
            () => new BigStar(),
            used => used.randomize(),
        );

        const bigStarsCount = (this.engine.drawWidth * this.engine.drawHeight) / 60000;
        const uniqueCoordinates = new Set();
        const minInterval = 100;

        let attempts = 0;
        while(uniqueCoordinates.size < bigStarsCount && attempts < 50) {
            attempts++;

            const randomX = Math.floor(Math.floor(Math.random() * (this.engine.drawWidth + minInterval) / minInterval) * minInterval);
            const randomY = Math.floor(Math.floor(Math.random() * (this.engine.drawHeight + minInterval) / minInterval) * minInterval);

            const key = randomX + ',' + randomY;
            if (!uniqueCoordinates.has(key)) {
                attempts = 0;
                this.bigStars.push(this.bigStarsPool.rent(true).setPos(randomX, randomY).setZ(1));
                uniqueCoordinates.add(key);
            }
        }

        this.bigStars.forEach(star => this.add(star));
    }

    protected onUpdateState(): void {
        const visibleCount = Math.round(this.bigStars.length * State.starsCount);
        this.bigStars.forEach((star, index) => {
            if (index + 1 < visibleCount) this.add(star);
            else this.remove(star);
        })
    }

    protected onResize(): void {
        this.makeBigStars();
    }
}
