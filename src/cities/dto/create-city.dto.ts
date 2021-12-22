import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ type: String, description: 'name' })
  name: string;
}
