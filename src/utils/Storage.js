const Storage = {
    getStorage:(key)=>{
        let data = JSON.parse(window.localStorage.getItem(key));
        return data;

    },
    setStorage:(key,val)=>{
        window.localStorage.setItem(key,JSON.stringify(val));
    },
    clearStorage:(key)=>{
        window.localStorage.removeItem(key);
    }
}

export default Storage;