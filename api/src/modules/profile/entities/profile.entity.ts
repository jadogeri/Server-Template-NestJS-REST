import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Location } from "../../../common/entities/location.entity";

@Entity("profiles")
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column(() => Location) 
    location?: Location;

    @Column({ nullable: true })
    website: string;

    @Column({ nullable: true })
    socialMedia: string;

    @Column({ nullable: true })
    gender: string;

    // Use "simple-json" to store preferences as an object (e.g., { theme: 'dark' })
    @Column("simple-json", { nullable: true })
    preferences: { [key: string]: any };

    @UpdateDateColumn()
    updatedAt: Date; // Automatically updated on each save()

    // Foreign Key setup
    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: "userId" })
    user: User;
}
