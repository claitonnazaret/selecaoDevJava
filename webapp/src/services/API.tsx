import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 10000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
            'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Credentials': true,
        credentials: 'same-origin',
        // Connection: 'keep-alive'
    },
});
