import API from './API';

const login = ({ usuario, senha }) => {
    const auth = `Basic ${window.btoa(usuario + ':' + senha)}`;
    return API.post(
        '/auth',
        { auth },
        {
            headers: {
                Authorization: auth,
            },
        },
    );
};

export const LoginService = {
    login,
};
