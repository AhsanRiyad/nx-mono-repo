export class CacheManager {
    static instance() { return cache }
    protected data: Record<string, string | undefined> = {}
    static clear() {
        this.instance().data = {}
    }
    static remove(key: string) {
        delete this.instance().data[key]
    }
    static set(key: string, value: string | undefined): string | undefined {
        this.instance().data[key] = value;
        return value;
    }
    static get(key: string, fallback?: () => string | undefined): string | undefined {
        if(!fallback)
            fallback = () => undefined
        return this.instance().data[key] ?? this.set(key, fallback());
    }
}

const cache = new CacheManager();