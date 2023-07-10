import { StringField } from '../../../../decorators';

export class UserCredentialDto {
    @StringField({ minLength: 6, maxLength: 15, example: 'user00' })
    readonly username: string;

    @StringField({ minLength: 8, maxLength: 20, example: '11111111' })
    readonly password: string;
}
