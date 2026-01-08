import { FastifyInstance } from 'fastify';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { MentorRepository } from '@infrastructure/repositories/MentorRepository';

export class UnitOfWork {
  public userRepository: UserRepository;
  public mentorRepository: MentorRepository;

  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepository(fastify);
    this.mentorRepository = new MentorRepository(fastify);
  }
}
