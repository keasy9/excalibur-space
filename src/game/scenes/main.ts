import {Engine, Scene} from "excalibur";
import {StarFieldBackground} from "@/game/entities/starFieldBackground";

export class Main extends Scene {
    public onInitialize(_engine: Engine) {
        this.add(new StarFieldBackground());
    }
}
