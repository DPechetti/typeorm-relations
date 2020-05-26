import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products.map(product => {
        return {
          price: product.price,
          quantity: product.quantity,
          product_id: product.product_id,
        };
      }),
    });

    await this.ormRepository.save(order);

    const savedOrder = await this.findById(order.id);

    return savedOrder || order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository
      .createQueryBuilder('order')
      .where({ id })
      .leftJoin('order.customer', 'customer')
      .leftJoin('order.order_products', 'order_products')
      .addSelect([
        'customer.id',
        'customer.name',
        'customer.email',
        'order_products.product_id',
        'order_products.price',
        'order_products.quantity',
      ])
      .getOne();

    return order;
  }
}

export default OrdersRepository;
