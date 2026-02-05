import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Location } from "../../../common/entities/location.entity";
import { Audit } from "../../../common/entities/audit.entity";
@Entity("contacts")
export class Contact extends Audit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    fax: string;

    // This embeds Location's columns directly into the Contact table
    @Column(() => Location)
    location?: Location;

}