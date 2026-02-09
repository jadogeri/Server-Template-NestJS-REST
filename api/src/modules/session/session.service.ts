import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {

  private readonly MAX_SESSIONS = 5; // Max sessions per user

  constructor(
    private readonly sessionRepository: SessionRepository, 
  ) {}


  async create(createSessionDto: CreateSessionDto) {
    const { userId, refreshTokenHash } = createSessionDto;
    // 1. Count existing sessions for this user
    const [sessions, count] = await this.sessionRepository.findAllAndCountByUser(userId);

    // 2. If at limit, delete the oldest one(s)
    if (count >= this.MAX_SESSIONS) {
      const oldestSession = sessions[0];
      await this.sessionRepository.delete(oldestSession.id);
    }

    // 3. Create the new session
    const newSession = await this.sessionRepository.create({
      refreshTokenHash,
      auth: { id: userId },
      //#TODO replace commented line with the line below after testing
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      //expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    

    return newSession;
  }

  findAll() {
    return `This action returns all session`;
  }

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
