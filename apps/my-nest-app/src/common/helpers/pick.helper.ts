export const pick = function () {

    interface map<B> {
        [key: string]: B
    }

    function process<T, W>(param: T, obj: W) {
        const newObj = { ...obj };
        let reducedValue: any = "";
        if (typeof param == 'string') {
            reducedValue = param.split('.').reduce((acc: { [key: string]: any }, curr) => {
                return acc ? acc[curr] : null;
            }, newObj)
        }
        return reducedValue;
    }

    function checkType<T, W extends { [key: string]: any }>(param: T, obj: W): string {
        let reducedValue = '';
        if (typeof param == 'string') {
            reducedValue = process(param, obj);
            return reducedValue;
        } else {
            return reducedValue;
        }
    }

    const result = function <T, W>(arr: T[], obj: W)   {
        const newObj: { [key: string]: any } = {};
        arr.forEach(n => {
            if (typeof n == 'object') {
                const value = Object.values(n)[0];
                const newValue = checkType(value, obj);
                if (newValue) newObj[Object.keys(n)[0]] = newValue;

            } else if (typeof n == 'string') {
                const newValue = checkType(n, obj);
                if (newValue) newObj[n] = newValue;
            }
        })
        return newObj;
    }
    return result;
}();


export const pickFromArray = function <T, W>(arr: T[], arrOfObj: W[]) {
    let result = [];
    result = arrOfObj.map(n=>{
        return pick(arr, n);
    })
    return result;
}
    
