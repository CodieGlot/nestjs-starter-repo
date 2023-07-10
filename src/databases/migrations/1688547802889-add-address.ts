import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddress1688547802889 implements MigrationInterface {
    name = 'AddAddress1688547802889';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "address" CHARACTER VARYING DEFAULT 'none'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "address" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }
}
