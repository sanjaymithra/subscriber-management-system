import { SubscriberRepository } from './subscribers.repository.js'
import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { AppError } from '../../errors/AppError.js'
import type { CreateSubscriberInput, SubscriberListQuery, UpdateSubscriberInput } from './subscribers.types.js'

export class SubscriberService {
  constructor(private readonly subscriberRepository = new SubscriberRepository()) {}

  async createSubscriber(input: CreateSubscriberInput) {
    const existingSubscriber = await this.subscriberRepository.findByIdOrSubscriberId(input.subscriberId)

    if (existingSubscriber) {
      throw new AppError('Subscriber ID already exists', HTTP_STATUS.CONFLICT)
    }

    return this.subscriberRepository.create(input)
  }

  async deleteSubscriber(id: string) {
    const subscriber = await this.getSubscriber(id)

    await this.subscriberRepository.delete(subscriber.id)

    return subscriber
  }

  async getDashboardStats() {
    return this.subscriberRepository.getStats()
  }

  async getSubscriber(id: string) {
    const subscriber = await this.subscriberRepository.findByIdOrSubscriberId(id)

    if (!subscriber) {
      throw new AppError('Subscriber not found', HTTP_STATUS.NOT_FOUND)
    }

    return subscriber
  }

  async listSubscribers(query: SubscriberListQuery) {
    const { subscribers, total } = await this.subscriberRepository.findMany(query)
    const pages = Math.max(1, Math.ceil(total / query.limit))

    return {
      data: subscribers,
      meta: {
        limit: query.limit,
        page: query.page,
        pages,
        total,
      },
    }
  }

  async updateSubscriber(id: string, input: UpdateSubscriberInput) {
    const subscriber = await this.getSubscriber(id)

    if (input.subscriberId && input.subscriberId !== subscriber.subscriberId) {
      const existingSubscriber = await this.subscriberRepository.findByIdOrSubscriberId(input.subscriberId)

      if (existingSubscriber) {
        throw new AppError('Subscriber ID already exists', HTTP_STATUS.CONFLICT)
      }
    }

    return this.subscriberRepository.update(subscriber.id, input)
  }
}
