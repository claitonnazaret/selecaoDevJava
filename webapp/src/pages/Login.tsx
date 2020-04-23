import React, { useState } from 'react';
import { Button, Container, CssBaseline, Grid, Paper, Snackbar, Typography, useTheme } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Face, Fingerprint } from '@material-ui/icons';
import { Field, Form } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { LoginService } from '../services/LoginService';
import { Redirect, useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        gridList: {
            width: 500,
            height: 450,
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        titleBar: {
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
        icon: {
            color: 'white',
        },
        margin: {
            margin: theme.spacing(1) * 2,
            textAlign: 'center',
        },
        container: {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    }),
);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = () => {
    const history = useHistory();
    const classes = useStyles(useTheme());
    const [usuario, setUsuario] = useState({ usuario: '', senha: '' });
    const [data, setData] = useState({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 20,
        },
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 20,
        number: 0,
        first: true,
        numberOfElements: 0,
    });
    const [erro, setErro] = useState({ msg: '', open: false });

    const onSubmit = async (values) => {
        LoginService.login(values)
            .then(({ data }) => {
                localStorage.setItem('auth', data.auth);
                return history.push('/cliente');
            })
            .catch((error) => {
                if (error.response.status) setErro({ msg: 'Usuário / Senha incorretos.', open: true });
                return history.push('/');
            });
    };

    const validate = (values) => {
        const errors = {};
        if (!values['usuario']) {
            errors['usuario'] = 'Obrigatório';
        }
        if (!values['senha']) {
            errors['senha'] = 'Obrigatório';
        }
        return errors;
    };

    const handleClose = () => {
        setErro({ msg: '', open: false });
        setUsuario({ usuario: '', senha: '' });
    };

    return (
        <Container maxWidth="sm" className={classes.container}>
            <CssBaseline />
            <Form
                key="form"
                onSubmit={(values, form) => {
                    onSubmit(values);
                    setTimeout(() => {
                        form.reset();
                    }, 1000);
                }}
                initialValues={usuario}
                destroyOnUnregister={true}
                validate={validate}
                render={({ handleSubmit, submitting }) => (
                    <form onSubmit={handleSubmit} noValidate>
                        <Snackbar open={erro.open} autoHideDuration={5000} onClose={handleClose}>
                            <Alert severity="error">{erro.msg}</Alert>
                        </Snackbar>
                        <Paper variant="outlined">
                            <div className={classes.margin}>
                                <Typography variant="h4">Login</Typography>
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <Face />
                                    </Grid>
                                    <Grid item>
                                        <Field
                                            fullWidth
                                            required
                                            name="usuario"
                                            component={TextField}
                                            type="text"
                                            label="Usuário"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <Fingerprint />
                                    </Grid>
                                    <Grid item>
                                        <Field
                                            fullWidth
                                            required
                                            name="senha"
                                            component={TextField}
                                            type="password"
                                            label="Senha"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justify="flex-end" style={{ marginTop: '10px' }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        style={{ textTransform: 'none' }}
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        Login
                                    </Button>
                                </Grid>
                            </div>
                        </Paper>
                    </form>
                )}
            />
        </Container>
    );
};

export default Login;
