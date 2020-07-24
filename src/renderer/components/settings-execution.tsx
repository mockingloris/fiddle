import {
  Button,
  Callout,
  Checkbox,
  FormGroup,
  InputGroup,
  MenuItem,
} from '@blueprintjs/core';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ItemRenderer, Select } from '@blueprintjs/select';
import { AppState } from '../state';

const PMSelect = Select.ofType<'npm' | 'yarn'>();

export const renderItem: ItemRenderer<'npm' | 'yarn'> = (
  item,
  { handleClick, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      text={item}
      key={item}
      onClick={handleClick}
    />
  );
};

export interface ExecutionSettingsProps {
  appState: AppState;
}

/**
 * Settings content to manage execution-related preferences.
 *
 * @class ExecutionSettings
 * @extends {React.Component<ExecutionSettingsProps, {}>}
 */
@observer
export class ExecutionSettings extends React.Component<ExecutionSettingsProps, {}> {
  constructor(props: ExecutionSettingsProps) {
    super(props);

    this.handleDeleteDataChange = this.handleDeleteDataChange.bind(this);
    this.handleElectronLoggingChange = this.handleElectronLoggingChange.bind(this);
    this.handleExecutionFlagChange = this.handleExecutionFlagChange.bind(this);
  }

  /**
   * Handles a change on whether or not the user data dir should be deleted
   * after a run.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  public handleDeleteDataChange(
    event: React.FormEvent<HTMLInputElement>
  ) {
    const { checked } = event.currentTarget;
    this.props.appState.isKeepingUserDataDirs = checked;
  }

  /**
   * Handles a change on whether or not electron should log more things
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  public handleElectronLoggingChange(
    event: React.FormEvent<HTMLInputElement>
  ) {
    const { checked } = event.currentTarget;
    this.props.appState.isEnablingElectronLogging = checked;
  }

  /**
   * Handles a change in the execution flags run with the Electron executable
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  public handleExecutionFlagChange(
    event: React.FormEvent<HTMLInputElement>
  ) {
    const { value } = event.currentTarget;
    const flags = value.split('|');
    this.props.appState.executionFlags = flags;
  }

  public render() {
    const {
      isKeepingUserDataDirs,
      isEnablingElectronLogging,
      executionFlags = []
    } = this.props.appState;

    const deleteUserDirLabel = `
      Whenever Electron runs, it creates a user data directory for cookies, the cache,
      and various other things that it needs to keep around. Since fiddles are usually
      just run once, we delete this directory after your fiddle exits. Enable this
      setting to keep the user data directories around.
    `.trim();
    const electronLoggingLabel = `
      There are some flags that Electron uses to log extra information both internally
      and through Chromium.  Enable this option to make Fiddle produce those logs.`.trim();

    return (
      <div>
        <h2>Execution</h2>
        <Callout>
          These advanced settings control how Electron Fiddle executes your fiddles.
        </Callout>
        <br />
        <Callout>
          <FormGroup label={deleteUserDirLabel}>
            <Checkbox
              checked={isKeepingUserDataDirs}
              label='Do not delete user data directories.'
              onChange={this.handleDeleteDataChange}
            />
          </FormGroup>
        </Callout>
        <br />
        <Callout>
          <FormGroup label={electronLoggingLabel}>
            <Checkbox
              checked={isEnablingElectronLogging}
              label='Enable advanced Electron logging.'
              onChange={this.handleElectronLoggingChange}
            />
          </FormGroup>
        </Callout>
        <br />
        <Callout>
          <FormGroup>
          <p>
            Electron allows starting the executable with <a
              href='https://www.electronjs.org/docs/api/command-line-switches'
            >
              user-provided flags
            </a>
            , such as '--js-flags=--expose-gc'. Those can be added here as bar-separated (|)
            flags to run when you start your Fiddles.
          </p>
            <br />
            <InputGroup
              placeholder='--js-flags=--expose-gc|--lang=es'
              value={executionFlags.join('|')}
              onChange={this.handleExecutionFlagChange}
            />
          </FormGroup>
        </Callout>
        <br />
        <Callout>
          <FormGroup>
            <span style={{ marginRight: 4 }}>
              You can change the default package manager to 'npm' or 'yarn'. The
              choice is not big, but you have a choice:
            </span>
            <PMSelect
              items={['npm', 'yarn']}
              itemRenderer={renderItem}
              onItemSelect={this.handlePMChange}
            >
              <Button text={this.props.appState.packageManager} icon='box' />
            </PMSelect>
          </FormGroup>
        </Callout>
      </div>
    );
  }

  private handlePMChange = (item: 'npm' | 'yarn') => {
    this.props.appState.packageManager = item;
  }
}
