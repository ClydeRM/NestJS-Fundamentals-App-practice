import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaSync1643533768509 implements MigrationInterface {
  name = 'SchemaSync1643533768509';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD "detail" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "detail"`);
    await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
  }
}
