import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { PayableService } from '../payable/payable.service';
import { CreatePayableDto } from 'src/payable/dto/create-payable.dto';
import { DeadProducerService } from './dead.producer.service';

@Injectable()
export class ConsumerService {
  private channelWrapper: ChannelWrapper;
  private maxRetries = 3;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private payableService: PayableService,
    private deadProducerService: DeadProducerService,
  ) {
    const connection = amqp.connect(['amqp://rabbitmq:rabbitmq@rabbitmq:5672']);
    this.channelWrapper = connection.createChannel();
  }

  async consumePayableQueue(payables: CreatePayableDto[]) {
    this.logger.log('Consuming Payable Queue');
    for (const payable of payables) {
      const payableString = JSON.stringify(payable);
      let retries = 0;
      let success = false;
      Logger.log(`Trying new Payable -> ${payableString}`);
      while (!success && retries < this.maxRetries) {
        try {
          await this.payableService.create(payable);
          Logger.log(`Insert payable -> ${payableString}`);
          await this.payableService.create(payable);
          success = true;
        } catch (error) {
          Logger.error(`Error creating payable -> ${payableString}`);
          retries++;
        }
      }
      if (!success) {
        Logger.error(
          `Failed to create payable, adding in dead queue -> ${payableString}`,
        );
        await this.deadProducerService.addToDeadQueue(payable);
      }
    }
  }
}
