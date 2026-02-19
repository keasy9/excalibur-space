import {ActionsComponent, BodyComponent, ColliderComponent, type Component, Entity as ExcaliburEntity, Graphic, GraphicsComponent, type MaybeKnownComponent, MotionComponent, PointerComponent, TransformComponent, type Vector} from 'excalibur';
import {toVector, VectorLike} from '@/game/utils/convert';

type MaybeKnownComponentProp<Component, TKnownComponents, ComponentProp, Fallback = undefined> = Component extends TKnownComponents ? ComponentProp : ComponentProp | Fallback;

export class Entity<TKnownComponents extends Component = any> extends ExcaliburEntity<TKnownComponents> {
    /**
     * Вернёт TransformComponent, если он есть у сущности.
     */
    public get transform(): MaybeKnownComponent<TransformComponent, TKnownComponents> {
        return this.get(TransformComponent);
    }

    /**
     * Вернёт позицию, если у сущности есть TransformComponent.
     */
    public getPos(): MaybeKnownComponentProp<TransformComponent, TKnownComponents, Vector> {
        return this.get(TransformComponent)?.pos as any;
    }

    /**
     * Вернёт позицию сущности по y, если у неё есть TransformComponent.
     */
    public getY(): MaybeKnownComponentProp<TransformComponent, TKnownComponents, number> {
        return this.get(TransformComponent)?.pos.y as any;
    }

    /**
     * Установит позицию сущности по y, если у неё есть TransformComponent.
     * @param newY
     */
    public setY(newY: number): this {
        if (this.has(TransformComponent)) this.get(TransformComponent)!.pos.y = newY;
        return this;
    }

    /**
     * Вернёт позицию сущности по x, если у неё есть TransformComponent.
     */
    public getX(): MaybeKnownComponentProp<TransformComponent, TKnownComponents, number> {
        return this.get(TransformComponent)?.pos.x as any;
    }

    /**
     * Установит позицию сущности по x, если у неё есть TransformComponent.
     * @param newX
     */
    public setX(newX: number): this {
        if (this.has(TransformComponent)) this.get(TransformComponent)!.pos.x = newX;
        return this;
    }

    /**
     * Установит позицию для сущности, если у неё есть TransformComponent.
     * @param newPos
     */
    public setPos(newPos: VectorLike): this;
    public setPos(x: number, y?: number): this;
    public setPos(newPosOrX: VectorLike|number, y?: number): this {
        if (this.has(TransformComponent)) this.get(TransformComponent)!.pos = toVector(newPosOrX, y);
        return this;
    }

    /**
     * Вернёт z сущности, если у неё есть TransformComponent.
     */
    public getZ(): MaybeKnownComponentProp<TransformComponent, TKnownComponents, number> {
        return this.get(TransformComponent)?.z as any;
    }

    /**
     * Установит z сущности, если у неё есть TransformComponent.
     * @param newZ
     */
    public setZ(newZ: number): this {
        if (this.has(TransformComponent)) this.get(TransformComponent)!.z = newZ;
        return this;
    }

    /**
     * Вернёт поворот сущности, если у неё есть TransformComponent.
     */
    public getRotation(): MaybeKnownComponentProp<TransformComponent, TKnownComponents, number> {
        return this.get(TransformComponent)?.rotation as any;
    }

    /**
     * Установит поворот сущности, если у неё есть TransformComponent.
     */
    public setRotation(newRotation: number): this {
        if (this.has(TransformComponent)) this.get(TransformComponent)!.rotation = newRotation;
        return this;
    }

    /**
     * Вернёт GraphicsComponent, если он есть у сущности.
     */
    public get graphics(): MaybeKnownComponent<GraphicsComponent, TKnownComponents> {
        return this.get(GraphicsComponent);
    }

    /**
     * Вернёт текущую графику, если у сущности есть GraphicsComponent.
     */
    public getGraphic<TCurrentGraphic extends Graphic | undefined = Graphic | undefined>(
    ): MaybeKnownComponentProp<TransformComponent, TKnownComponents, TCurrentGraphic> {
        return this.get(GraphicsComponent)?.current as any;
    }

    /**
     * Установит графику сущности, если у неё есть GraphicsComponent.
     * @param newGraphic
     */
    public setGraphic(newGraphic: Graphic): this {
        this.get(GraphicsComponent)?.use(newGraphic);
        return this;
    }

    /**
     * Вернёт непрозрачность текущей графики сущности, если у неё есть GraphicsComponent.
     */
    public getOpacity(): MaybeKnownComponentProp<GraphicsComponent, TKnownComponents, number> {
        return this.get(GraphicsComponent)?.current?.opacity as any;
    }

    /**
     * Установит непрозрачность текущей графики сущности, если у неё есть GraphicsComponent.
     */
    public setOpacity(newOpacity: number): this {
        const graphic = this.get(GraphicsComponent)?.current;
        if (graphic) graphic.opacity = newOpacity;
        return this;
    }

    /**
     * Вернёт BodyComponent, если он есть у сущности.
     */
    public get body(): MaybeKnownComponent<BodyComponent, TKnownComponents> {
        return this.get(BodyComponent);
    }

    /**
     * Вернёт высоту элемента. Сперва проверяет коллайдер, затем графику, а после возвращает 0 если у сущности нет ни того, ни другого.
     */
    public getHeight(): MaybeKnownComponentProp<ColliderComponent | GraphicsComponent, TKnownComponents, number, 0> {
        return this.get(ColliderComponent)?.localBounds.height ?? this.get(GraphicsComponent)?.current?.height ?? 0;
    }

    /**
     * Вернёт ширину элемента. Сперва проверяет коллайдер, затем графику, а после возвращает 0 если у сущности нет ни того, ни другого.
     */
    public getWidth(): MaybeKnownComponentProp<ColliderComponent | GraphicsComponent, TKnownComponents, number, 0> {
        return this.get(ColliderComponent)?.localBounds.width ?? this.get(GraphicsComponent)?.current?.width ?? 0;
    }

    /**
     * Вернёт MotionComponent, если он есть у сущности.
     */
    public get motion(): MaybeKnownComponent<MotionComponent, TKnownComponents> {
        return this.get(MotionComponent);
    }

    /**
     * Вернёт ColliderComponent, если он есть у сущности.
     */
    public get collider(): MaybeKnownComponent<ColliderComponent, TKnownComponents> {
        return this.get(ColliderComponent);
    }

    /**
     * Вернёт PointerComponent, если он есть у сущности.
     */
    public get pointer(): MaybeKnownComponent<PointerComponent, TKnownComponents> {
        return this.get(PointerComponent);
    }

    /**
     * Вернёт ActionsComponent, если он есть у сущности.
     */
    public get actions(): MaybeKnownComponent<ActionsComponent, TKnownComponents> {
        return this.get(ActionsComponent);
    }

    /**
     * Ушла ли сущность за пределы экрана
     */
    public get offscren(): boolean {
        return this.hasTag('ex.offscreen');
    }
}