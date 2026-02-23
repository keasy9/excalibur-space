import {Field} from '@/game/entities/field';
import {Engine} from 'excalibur';
import {Material} from '@/game/materials/material';
import fragment from '@/game/materials/sources/dust.frag?raw';
import {Colors} from '@/game/colors';
import {watch} from 'vue';
import {State} from '@/state';

export class Dust extends Field {
    protected material: Material|null = null;

    public onInitialize(engine: Engine) {
        super.onInitialize(engine);

        this.makeMaterial();

        watch(() => State.dustAmount, this.onUpdateState.bind(this));
    }

    protected makeMaterial() {
        if (!this.material) {
            // временный фикс, todo убрать после оптимизации шейдера тумана
            this.material ??= new Material({
                name: 'dust',
                fragmentSource: fragment,
            });

            this.material.update(shader => {
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
        }

        if (State.dustAmount > 0) {
            this.graphics.material = this.material;
            this.graphics.isVisible = true;
        } else {
            this.graphics.material = null;
            this.graphics.isVisible = false;
        }
    }

    protected onUpdateState(): void {
        this.material?.update(shader => {
            shader.trySetUniformFloat('u_amount', State.dustAmount);
        });

        this.makeMaterial();
    }
}
