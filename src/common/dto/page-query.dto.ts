import { EnumFieldOptional, NumberFieldOptional } from '../../decorators';
import { Order } from '../../constants';

export class PageQueryDto {
    @EnumFieldOptional(() => Order, { default: Order.ASC })
    readonly order?: Order = Order.ASC;

    @NumberFieldOptional({ isInt: true, minimum: 1, default: 1 })
    readonly page?: number = 1;

    @NumberFieldOptional({ isInt: true, minimum: 1, maximum: 50, default: 10 })
    readonly take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}
