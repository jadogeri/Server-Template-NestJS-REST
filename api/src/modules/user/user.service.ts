import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { Service } from '../../common/decorators/service.decorator';
import { PermissionString } from '../../common/types/permission-string.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { PermissionStringGeneratorUtil } from '../../common/utils/permission-string.util';
import { UserPayload } from '../../common/interfaces/user-payload.interface';

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

  async getUserPayload(email: string, userId: number) {

    const user = await this.findByUserId(userId);
    if (!user) {
      console.log('User not found for email:', email);
      return null;
    }
    
    // 2. Implementation (No 'as' needed!)
    const uniquePermissions: PermissionString[] = [
      ...new Set(
        user.roles.flatMap(role => 
          role.permissions.map(p => PermissionStringGeneratorUtil.generate(p.resource, p.action))
        )
      )
    ];
    
    // 2. Implementation (No 'as' needed!)
    const uniqueRoles: UserRole[] = [
      ...new Set(
        user.roles.flatMap(role => 
          role.name)
        )  
    ];
    
    console.log(`User ${email} has roles:`, uniqueRoles);
    console.log(`User ${email} has permissions:`, uniquePermissions);
    const userPayload: UserPayload = {
      userId: user.id,
      email: email,
      roles: uniqueRoles,
      permissions: uniquePermissions,
    };
    return userPayload;      
  }     
  
}
