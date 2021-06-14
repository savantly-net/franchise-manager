import {
  AppPlugin,
  AppPluginMeta,
  AppRootProps,
  KeyValue,
  PanelPlugin,
  PluginMeta,
  PluginType,
} from '@savantly/sprout-api';
import { getPanelRegistrationService } from '@savantly/sprout-runtime';
import { AppRootPage } from 'plugin/AppRootPage';
import { setAppPluginSettingsService } from 'plugin/services/pluginSettings';
import { AppPluginSettings } from 'plugin/types';
import { ComponentClass } from 'react';
import PluginConfiguration from './plugin/pages/PluginConfiguration/PluginConfiguration';
import { SimplePanel } from './plugin/SimplePanel';
import './plugin/styles.css';

export const plugin = new AppPlugin<AppPluginSettings>()
  .setRootPage((AppRootPage as unknown) as ComponentClass<AppRootProps>)
  .addConfigPage({
    title: 'Plugin Settings',
    icon: 'cog',
    body: PluginConfiguration,
    id: 'settings',
  });
/*
  .addConfigPage({
    title: 'Page 1',
    icon: 'fa fa-info',
    body: ExamplePage1,
    id: 'page1',
  })
  .addConfigPage({
    title: 'Page 2',
    icon: 'fa fa-user',
    body: ExamplePage2,
    id: 'page2',
  }) */

const panelPlugin = new PanelPlugin<{}>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'text',
      name: 'Simple text option',
      description: 'Description of panel option',
      defaultValue: 'Default value of text input option',
    })
    .addBooleanSwitch({
      path: 'showMessage',
      name: 'Show message',
      defaultValue: false,
    })
    .addRadio({
      path: 'messageSize',
      defaultValue: 'sm',
      name: 'Message size',
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
    });
});

const updatePanelMeta = ({
  id,
  meta,
  panelPlugin,
}: {
  id: string;
  meta: PluginMeta<KeyValue<any>>;
  panelPlugin: PanelPlugin<any>;
}) => {
  panelPlugin.meta = {
    id,
    baseUrl: meta.baseUrl,
    info: meta.info,
    module: 'fake',
    name: 'Dynamic Example Panel',
    sort: 0,
    type: PluginType.panel,
  };
};

plugin.init = (meta: AppPluginMeta<AppPluginSettings>) => {
  if (meta) {
    setAppPluginSettingsService({
      getSettings: meta,
    });
  }

  console.log('appplugin module init');
  const panelRegistrationService = getPanelRegistrationService();

  updatePanelMeta({ id: 'example', meta, panelPlugin });

  panelRegistrationService.registerPanelPlugin(panelPlugin);
};
