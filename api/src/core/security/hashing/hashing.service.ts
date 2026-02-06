
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Service } from '../../../common/decorators/service.decorator';

@Service()
export class HashingService {
  constructor(private readonly configService: ConfigService) {}

  // Argon2 uses memory, time, and parallelism instead of just "rounds"
  private get options(): argon2.Options & { secret: Buffer } {
    return {
      // Recommended by OWASP: 19MB memory, 2 iterations, 1 parallelism
      memoryCost: this.configService.get<number>('ARGON2_MEMORY', 19456),
      timeCost: this.configService.get<number>('ARGON2_ITERATIONS', 2),
      parallelism: this.configService.get<number>('ARGON2_PARALLELISM', 1),
      type: argon2.argon2id, // Argon2id is the recommended hybrid variant
      secret: Buffer.from(this.configService.get<string>('ARGON2_SECRET', ''))
    };
  }

  async hash(password: string): Promise<string> {
    try {
      // Argon2 automatically handles salt generation
      const hash = await argon2.hash(password, this.options);
      console.log("Generated Argon2 hash:", hash);
      return hash;
    } catch (err) {
      console.error("Argon2 hashing failed:", err);
      throw err;
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      // Pass the same options (especially the secret) to verify
      const isMatch = await argon2.verify(hash, password, this.options);
      console.log("Comparing password with hash:", { isMatch });
      return isMatch;
    } catch (err) {
      console.error("Argon2 verification failed:", err);
      return false;
    }
  }
}
