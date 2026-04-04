import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Table `category` (legacy name preserved for existing deployments).
 * Uniqueness is enforced in DB by unique index on LOWER(TRIM(name)); application
 * should still trim and case-check in the service for clear API errors.
 */
@Entity({ name: "category" })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Stored trimmed; 2–50 chars (see migration CHECK + app validation). */
  @Column({ type: "varchar", length: 50 })
  name!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
