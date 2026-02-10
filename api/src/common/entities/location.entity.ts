import { Column, BaseEntity } from 'typeorm';


export abstract class Location extends BaseEntity{
    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zipcode: string;
}
