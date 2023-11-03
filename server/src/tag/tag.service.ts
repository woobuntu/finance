import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags() {
    return this.prisma.tag.findMany({
      select: {
        name: true,
      },
    });
  }
}
