import React, { useEffect, useState } from 'react';
import {
    Backdrop,
    Button,
    CircularProgress,
    Container,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Theme,
    Tooltip,
    Typography,
    Zoom,
} from '@material-ui/core';
import { useHistory } from 'react-router';
import { ClienteService } from '../services/ClienteService';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';

export type DataType = {
    content: [];
    pageable: {
        pageSize: number;
        pageNumber: number;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
};

export interface ColumnInterface {
    id: string;
    label: string;
    minWidth?: number | string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    format?: (value: Date) => string;
    actions?: any[];
}

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        container: {
            height: '100%',
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

export const columns: ColumnInterface[] = [
    { id: 'id', label: 'Cód.', minWidth: 25, align: 'center' },
    { id: 'nome', label: 'Nome', minWidth: 200 },
    { id: 'sexo', label: 'Gênero', minWidth: 80 },
    {
        id: 'dtNascimento',
        label: 'Dt.Nascimento',
        align: 'center',
        minWidth: 120,
        format: (value: Date) => new Intl.DateTimeFormat('pt-BR').format(new Date(value)),
    },
    { id: 'email', label: 'E-mail', minWidth: 160 },
    { id: 'actions', label: 'Ações', minWidth: 10, align: 'center' },
];

const ClientList = () => {
    const auth = localStorage.getItem('auth');
    const classes = useStyles();
    const history = useHistory();
    const [loading, showLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dialog, showDialog] = useState({});
    const [alerta, setAlerta] = useState<{
        msg: string;
        open: boolean;
        type: 'success' | 'info' | 'warning' | 'error';
    }>({ msg: '', open: false, type: 'error' });
    const [dados, setDados] = useState<DataType>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 10,
        },
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 10,
        number: 0,
        first: true,
        numberOfElements: 0,
    });

    const pesquisar = (page = 0) => {
        showLoading(true);
        if (auth) {
            ClienteService.listAll('/findAll', auth, `page=${page}&size=${10}`)
                .then((result) => result.data)
                .then((data) => {
                    setDados((state) => ({ ...state, ...data }));
                    dados.content.map((d) => {
                        showDialog({ [String(d['id'])]: false });
                    });
                })
                .catch((error) => console.log(error))
                .finally(() => showLoading(false));
        } else history.push('/');
    };

    useEffect(() => {
        pesquisar();
    }, []);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        showLoading(true);
        ClienteService.listAll('/', `page=${0}&size=${Number(event.target.value)}`)
            .then((result) => result.data)
            .then((data) => {
                setDados((state) => ({ ...state, ...data }));
            })
            .catch((error) => console.log(error))
            .finally(() => showLoading(false));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        pesquisar(newPage);
    };

    const logout = () => {
        localStorage.removeItem('auth');
        history.push('/');
    };

    const excluir = (id) => {
        if (auth) {
            ClienteService.deleteOne(`/delete/${id}`, auth)
                .then((result) => result.data)
                .then((data) => {
                    pesquisar();
                    showDialog(false);
                })
                .catch((error) => console.log(error))
                .finally(() => showLoading(false));
        }
    };

    const dialogExluir = ({ id, nome }) => {
        return (
            <Dialog fullScreen={false} open={dialog[id]} maxWidth="sm" onClose={() => showDialog({ [id]: false })}>
                <DialogTitle>{'Confirmação'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`Deseja excluir o cliente ${nome}?`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => showDialog({ [id]: false })} color="primary" variant="outlined">
                        Cancelar
                    </Button>
                    <Button onClick={() => excluir(id)} color="secondary" autoFocus>
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const buttons = (cliente) => {
        return (
            <TableCell align="center">
                {dialogExluir(cliente)}
                <Tooltip title={`Editar ${cliente['nome']}`} placement="top" arrow TransitionComponent={Zoom}>
                    <IconButton
                        aria-label="editar"
                        size="small"
                        onClick={() => history.push(`/cliente/${cliente['id']}`)}
                    >
                        <CreateIcon fontSize="inherit" color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={`Excluir ${cliente['nome']}`} placement="top" arrow TransitionComponent={Zoom}>
                    <IconButton aria-label="delete" size="small" onClick={() => showDialog({ [cliente['id']]: true })}>
                        <DeleteIcon fontSize="inherit" color="error" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        );
    };

    const handleClose = () => {
        setAlerta({ msg: '', open: false, type: 'error' });
    };

    return (
        <Container fixed>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Snackbar open={alerta.open} autoHideDuration={5000} onClose={handleClose}>
                        <Alert severity={alerta.type}>{alerta.msg}</Alert>
                    </Snackbar>
                    <Typography variant="h5" component="h6">
                        Lista de Clientes
                        <IconButton aria-label="delete" size="small" onClick={() => logout()}>
                            <ExitToAppIcon color="inherit" />
                        </IconButton>
                    </Typography>
                    <Table stickyHeader aria-label="sticky table" size="small">
                        <TableHead>
                            <TableRow>
                                <>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <>
                                {dados.content.length ? (
                                    <>
                                        {dados.content.map((row, index) => {
                                            return (
                                                <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                                                    <>
                                                        {columns.map((column, index) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <>
                                                                    {column.id === 'actions' ? (
                                                                        <>{buttons(row)}</>
                                                                    ) : (
                                                                        <>
                                                                            <TableCell key={index} align={column.align}>
                                                                                {column.format &&
                                                                                typeof (
                                                                                    value === 'number' ||
                                                                                    value === 'Date'
                                                                                )
                                                                                    ? column.format(value)
                                                                                    : value}
                                                                            </TableCell>
                                                                        </>
                                                                    )}
                                                                </>
                                                            );
                                                        })}
                                                    </>
                                                </TableRow>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <TableRow hover role="checkbox" tabIndex={-1}>
                                        <TableCell key={0} align="center" colSpan={columns.length}>
                                            {'Não há dados a serem listados'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    hidden={dados.content.length === 0}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={dados.totalElements}
                    rowsPerPage={dados.pageable.pageSize}
                    page={dados.pageable.pageNumber}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <Fab
                    aria-label="Novo Cliente"
                    className={classes.fab}
                    color="primary"
                    onClick={() => history.push(`/cliente/${undefined}`)}
                >
                    <AddIcon />
                </Fab>
            </Paper>
        </Container>
    );
};

export default ClientList;
