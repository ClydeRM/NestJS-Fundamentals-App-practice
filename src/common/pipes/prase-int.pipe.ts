import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PraseIntPipe implements PipeTransform {
  // Every custom pipe must implement PipeTransform interface
  // Every custom pipe must provide a transform method
  transform(value: string, metadata: ArgumentMetadata) {
    // value is the input value of the currently processing arguments
    // metadata is the metadata of the currently processing arguments
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed. "${val}" is not an integer`,
      );
    }
    return val;
  }
}
