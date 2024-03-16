function getErrorMessage(error, defaultMessage, val = null, compareValues = null) {
    if (error) {
        return error
    }

    if (defaultMessage instanceof Function) {
        return defaultMessage(val, compareValues)
    }

    return defaultMessage
}


export function required(error = null) {
    return (val) => {
        return minLength(0, getErrorMessage(error, 'Required', val))(val)
    }

}

export function minLength(len = 3, error = null) {
    return (val) => {
        return val && val.length > len || getErrorMessage(error, 'Text is to short', val)
    }

}

export function maxLength(len = 255, error = null) {
    return (val) => {
        return val && val.length <= len || getErrorMessage(error, 'Text is to long.', val)
    }

}

export function minMaxLength(min = 3, max = 255, error = null) {
    return (val) => {
        return val && val.length >= min && val.length <= max || getErrorMessage(error, `Text length should be between ${min} and ${max}.`, val)
    }
}

export function email(error = null) {
    return (val) => {
        return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(val) || getErrorMessage(error, 'Not a valid eMail.', val)
    }
}

export function contains(compareValues = undefined, error = null) {

    if (!(compareValues instanceof Array)) {
        compareValues = [compareValues]
    }


    return (val) => {
        if (compareValues === undefined) {
            return true
        }

        if (val instanceof Object) {
            val = [...val]
        }

        if ((val instanceof Array)) {
            for (const idx in compareValues) {
                const compareTo = compareValues[idx]
                if (val.includes(compareTo)) {
                    return true
                }
            }
        }

        return getErrorMessage(
            error,
            `The value "${val}" is not within expected values "${compareValues.join(', ')}".`,
            val,
            compareValues
        )
    }

}

export function equals(compareValues = undefined, error = null) {

    if (!(compareValues instanceof Array)) {
        compareValues = [compareValues]
    }

    return (val) => {
        if (compareValues === undefined) {
            return true
        }

        for (const idx in compareValues) {
            const compareTo = compareValues[idx]
            if (val === compareTo) {
                return true
            }
        }

        return getErrorMessage(
            error
            , `The value "${val}" does not match the expected value "${compareValues.join(', ')}".`
            , val
            , compareValues
        )
    }
}
