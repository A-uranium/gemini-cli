/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSettings } from '../contexts/SettingsContext.js';
import type { LoadedSettings } from '../../config/settings.js';
import {
  detectTerminalEnvironment,
  getTerminalCapabilities,
  type TerminalCapabilities,
} from '@google/gemini-cli-core';
import { useTerminalCapabilities } from './useTerminalCapabilities.js';

/**
 * Returns true if the alternate buffer should be used according to settings
 * and terminal capabilities.
 */
export const isAlternateBufferEnabled = (
  settings: LoadedSettings,
  capabilities?: TerminalCapabilities,
): boolean => {
  const caps =
    capabilities ??
    getTerminalCapabilities(detectTerminalEnvironment(), process.env, {
      forceAltBuffer: settings.merged.ui.compatibility?.forceAltBuffer,
      disableAltBuffer: settings.merged.ui.compatibility?.disableAltBuffer,
      assumeTrustedTerminal:
        settings.merged.ui.compatibility?.assumeTrustedTerminal,
    }).capabilities;

  return (
    settings.merged.ui.useAlternateBuffer === true && caps.supportsAltBuffer
  );
};

/**
 * Hook to determine if the alternate buffer is enabled.
 */
export const useAlternateBuffer = (): boolean => {
  const settings = useSettings();
  const capabilities = useTerminalCapabilities();
  return isAlternateBufferEnabled(settings, capabilities);
};
