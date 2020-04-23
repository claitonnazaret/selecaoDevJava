import API from './API';

const listAll = (url: string, auth: string, page?: string, params?: string[]) => {
    return API.get(`/cliente${url}`, {
        headers: {
            Authorization: auth,
        },
    });
};

const findOne = (url: string, auth: string) => {
    return API.get(`/cliente${url}`, {
        headers: {
            Authorization: auth,
        },
    });
};

const save = (url: string, auth: string, data: any) => {
    return API.post(`/cliente${url}`, data, {
        headers: {
            Authorization: auth,
        },
    });
};

const deleteOne = (url: string, auth: string) => {
    return API.delete(`/cliente${url}`, {
        headers: {
            Authorization: auth,
        },
    });
};

export const ClienteService = {
    listAll,
    findOne,
    save,
    deleteOne,
};
