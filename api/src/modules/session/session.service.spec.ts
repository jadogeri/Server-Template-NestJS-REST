import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository'; // Ensure this path is correct

describe('SessionService', () => {
  let service: SessionService;
  let repository: SessionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          // Provide the repository token
          provide: SessionRepository,
          // Use a mock object with the methods your service calls
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            // add other methods as needed
          },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    repository = module.get<SessionRepository>(SessionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
