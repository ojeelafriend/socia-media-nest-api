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

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { unique: true })
  username: string;

  @Column('text')
  password: string;

  @Column('text', { default: 'Welcome to SM :)' })
  bio: string;

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
