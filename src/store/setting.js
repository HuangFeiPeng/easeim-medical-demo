const setting = {
    state: {
        customPrice:'88.00'
    },
    mutations: {
        setCustomPrice:(state,payload)=>{
            console.log(payload);
            const {price} = payload;
            state.customPrice = price;
        }
    },
    actions: {
        
    },
    getters: {
        
    }
}

export default setting