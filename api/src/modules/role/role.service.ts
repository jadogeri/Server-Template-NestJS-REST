import { UserRole } from 'src/common/enums/user-role.enum';
import { Service } from '../../common/decorators/service.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './role.repository';


@Service()
export class RoleService {

  constructor(
    private readonly roleRepository: RoleRepository, 
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async findByUserRole(userRole: UserRole) {
    return this.roleRepository.findByUserRole(userRole);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
