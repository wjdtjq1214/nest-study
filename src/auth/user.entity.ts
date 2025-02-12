import { Board } from 'src/boards/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['userName'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column()
  password: string;

  @Column({
    name: 'admin_flag',
    default: false,
  })
  adminFlag: boolean;

  @OneToMany((type) => Board, (board) => board.user, { eager: true })
  boards: Board[];
}
