import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review, ReviewStatus } from './review.entity';
import { ReviewVote, VoteType } from './review-vote.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { VoteReviewDto } from './dto/vote-review.dto';
import { ProfessorSubject } from '../professor-subjects/professor-subject.entity';
import { Filter } from 'bad-words';

@Injectable()
export class ReviewsService {
  private filter: Filter;

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ProfessorSubject)
    private readonly professorSubjectRepository: Repository<ProfessorSubject>,
    @InjectRepository(ReviewVote)
    private readonly reviewVoteRepository: Repository<ReviewVote>,
    private readonly dataSource: DataSource,
  ) {
    this.filter = new Filter();
    this.filter.addWords('mierda', 'puto', 'puta', 'coño', 'marico', 'marica', 'huevon', 'pendejo', 'cabron', 'estupido', 'idiota', 'maldito', 'mamaguevo');
  }

  async create(createReviewDto: CreateReviewDto, user: any): Promise<Review> {
    const { professorSubjectId, rating, text, isAnonymous } = createReviewDto;

    if (text && this.filter.isProfane(text)) {
      throw new BadRequestException('Tu reseña contiene lenguaje inapropiado y viola las normas de la comunidad');
    }

    const professorSubject = await this.professorSubjectRepository.findOne({
      where: { id: professorSubjectId },
    });

    if (!professorSubject) {
      throw new BadRequestException('La relación de profesor y materia no existe');
    }

    const review = this.reviewRepository.create({
      user: { id: user.id }, // Linking via the ID from JWT
      professorSubject,
      rating,
      text: text || null,
      isAnonymous: isAnonymous ?? false,
      netScore: 0,
      weight: 1.0,
      status: ReviewStatus.ACTIVE,
    });

    try {
      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Ya has publicado una reseña para esta materia/profesor. Si deseas cambiarla, edita la existente.');
      }
      throw error;
    }
  }

  async vote(reviewId: string, voteReviewDto: VoteReviewDto, user: any): Promise<Review> {
    const { voteType } = voteReviewDto;

    return this.dataSource.transaction(async (manager) => {
      const review = await manager.findOne(Review, {
        where: { id: reviewId },
        relations: ['user'],
      });

      if (!review) {
        throw new NotFoundException('Reseña no encontrada');
      }

      if (review.user?.id === user.id) {
        throw new BadRequestException('No puedes votar por tu propia reseña'); // Prevents self-voting, though not strictly required it's a good practice
      }

      let existingVote = await manager.findOne(ReviewVote, {
        where: { review: { id: reviewId }, user: { id: user.id } },
      });

      let scoreDiff = 0;

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // If the vote is the same, no changes needed
          return review;
        }

        // Changing vote
        scoreDiff = voteType === VoteType.UP ? 2 : -2;
        existingVote.voteType = voteType;
        await manager.save(ReviewVote, existingVote);
      } else {
        // New vote
        scoreDiff = voteType === VoteType.UP ? 1 : -1;
        const newVote = manager.create(ReviewVote, {
          review: { id: reviewId },
          user: { id: user.id },
          voteType,
        });
        await manager.save(ReviewVote, newVote);
      }

      review.netScore += scoreDiff;
      
      // Update weight based on netScore
      review.weight = review.netScore <= -5 ? 0 : 1.0;

      return await manager.save(Review, review);
    });
  }

  async getRecentReviews(limit: number = 15): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { status: ReviewStatus.ACTIVE },
      relations: ['professorSubject', 'professorSubject.professor', 'professorSubject.subject'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
