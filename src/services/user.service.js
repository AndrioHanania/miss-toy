import { storageService } from './async-storage.service'
import { utilService } from './util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USER_DB = 'user'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    getEmptyCredentials,
    isLoggedinUserAdmin,
}

_createUsers();

window.userService = userService

function getUsers() {
    return storageService.query(STORAGE_KEY_USER_DB)
}

async function getById(userId) {
    const user = await storageService.get(STORAGE_KEY_USER_DB, userId)
    return user
}

function remove(userId) {
    return storageService.remove(STORAGE_KEY_USER_DB, userId)
}

async function update(userToUpdate) {
    const user = await getById(userToUpdate._id)
    user.updatedAt = Date.now();
    const updatedUser = await storageService.put(STORAGE_KEY_USER_DB, { ...user, ...userToUpdate })
    if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
    return updatedUser
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USER_DB)
    const user = users.find(user => user.username === userCred.username && user.password === userCred.password)
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const user = await storageService.post(STORAGE_KEY_USER_DB, userCred)
    user.createdAt = user.updatedAt = Date.now()
    return saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyCredentials() {
    return {
        fullname: 'user0 fullname',
        username: 'user0',
        password: '1234',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function isLoggedinUserAdmin() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)).isAdmin
}

function _createUsers(){
    let users = utilService.loadFromStorage(STORAGE_KEY_USER_DB);
    if (!users || !users.length) {
        users = [];

        users.push({
            username: `user0`,
            password: '1234', 
            fullname: `user0 fullname`,
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            updatedAt: Date.now(),
            createdAt:  Date.now(),
            _id: utilService.makeId(),
            isAdmin: true,
        });

        for(let i = 1; i <= 9; i++) {
            users.push({
                username: `user${i}`,
                password: '1234', 
                fullname: `user${i} fullname`,
                imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
                updatedAt: Date.now(),
                createdAt:  Date.now(),
                _id: utilService.makeId(),
                isAdmin: false,
            });
        }

        utilService.saveToStorage(STORAGE_KEY_USER_DB, users);
    }
}
