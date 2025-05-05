import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('text')
  bio: string;

  @Column('varchar')
  username: string;

  @Column('text')
  photo: string;

  @OneToMany(() => User, ({ userId }) => userId)
  @JoinColumn()
  followers: User[];

  @OneToMany(() => User, ({ userId }) => userId)
  @JoinColumn()
  following: User[];

  @CreateDateColumn()
  createdAt: Date;
}
