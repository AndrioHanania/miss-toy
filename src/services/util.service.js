
export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    debounce,
    animateCSS,
    getTruthyValues,
    getRandomBoolean,
}

function makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getRandomBoolean() {
    return Math.random() >= 0.5;
}


function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
    var value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}



function animateCSS(el, animation, options = {}) {
    
    const { isRemoveClass = true } = options

    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)

        function handleAnimationEnd(event) {
            event.stopPropagation()
            if (isRemoveClass) el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}


export function debounce(func, delay) {
    let timeoutId

    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}


export function getExistingProperties(obj) {
    const truthyObj = {}
    for (const key in obj) {
        const val = obj[key]
        if (val || typeof val === 'boolean') {
            truthyObj[key] = val
        }
    }
    return truthyObj
}

function getTruthyValues(obj) {
   // console.log('obj:', obj)

    return Object.keys(obj).reduce((acc, key) => {
        if (Array.isArray(obj[key])) {
            if (obj[key].length > 0) {
                // Recursively process each element in the array
                const processedArray = obj[key].map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return getTruthyValues(item)
                    }
                    return item
                }).filter(Boolean) // Remove any falsy values

                //console.log('processedArray:', processedArray)
                
                if (processedArray.length > 0) {
                    acc[key] = processedArray.join(',')
                }
            }
        }
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
            const nestedTruthy = getTruthyValues(obj[key])
            Object.assign(acc, nestedTruthy)
        } else if (obj[key] && key !== 'userId') {
            acc[key] = obj[key]
        }
        return acc
    }, {})
}
