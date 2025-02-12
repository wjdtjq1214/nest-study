import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Board } from './board.entity';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async getBoardById(boardId: number): Promise<Board | null> {
    return await this.findOne({ where: { id: boardId } });
  }

  async createBoard(board: CreateBoardDto, user: User): Promise<Board> {
    const result = this.create({ ...board, user: user });

    return await this.save(result);
  }

  async getAllBoards(): Promise<Board[]> {
    return await this.find();
  }

  async updateBoardStatus(
    boardId: number,
    status: BoardStatus,
  ): Promise<UpdateResult> {
    return await this.update(boardId, { status: status });
  }

  async deleteBoard(boardId: number, user: User): Promise<DeleteResult> {
    return user.adminFlag === true
      ? await this.delete(boardId)
      : await this.delete({ id: boardId, user: user });
  }

  async getUserBoards(user: User): Promise<Board[]> {
    return await this.find({
      where: {
        user: user,
      },
    });
  }
}
