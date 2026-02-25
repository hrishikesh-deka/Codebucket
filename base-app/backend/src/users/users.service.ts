import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async loginOrRegister(email: string): Promise<User> {
        let user = await this.usersRepository.findOneBy({ email });

        if (!user) {
            user = this.usersRepository.create({ email, lastLoginAt: new Date() });
        } else {
            user.lastLoginAt = new Date();
        }

        return this.usersRepository.save(user);
    }
}
