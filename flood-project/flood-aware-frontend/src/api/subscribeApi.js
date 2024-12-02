import httpClient from "./httpClient";

export const subscribeUser = async (subscriberData) => {
    const response = await httpClient.post('/subscribe', subscriberData);
    return response.data;
}

export const unSubscribeUser = async (email) => {
    const response = await httpClient.delete('/unsubscribe', {
        data: {email} 
        });
    return response.data;
}


export const checkSubscription = async (email) => {

    const response = await httpClient.post('/check-subscription/check', {email})
    console.log(response, "check subscription")
    return response.data;
}