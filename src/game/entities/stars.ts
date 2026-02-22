import {Engine} from 'excalibur';
import {Material} from "@/game/materials/material";
import {watch} from 'vue';
import {State} from '@/state';
import fragment from '@/game/materials/sources/stars.frag?raw';
import {Colors} from '@/game/colors';
import {Field} from '@/game/entities/field';

export class Stars extends Field {

    public onInitialize(engine: Engine) {
        super.onInitialize(engine);

        this.graphics.material = new Material({
            name: 'stars',
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
