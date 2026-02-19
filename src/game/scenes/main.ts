import {Engine, Scene} from "excalibur";
import {StarField} from "@/game/entities/star-field";

export class Main extends Scene {
    public onInitialize(_engine: Engine) {
        this.add(new StarField());
    }
}
