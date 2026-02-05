import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Location } from "../../../common/entities/location.entity";

@Entity("profile")
export class Profile {
    @PrimaryGeneratedColumn()
    profile_id: number;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    avatar_url: string;

    @Column(() => Location) 
    location?: Location;

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
