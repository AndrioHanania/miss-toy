import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

export const toyService = {
    query,
    save,
    remove,
    getById,
    getDefaultFilter,
    getFilterFromSearchParams,
    getDefaultToy,
    getLabels,
}

const STORAGE_KEY = 'toys'

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered'];

let gPageSize;

_createToys()

function getLabels() {
    return labels
}

async function query(filterBy) {
    try {
        let toys = await storageService.query(STORAGE_KEY)

        if (filterBy.name) {
            const regExp = new RegExp(filterBy.name, 'i')
            toys = toys.filter(toy => regExp.test(toy.name))
        }

        if (filterBy.price) {
            if(filterBy.priceSort === 'asc')
                toys = toys.filter(toy => toy.price <= filterBy.price)
            else
            toys = toys.filter(toy => toy.price > filterBy.price)
        }

        if(filterBy.labels) {
            toys = toys.filter(toy => filterBy.labels.every(label => toy.labels.includes(label)))
        }

        switch (filterBy.statusStock) {
            case 'IN_STOCK':
                toys = toys.filter(toy => toy.inStock)
                break
            case 'NOT_IN_STOCK':
                toys = toys.filter(toy => !toy.inStock)
                break
        }

        const total = toys.length;

        if(filterBy.pagination) {
            const skip = (filterBy.pagination.page - 1) * filterBy.pagination.pageSize;
            toys = toys.slice(skip, skip + filterBy.pagination.pageSize)
            gPageSize = filterBy.pagination.pageSize
        }
        else gPageSize = 5

        return includeDataFromServer({ toys, total, pageSize: gPageSize })
    } 
    catch (error) {
        console.log('error:', error)
        throw error
    }
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    if (!userService.isLoggedinUserAdmin()) return Promise.reject('Loggedin User is not admin')

    return storageService.remove(STORAGE_KEY, id)
        .then(() => includeDataFromServer(gPageSize))
        .catch(err => {
            console.error('Cannot remove toy:', err)
            throw err
        })
}

function save(toyToSave) {
    if (!userService.isLoggedinUserAdmin()) return Promise.reject('Loggedin User is not admin')

    toyToSave.updatedAt = Date.now();

    if (toyToSave._id) {
        return storageService.put(STORAGE_KEY, toyToSave).then((savedToy) => includeDataFromServer({ savedToy, gPageSize }))
    } else {
        toyToSave.updatedAt = toyToSave.updatedAt;
        return storageService.post(STORAGE_KEY, toyToSave).then((savedToy) => includeDataFromServer({ savedToy, gPageSize }))
    }
}

//if fields are empty or status is all then ignore
function getDefaultFilter() {
    return {
        name: '',
        price: 0,
        priceSort: 'asc',
        labels: [],
        statusStock: 'all',
        pagination: { page: 1, pageSize: 5 },
    }
}

function getDefaultToy() {
    return {
        name: '',
        price: 0,
        labels: [],
        inStock: false,
        imageUrl: '',
    }
}

//use with utilService.getTruthyValues
function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || defaultFilter[field]; 
    }
    return filterBy
}

function includeDataFromServer(data = {}) {
    return Promise.all([getMaxPage(data.total, data.pageSize)])
        .then(([pages]) => {
            return {  ...data, pages }
        })
}

function getMaxPage(total, pageSize) {
    if (total) return Promise.resolve(Math.ceil(total / pageSize))
    return storageService.query(STORAGE_KEY)
        .then(toys => Math.ceil(toys.length / pageSize))
        .catch(err => {
            console.error('Cannot get pages:', err)
            throw err
        })
}

function _createToys() {
    let toys = utilService.loadFromStorage(STORAGE_KEY)
    if (!toys || !toys.length) {
        toys = [];

        for(let i = 1; i <= 10; i++) {
            toys.push({
                _id: utilService.makeId(),
                name: `Toy ${i}`,
                price: 100 + i * 10,
                labels: labels.slice(0, i),
                inStock: utilService.getRandomBoolean(),
                imageUrl: `https://www.obdesigns.com.au/cdn/shop/files/SP_HoneyBear_1_800x.jpg?v=1684487044`,
                updatedAt: Date.now(),
                createdAt:  Date.now(),
            })
        }

        utilService.saveToStorage(STORAGE_KEY, toys)
    }
}




