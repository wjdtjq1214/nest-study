import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  transform(value: any): BoardStatus {
    value = value.toUpperCase();

    if (Object.values(BoardStatus).indexOf(value) === -1)
      throw new BadRequestException(`${value} isn't in the status options`);

    return value;
  }
}
