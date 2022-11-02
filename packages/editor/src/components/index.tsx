/*
 *    Copyright [2021] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import React, { useCallback, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Model from '../classes/model/editor';

import { IntlProvider } from 'react-intl';
import {
  PersistenceManager,
  Designer,
  DesignerKeyboard,
  MindplotWebComponent,
  EditorRenderMode,
} from '@wisemapping/mindplot';

import I18nMsg from '../classes/i18n-msg';
import { theme as defaultEditorTheme } from '../theme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Theme } from '@mui/material/styles';
import { Notifier } from './warning-dialog/styled';
import WarningDialog from './warning-dialog';
import DefaultWidgetManager from '../classes/default-widget-manager';
import AppBar from './app-bar';
import Capability from '../classes/action/capability';
import { ToolbarActionType } from './toolbar/ToolbarActionType';
import MapInfo from '../classes/model/map-info';
import EditorToolbar from './editor-toolbar';
import ZoomPanel from './zoom-panel';

export type EditorOptions = {
  mode: EditorRenderMode;
  locale: string;
  enableKeyboardEvents: boolean;
};

type EditorProps = {
  mapInfo: MapInfo;
  options: EditorOptions;
  persistenceManager: PersistenceManager;
  onAction: (action: ToolbarActionType) => void;
  onLoad?: (designer: Designer) => void;
  theme?: Theme;
  accountConfiguration?: React.ReactElement;
};

const Editor = ({
  mapInfo,
  options,
  persistenceManager,
  onAction,
  theme,
  accountConfiguration,
}: EditorProps) => {
  const [model, setModel] = useState<Model | undefined>();

  // This is required to redraw in case of chansges in the canvas...
  const [canvasUpdate, setCanvasUpdate] = useState<number>();
  const editorTheme: Theme = theme ? theme : defaultEditorTheme;
  const [popoverOpen, popoverTarget, widgetManager] = DefaultWidgetManager.create();
  const capability = new Capability(options.mode, mapInfo.isLocked());

  const mindplotRef = useCallback((component: MindplotWebComponent) => {
    // Initialized model ...
    const model = new Model(component);
    model.loadMindmap(mapInfo.getId(), persistenceManager, widgetManager);
    model.registerEvents(setCanvasUpdate, capability);
    setModel(model);
  }, []);

  useEffect(() => {
    if (options.enableKeyboardEvents) {
      DesignerKeyboard.resume();
    } else {
      DesignerKeyboard.pause();
    }
  }, [options.enableKeyboardEvents]);

  // Initialize locate ...
  const locale = options.locale;
  const msg = I18nMsg.loadLocaleData(locale);
  return (
    <ThemeProvider theme={editorTheme}>
      <IntlProvider locale={locale} messages={msg}>
        <AppBar
          model={model}
          mapInfo={mapInfo}
          capability={capability}
          onAction={onAction}
          accountConfig={accountConfiguration}
        />

        <Popover
          id="popover"
          open={popoverOpen}
          anchorEl={popoverTarget}
          onClose={widgetManager.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {widgetManager.getEditorContent()}
        </Popover>

        <EditorToolbar model={model} capability={capability} />
        <ZoomPanel model={model} capability={capability} />

        <mindplot-component
          ref={mindplotRef}
          id="mindmap-comp"
          mode={options.mode}
          locale={options.locale}
        />

        <Notifier id="headerNotifier" />
        <WarningDialog
          capability={capability}
          message={mapInfo.isLocked() ? mapInfo.getLockedMessage() : ''}
        />
      </IntlProvider>
    </ThemeProvider>
  );
};
export default Editor;