import {useApi, useHttp} from "@/requests.js";
import {AuthModel} from "@app/models/auth/AuthModel.js";
import {UserModel} from "@app/models/auth/UserModel.js";
import {reactive, ref} from "vue";
import {resolveRoute} from "@/backend-router.js";


const _authData = new AuthModel()
const _authUser = new UserModel()
const _permissions = reactive({})
const _permissionsDefault = {isAuth: false, user: undefined, permissions: {rights: [], roles: [], routes: []}}
const isLoading = ref(false)


function updatePermissions(data) {
    Object.assign(_permissions, _permissionsDefault, data)
}


export {
    isLoading
}


export function session() {
}

export function authData() {
    return _authData
}

export function user() {
    return _authUser
}

export async function login(loginData, onSuccess, onError) {
    return useHttp()(resolveRoute('auth.login'), {method: "POST", data: loginData})
        .then((response) => {
            return response.data
        })
        .then((responseData) => {
            authData()
                .maxAge(loginData['stayAuth'] ? 7 * 86400 : null)
                .set('token', responseData.token)

            updatePermissions(responseData.data)

            if (onSuccess) {
                onSuccess(responseData)
            }

            return responseData
        })
        .catch((error) => {
            authData().remove()
            updatePermissions({isAuth: false})

            if(onError){
                onError(error)
            }

            return error
        })
}

export function logout(onSuccess = null, onError = null, onFinally = null) {
    return useApi()(resolveRoute('api.auth.logout'))
        .then((response) => {
            if (response['data'] && response['data']['state'] === 'ok') {
                refresh(response.data)

                if (onSuccess) {
                    onSuccess(response)
                }
                return response;
            }
            return Promise.reject('Unexpected logout response. Can not determine if logged out.')
        })
        .catch((error) => {
            if (error['response'] && error['response']['status'] !== 401) {
                console.warn('Logout error', error)
                if (onError) {
                    onError(error)
                }
                return error
            }
            console.log('Already logged out')
        })
        .finally(() => {
            authData().remove()
            updatePermissions({isAuth: false})
            if (onFinally) {
                onFinally()
            }
        })
}


export function can(rights) {
    if (permissions()['permissions'] && permissions()['permissions']['rights']) {
        if (!(rights instanceof Array)) {
            rights = [rights]
        }

        for (let idx in rights) {
            const right = rights[idx]
            if (right in permissions()['permissions']['rights']) {
                return true
            }
        }
    }

    return false
}

export function has(roles) {
    if (permissions()['permissions'] && permissions()['permissions']['roles']) {
        if (!(roles instanceof Array)) {
            roles = [roles]
        }

        for (let idx in roles) {
            const role = roles[idx]
            if (role in permissions()['permissions']['roles']) {
                return true
            }
        }
    }

    return false
}

export async function refresh(set = null) {
    if (!isLoading.value && set === null) {
        isLoading.value = true
        return useApi()('permissions')
            .then((response) => {
                //console.log('================ CREATE PERMISSIONS ================', response.data.data)
                updatePermissions(response.data.data)
                return response
            })
            .catch((error) => {
                //console.log('================ CREATE PERMISSIONS ================', error)
                updatePermissions({isAuth: false})
                return error
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    if (set) {
        //console.log('================ CREATE PERMISSIONS ================', set)
        updatePermissions(set)
    }

    return this
}


export function permissions() {
    if (!isLoading.value && !('user' in _permissions)) {
        Object.assign(_permissions, _permissionsDefault)
        refresh()
    }
    return _permissions
}

export function isAuth() {
    return !!(permissions()['isAuth'] ?? false)
}


export async function canAccess(auth) {
    if (!auth || (auth instanceof Array && !auth.length)) {
        return true
    }
    console.debug("AUTH: Route is protected by", auth);

    if (!(auth instanceof Array)) {
        auth = [auth]
    }

    /**/
    let resolvers = [];
    for (let i in auth) {
        resolvers.push(auth[i].call());
    }

    return await Promise.all(resolvers)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        })
}

