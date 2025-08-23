import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_configurations" })
export class GuildConfiguration {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    prefix: string;
}