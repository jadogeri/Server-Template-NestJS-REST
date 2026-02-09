import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { Service } from '../../common/decorators/service.decorator';

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, 
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({where: { id }});
  }


 
  async findByUserId(id: number) {
    // Uses the custom method in your UserRepository that includes relations
    return await this.userRepository.findByUserId(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Uses the preload/save logic from your BaseRepository
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
