import {Field} from '@/game/entities/field';
import {Engine} from 'excalibur';
import {Material} from '@/game/materials/material';
import fragment from '@/game/materials/sources/dust.frag?raw';
import {Colors} from '@/game/colors';
import {watch} from 'vue';
import {State} from '@/state';

export class Dust extends Field {
    public onInitialize(engine: Engine) {
        super.onInitialize(engine);

        this.graphics.material = new Material({
            name: 'dust',
            fragmentSource: fragment,
        });

        this.graphics.material.update(shader => {
            // облака
            shader.trySetUniformFloat('u_size', 20.0);
            shader.trySetUniformFloat('u_cloud_size', 10.0);
            shader.trySetUniformFloat('u_amount', State.dustAmount);
            shader.trySetUniformFloat('u_sharpness', 0.8);
            shader.trySetUniformInt('u_octaves', 8);

            // цвета звёзд
            shader.trySetUniform('uniform3fv', 'u_color_high',[Colors.starBlue.r / 255, Colors.starBlue.g / 255, Colors.starBlue.b / 255]);
            shader.trySetUniform('uniform3fv', 'u_color_low',[Colors.starYellow.r / 255, Colors.starYellow.g / 255, Colors.starYellow.b / 255]);
        });

        watch(() => State.dustAmount, this.onUpdateState.bind(this));
    }

    protected onUpdateState(): void {
        this.graphics.material?.update(shader => {
            shader.trySetUniformFloat('u_amount', State.dustAmount);
        });
    }
}
