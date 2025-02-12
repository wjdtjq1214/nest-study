import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardController');
  constructor(private boardsSeervice: BoardsService) {}

  @Get('/:boardId')
  getBoardById(@Param('boardId') boardId: number): Promise<Board> {
    return this.boardsSeervice.getBoardById(boardId);
  }

  @Get()
  getAllBoard(
    @GetUser() user: User,
    @Query('all') allFlag = true,
  ): Promise<Board[]> {
    this.logger.verbose(`User ${user.userName} trying to get all boards`);
    return this.boardsSeervice.getAllBoards(user, allFlag);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsSeervice.createBoard(createBoardDto, user);
  }

  @Delete('/:boardId')
  deleteBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
  ) {
    return this.boardsSeervice.deleteBoard(boardId, user);
  }

  @Patch('/:boardId/status')
  updateBoardStatus(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsSeervice.updateBoardStatus(boardId, status);
  }
}
