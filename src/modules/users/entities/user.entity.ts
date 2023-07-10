import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../constants';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty()
    @Column()
    username: string;

    @ApiProperty({ type: 'enum', enum: UserRole })
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Exclude()
    @Column()
    password: string;
}
