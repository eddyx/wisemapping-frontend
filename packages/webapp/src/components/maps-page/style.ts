import { createStyles, ListItemText, Theme, withStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const drawerWidth = 300;

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            background: '#ffffff',

        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        newMapButton: {
            marginRight: 10,
        },
        importButton: {
            marginRight: 10,
        },
        rightButtonGroup: {
            marginRight: 10,
            flexGrow: 10,
            textAlign: 'right',
            minWidth: '200px'
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            background: '#ffa800',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'flex-end',
            minHeight: '44px'
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        }
    }),
);