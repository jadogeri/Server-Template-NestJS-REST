import { Column } from "typeorm/browser/decorator/columns/Column.js";

export class User {

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;
}
    