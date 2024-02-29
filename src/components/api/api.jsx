import axios from "axios"


export const servicesApi = axios.create({
    baseURL: "https://socialmediapproject.000webhostapp.com/",
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
   
    },
});

export default servicesApi;