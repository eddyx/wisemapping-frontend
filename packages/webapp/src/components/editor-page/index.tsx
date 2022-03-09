import React, { useEffect } from 'react';
import ActionDispatcher from '../maps-page/action-dispatcher';
import { ActionType } from '../maps-page/action-chooser';
import Editor from '@wisemapping/editor';
import { EditorRenderMode, PersistenceManager } from '@wisemapping/mindplot';

import AppI18n from '../../classes/app-i18n';
import { useSelector } from 'react-redux';
import { hotkeysEnabled } from '../../redux/editorSlice';
import ReactGA from 'react-ga';
import Client from '../../classes/client';
import { activeInstance, fetchAccount, fetchMapById } from '../../redux/clientSlice';
import EditorOptionsBulder from './EditorOptionsBuider';

export type EditorPropsType = {
    isTryMode: boolean;
};

const EditorPage = ({ isTryMode }: EditorPropsType): React.ReactElement => {
    const [activeDialog, setActiveDialog] = React.useState<ActionType | null>(null);
    const hotkey = useSelector(hotkeysEnabled);
    const userLocale = AppI18n.getUserLocale();
    const client: Client = useSelector(activeInstance);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    const findEditorMode = (isTryMode: boolean, mapId: number): EditorRenderMode | null => {
        let result: EditorRenderMode = null;
        if (isTryMode) {
            result = 'showcase';
        } else if (global.mindmapLocked) {
            result = 'viewonly';
        } else {
            const fetchResult = fetchMapById(mapId);
            if (!fetchResult.isLoading) {
                if (fetchResult.error) {
                    throw new Error(`Map information could not be loaded: ${JSON.stringify(fetchResult)}`);
                }
                result = `edition-${fetchResult?.map?.role}`;
            }
        }
        return result;
    }

    // What is the role ?
    const mapId = EditorOptionsBulder.loadMapId();
    const mode = findEditorMode(isTryMode, mapId);

    // Account settings can be null and editor cannot be initilized multiple times. This creates problems
    // at the i18n resource loading.
    const isAccountLoaded = mode === 'showcase' || fetchAccount;
    const loadCompleted = mode && isAccountLoaded;

    let options, persistence: PersistenceManager;
    if (loadCompleted) {
        options = EditorOptionsBulder.build(userLocale.code, mode, hotkey);
        persistence = client.buildPersistenceManager(mode);
    }

    return loadCompleted ? (
        <>
            <Editor onAction={setActiveDialog}
                options={options}
                persistenceManager={persistence}
                mapId={mapId} />
            {
                activeDialog &&
                <ActionDispatcher
                    action={activeDialog}
                    onClose={() => setActiveDialog(null)}
                    mapsId={[mapId]}
                    fromEditor
                />
            }
        </>) : <></>
}


export default EditorPage;
