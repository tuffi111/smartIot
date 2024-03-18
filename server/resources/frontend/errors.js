import {reactive} from "vue";

export class Errors {
    _errors = reactive({})

    constructor(fields = null) {

        //if (fields) this.fields(fields)


        //this.reset()
    }

    fields(model = null) {
        if (model === null) {
            return this._fields;
        }

        this._fields = model.emptyModel()
        return this
    }

    reset() {
        return Object.assign(this._errors, this._fields)
    }

    has(key) {
        return !!((key in this._errors) && (this._errors[key] ?? []).length)
    }

    get(key = null, defaultValue = []) {
        if (key) {
            if (defaultValue instanceof Function) {
                defaultValue = defaultValue()
            }
            return this._errors[key] ?? defaultValue
        }
        return this._errors
    }

    for(key = null, join = "\n") {
        return this.get(key).join(join)
    }

    set(errorsOrKey, value = undefined) {
        if (value === undefined) {
            this.reset()
            return Object.assign(this._errors, errorsOrKey)
        }

        this._errors[errorsOrKey] = value
        return this._errors
    }

}
