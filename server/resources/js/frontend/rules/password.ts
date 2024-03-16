import {reactive} from "vue";

type PasswordValidator = {
    hasLength: number | null
    length: boolean | null
    hasCapital: boolean
    capital: boolean | null
    hasNumber: boolean
    number: boolean | null
    hasSymbol: boolean
    symbol: boolean | null
}

export const passwordValidation = reactive(<PasswordValidator>{
    hasLength: null,
    length: null,
    hasCapital: false,
    capital: null,
    hasNumber: false,
    number: null,
    hasSymbol: false,
    symbol: null,
});

export function validatePassword(withLength: number = 11, withCapital: boolean = true, withNumber: boolean = true, withSymbol: boolean = true) {

    passwordValidation.hasLength = withLength
    passwordValidation.hasCapital = withCapital
    passwordValidation.hasNumber = withNumber
    passwordValidation.hasSymbol = withSymbol

    return (val: string): boolean => {
        if (withLength)
            passwordValidation.length = val.length >= withLength;

        if (withCapital)
            passwordValidation.capital = /^(?=.*[A-Z])/.test(val);

        if (withNumber)
            passwordValidation.number = /^(?=.*[0-9])/.test(val);

        if (withSymbol)
            passwordValidation.symbol = /^(?=.*[!@#\$%\^&\*_\-=+])/.test(val);

        return (
            (!withLength || (withLength && passwordValidation.length)) &&
            (!withCapital || (withCapital && passwordValidation.capital)) &&
            (!withNumber || (withNumber && passwordValidation.number)) &&
            (!withSymbol || (withSymbol && passwordValidation.symbol))
        );
    }
}
