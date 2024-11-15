import {useApi, useHttp} from "@/requests.js";
import {AuthData} from "@/models/auth/AuthData.js";
import {UserModel} from "@/models/auth/UserModel.js";
import {ref} from "vue";
import {resolveRoute} from "@/backend-router.js";


let _authData
let _authUser
const _permissions = ref({})
const _permissionsDefault = {guest: true}
const isLoading = ref(false)


export function permissions() {
    if (!isLoading.value && !Object.keys(_permissions).length) {
        _permissions.value = _permissionsDefault
    }
    return _permissions
}

export function updatePermissions(data) {
    _permissions.value = Object.assign(_permissions.value, data)
}

export function resetPermissions(data = {}) {
    _permissions.value = data
}


export {
    isLoading
}


export function authData() {
    if (!_authData) {
        _authData = new AuthData()
    }
    return _authData
}

export function user() {
    if (!_authUser) {
        _authUser = new UserModel()
    }
    return _authUser
}

export async function login(loginData, onSuccess, onError) {
    return useHttp()(resolveRoute('auth.login'),  loginData)
        .then((response) => {
            if (response['data'] && response['data']['token']) {
                return response['data']
            }

            Promise.reject('Unexpected response')
        })
        .then((responseData) => {
            authData()
                .maxAge(loginData['stayAuth'] ? 7 * 86400 : null)
                .set('token', responseData.token)

            resetPermissions(responseData.data ?? {})

            if (onSuccess) {
                onSuccess(responseData)
            }

            return responseData

        })
        .catch((error) => {
            authData().delete()
            resetPermissions()

            if (onError) {
                onError(error)
            }

            return error
        })
}

export function logout(onSuccess = null, onError = null, onFinally = null) {
    return useApi()(resolveRoute('api.auth.logout'))
        .then((response) => {
            if (response['data'] && response['data']['state'] === 'ok') {
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
            console.log('Already logged out', error)
        })
        .finally(() => {
            authData().delete()
            resetPermissions()
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
    }/**/

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
    }/**/

    return false
}

export async function refresh(set = null) {
    if (!isLoading.value && set === null) {
        isLoading.value = true
        return useApi()(resolveRoute('api.auth.permissions'))
            .then((response) => {
                resetPermissions(response.data.data)
                return response
            })
            .catch((error) => {
                resetPermissions()
                return error
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    if (set) {
        resetPermissions(set)
    }

    return this
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


    let resolvers = [];
    for (let i in auth) {
        resolvers.push(auth[i].call());
    }

    return await Promise.all(resolvers)
        .then(() => true)
        .catch(() => false)
}


export default {
    authData,
    permissions,
    login,
    logout,
    refresh,
    isAuth,
    can,
    has,
    canAccess,
    updatePermissions,
    resetPermissions,
}
