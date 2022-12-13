export {}
declare global {
    function nameof<T>(nameFn: () => T): string
}

const _global = global as any;
_global.nameof = function <T>(nameFn: () => T) {
    const fnBody = nameFn.toString();
    const regex = /^\(\)\s*=>\s*(.*);{0,1}$/;
    if (regex.test(fnBody)) {
        const varName = regex.exec(fnBody)[1];
        if (varName.indexOf(".") < 0)
            return varName;
        
        return varName.substring(varName.lastIndexOf(".") + 1);
    }
    return /return (.*);/.exec(fnBody)?.[1] ?? ""
}