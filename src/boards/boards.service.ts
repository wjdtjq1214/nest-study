import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async getBoardById(boardId: number): Promise<Board> {
    const result = await this.boardRepository.getBoardById(boardId);

    if (!result) throw new NotFoundException(``);

    return result;
  }

  async getAllBoards(user: User, allFlag: boolean): Promise<Board[]> {
    return allFlag
      ? await this.boardRepository.getAllBoards()
      : this.boardRepository.getUserBoards(user);
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    createBoardDto.status = BoardStatus.PUBLIC;

    return await this.boardRepository.createBoard(createBoardDto, user);
  }

  async deleteBoard(boardId: number, user: User): Promise<string> {
    const result = await this.boardRepository.deleteBoard(boardId, user);

    if (result.affected === 0)
      throw new NotFoundException(`Can't find Board ${boardId}`);

    return 'Success';
  }

  async updateBoardStatus(
    boardId: number,
    status: BoardStatus,
  ): Promise<string> {
    const result = await this.boardRepository.updateBoardStatus(
      boardId,
      status,
    );

    if (result.affected === 0)
      throw new NotFoundException(`Can't find Board ${boardId}`);

    return 'Success';
  }
}
