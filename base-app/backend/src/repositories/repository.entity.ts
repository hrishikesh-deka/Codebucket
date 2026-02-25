import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('repositories')
export class Repository {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'public' })
    visibility: string;

    @Column({ default: 'unknown' })
    owner: string;

    @Column()
    storagePath: string;

    @CreateDateColumn()
    createdAt: Date;
}
