import { Transform } from 'class-transformer';
import { isArray, map, trim } from 'lodash';

export function Trim(): PropertyDecorator {
    return Transform((params) => {
        const value = params.value as string[] | string;

        if (isArray(value)) {
            return map(value, (v) => trim(v).replace(/\s\s+/g, ' '));
        }

        return trim(value).replace(/\s\s+/g, ' ');
    });
}

export function ToLowerCase(): PropertyDecorator {
    return Transform(
        (params) => {
            const value = params.value;

            if (!value) {
                return;
            }

            if (!Array.isArray(value)) {
                return value.toLowerCase();
            }

            return value.map((v) => v.toLowerCase());
        },
        {
            toClassOnly: true
        }
    );
}

export function ToUpperCase(): PropertyDecorator {
    return Transform(
        (params) => {
            const value = params.value;

            if (!value) {
                return;
            }

            if (!Array.isArray(value)) {
                return value.toUpperCase();
            }

            return value.map((v) => v.toUpperCase());
        },
        {
            toClassOnly: true
        }
    );
}

export function ToInt(): PropertyDecorator {
    return Transform(
        (params) => {
            const value = params.value as string;

            return Number.parseInt(value, 10);
        },
        { toClassOnly: true }
    );
}

export function ToBoolean(): PropertyDecorator {
    return Transform(
        (params) => {
            switch (params.obj[params.key]) {
                case 'true': {
                    return true;
                }

                case 'false': {
                    return false;
                }

                default: {
                    return params.value;
                }
            }
        },
        { toClassOnly: true }
    );
}
