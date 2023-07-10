import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities';
import { UserCredentialDto } from '../auth/dto/request';
import { generateHash } from '../../common/utils';
import { PageDto, PageMetaDto, PageQueryDto } from '../../common/dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser(dto: UserCredentialDto) {
        const user = await this.findUserByIdOrUsername({ username: dto.username });

        if (user) {
            throw new ConflictException('USER ALREADY EXISTS');
        }

        const newUser = this.userRepository.create({
            username: dto.username,
            password: await generateHash(dto.password)
        });

        return this.userRepository.save(newUser);
    }

    async findUserByIdOrUsername({ id, username }: { id?: string; username?: string }) {
        return id
            ? this.userRepository.findOne({ where: { id } })
            : this.userRepository.findOne({ where: { username } });
    }

    async getUsers(pageQueryDto: PageQueryDto) {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        queryBuilder.skip(pageQueryDto.skip).take(pageQueryDto.take);

        const [entities, itemCount] = await queryBuilder.getManyAndCount();

        const pageMetaDto = new PageMetaDto({ pageQueryDto, itemCount });

        return new PageDto(entities, pageMetaDto);
    }
}
