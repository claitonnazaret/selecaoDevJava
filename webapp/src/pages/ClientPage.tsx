import React, { useEffect, useState } from 'react';
import {
    Backdrop,
    CircularProgress,
    Container,
    createStyles,
    CssBaseline,
    Grid,
    Paper,
    Theme,
    MenuItem,
    Button,
    Typography,
    Snackbar,
} from '@material-ui/core';
import { DatePicker, Radios, Select } from 'mui-rff';
import { Field, Form } from 'react-final-form';
import { useHistory, useParams } from 'react-router';
import { ClienteService } from '../services/ClienteService';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { TextField } from 'final-form-material-ui';
import MaskedInput from 'react-text-mask';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        container: {
            height: '100%',
        },
        paper: {
            padding: '10px',
        },
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
        fab: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        backdrop: {
            zIndex: theme.zIndex.snackbar + 1,
            color: '#fff',
        },
    }),
);

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
            placeholderChar={'\u2000'}
            guide
            keepCharPositions
        />
    );
};

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const ClientPage = () => {
    const auth = localStorage.getItem('auth');
    const { id } = useParams();
    const history = useHistory();
    const classes = useStyles();
    const [alerta, setAlerta] = useState<{
        msg: string;
        open: boolean;
        type: 'success' | 'info' | 'warning' | 'error';
    }>({ msg: '', open: false, type: 'error' });

    const validEmailRegex = RegExp(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    );

    const nacionalidade = [
        { label: 'Brasileiro', value: 'BRASILEIRO' },
        { label: 'Estrangeiro', value: 'ESTRANGEIRO' },
    ];

    const sexo = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' },
    ];

    const [cliente, setCliente] = useState({
        nome: '',
        dtNascimento: '',
        cpf: '',
        sexo: 'MASCULINO',
        nacionalidade: 'BRASILEIRO',
    });

    const [loading, showLoading] = useState(false);

    const pesquisa = () => {
        if (auth && id !== 'undefined') {
            showLoading(true);
            ClienteService.findOne(`/findOne/${id}`, auth)
                .then((result) => result.data)
                .then((data) => {
                    setCliente((state) => ({ ...state, ...data }));
                })
                .catch((error) => console.log(error))
                .finally(() => showLoading(false));
        }
    };

    useEffect(pesquisa, []);

    const validate = (values) => {
        const errors = {};
        if (!values['nome']) {
            errors['nome'] = 'Obrigatório';
        }
        if (!values['dtNascimento']) {
            errors['dtNascimento'] = 'Obrigatório';
        }
        if (!values['cpf']) {
            errors['cpf'] = 'Obrigatório';
        }
        if (values.email) {
            if (!validEmailRegex.test(values.email)) {
                errors['email'] = 'E-mail inválido';
            }
        }
        return errors;
    };

    const onSubmit = async (values) => {
        if (auth) {
            showLoading(true);
            ClienteService.save('/save', auth, values)
                .then(({ data }) => {
                    setAlerta({
                        msg: `Cliente ${id != 'undefined' ? 'atualizado' : 'salvo'} com sucesso`,
                        open: true,
                        type: 'success',
                    });
                    setCliente((state) => ({ ...state, ...data }));
                    showLoading(false);
                    setTimeout(() => history.goBack(), 3500);
                })
                .catch((error) => {
                    if (error.response.status)
                        setAlerta({
                            msg: `Erro ao ${id != 'undefined' ? 'atualizar' : 'salvar'} o cliente`,
                            open: true,
                            type: 'error',
                        });
                    showLoading(false);
                })
                .finally(() => showLoading(false));
        } else return history.push('/');
    };

    const handleClose = () => {
        setAlerta({ msg: '', open: false, type: 'error' });
    };

    return (
        <Container fixed className={classes.container}>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
            <Snackbar open={alerta.open} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity={alerta.type}>{alerta.msg}</Alert>
            </Snackbar>
            <Typography variant="h4" component="h5">
                {id !== 'undefined' ? `Edição do Cliente` : 'Cadastro de Cliente'}
                <br /> <small>{id !== 'undefined' ? cliente.nome : ''}</small>
            </Typography>
            <Form
                key="form"
                onSubmit={(values, form) => {
                    onSubmit(values);
                    setTimeout(() => {
                        form.reset();
                    }, 1000);
                }}
                initialValues={cliente}
                destroyOnUnregister={true}
                validate={validate}
                render={({ handleSubmit, submitting, values }) => (
                    <form onSubmit={handleSubmit} noValidate>
                        <Paper variant="outlined" square className={classes.paper}>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Field
                                        fullWidth
                                        required
                                        name="nome"
                                        component={TextField}
                                        type="text"
                                        label="Nome"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={4} md={4} lg={4}>
                                    <Field
                                        fullWidth
                                        required
                                        name="cpf"
                                        component={TextField}
                                        type="text"
                                        label="CPF"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    <DatePicker
                                        label="Data de Nascimento"
                                        name="dtNascimento"
                                        required
                                        dateFunsUtils={DateFnsUtils}
                                        fullWidth
                                        format="dd/MM/yyyy"
                                        lang="ptBR"
                                    />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    <Radios name="sexo" label="Sexo" data={sexo} />
                                </Grid>
                            </Grid>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Field
                                        fullWidth
                                        required
                                        name="email"
                                        component={TextField}
                                        type="email"
                                        label="E-mail"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container alignItems="flex-start" spacing={2}>
                                <Grid item xs={8} md={8} lg={8}>
                                    <Field
                                        fullWidth
                                        name="naturalidade"
                                        component={TextField}
                                        type="text"
                                        label="Naturalidade"
                                    />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                    <Select
                                        fullWidth
                                        name="nacionalidade"
                                        label="Nacionalidade"
                                        formControlProps={{ fullWidth: true }}
                                    >
                                        {nacionalidade.map((n, i) => (
                                            <MenuItem key={i} value={n.value}>
                                                {n.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
                                <Grid item xs={2} md={2} lg={1}>
                                    <Button color="primary" variant="outlined" onClick={() => history.goBack()}>
                                        Voltar
                                    </Button>
                                </Grid>
                                <Grid item xs={2} md={2} lg={1}>
                                    <Button color="primary" variant="contained" type="submit" disabled={submitting}>
                                        Salvar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                )}
            />
        </Container>
    );
};

export default ClientPage;
