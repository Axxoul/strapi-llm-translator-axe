import {
  Box,
  Button,
  Checkbox,
  Field,
  Flex,
  Main,
  Typography,
  Textarea,
  TextInput,
  NumberInput,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../../src/pluginId';
import { PluginConfig } from '../../custom';
import { PluginIcon } from '../../src/components/PluginIcon';
import {
  DEFAULT_DEBUG_LOGS,
  DEFAULT_LLM_BASE_URL,
  DEFAULT_LLM_MODEL,
  DEFAULT_LLM_TEMPERATURE,
  DEFAULT_SYSTEM_PROMPT,
  MAX_LLM_TEMPERATURE,
  MIN_LLM_TEMPERATURE,
} from '../utils/constants';

interface FormEvent extends React.FormEvent<HTMLFormElement> {
  preventDefault(): void;
}

const HomePage = () => {
  const [config, setConfig] = useState({
    systemPrompt: '',
    temperature: 0.3,
    llmModel: '',
    llmBaseUrl: '',
    debugLogs: DEFAULT_DEBUG_LOGS,
  });
  const { formatMessage } = useIntl();
  const { get, post } = useFetchClient();

  useEffect(() => {
    // Fetch current config
    const fetchData = async () => {
      const response = await get(`/${PLUGIN_ID}/config`);
      setConfig({ ...config, ...response.data });
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await post(`/${PLUGIN_ID}/config`, { ...(config as PluginConfig) });
  };

  const handleRestore = async (): Promise<void> => {
    const defaults = {
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      temperature: DEFAULT_LLM_TEMPERATURE,
      llmModel: '',
      llmBaseUrl: '',
      debugLogs: DEFAULT_DEBUG_LOGS,
    };
    setConfig(defaults);
    await post(`/${PLUGIN_ID}/config`, defaults);
  };

  return (
    <Main>
      <Box
        paddingLeft={10}
        paddingRight={10}
        paddingBottom={8}
        paddingTop={8}
        data-strapi-header
        background="neutral100"
      >
        <Flex data-strapi-header alignItems="center" gap={3} marginBottom={4}>
          <PluginIcon width={42} height={42} />{' '}
          <Typography variant="alpha" tag="h1" fontWeight="bold">
            {formatMessage({
              id: getTranslation('plugin.page.title'),
              defaultMessage: 'LLM Translator (Configuration)',
            })}
          </Typography>
        </Flex>
        <Typography variant="delta" textColor="neutral600" fontWeight="normal">
          {formatMessage({
            id: getTranslation('plugin.page.description'),
            defaultMessage:
              'Configure the LLM Translator plugin settings. The API Key must be set as an environment variable. Model and Base URL can be configured here or via environment variables.',
          })}
        </Typography>
      </Box>

      <Box paddingLeft={10} paddingRight={10}>
        <Box
          paddingLeft={10}
          paddingRight={10}
          paddingTop={8}
          paddingBottom={8}
          background="neutral0"
        >
          <form onSubmit={handleSubmit}>
            <Field.Root
              id="system_prompt"
              hint={formatMessage({
                id: getTranslation('plugin.page.form.system_prompt_hint'),
                defaultMessage:
                  'This is (part) of the prompt that will be used to instruct the LLM. It should be clear and concise.',
              })}
              required
            >
              <Field.Label>
                {formatMessage({
                  id: getTranslation('plugin.page.form.system_prompt'),
                  defaultMessage: 'System prompt',
                })}
              </Field.Label>
              <Textarea
                id="system_prompt"
                value={config.systemPrompt as string}
                onChange={(e: { target: { value: string } }) =>
                  setConfig({ ...config, systemPrompt: e.target.value })
                }
                required
                placeholder={DEFAULT_SYSTEM_PROMPT}
                name="system_prompt"
              />
              <Field.Error />
              <Field.Hint />
            </Field.Root>
            <Flex gap={4} marginTop={6} flex={1}>
              <Field.Root
                id="llm_temperature"
                hint={formatMessage({
                  id: getTranslation('plugin.page.form.llm_temperature_hint'),
                  defaultMessage:
                    'Temperature setting for the LLM. A higher value will make the output more random, while a lower value will make it more focused and deterministic.',
                })}
                flex={1}
              >
                <Field.Label>
                  {formatMessage({
                    id: getTranslation('plugin.page.form.llm_temperature'),
                    defaultMessage: 'LLM Temperature',
                  })}
                </Field.Label>
                <NumberInput
                  id="llm_temperature"
                  value={config.temperature}
                  name="llm_temperature"
                  step={0.1}
                  min={MIN_LLM_TEMPERATURE}
                  max={MAX_LLM_TEMPERATURE}
                  onValueChange={(value: number | undefined) => {
                    let tempValue = DEFAULT_LLM_TEMPERATURE;
                    if (value === undefined) {
                      tempValue = DEFAULT_LLM_TEMPERATURE;
                    } else if (value < MIN_LLM_TEMPERATURE) {
                      tempValue = MIN_LLM_TEMPERATURE;
                    } else if (value > MAX_LLM_TEMPERATURE) {
                      tempValue = MAX_LLM_TEMPERATURE;
                    } else {
                      tempValue = value;
                    }

                    setConfig({ ...config, temperature: tempValue });
                  }}
                />
                <Field.Error />
                <Field.Hint />
              </Field.Root>
              <Field.Root
                id="llm_model"
                flex={1}
                hint={formatMessage({
                  id: getTranslation('plugin.page.form.llm_model_hint'),
                  defaultMessage:
                    'Model that will be used to generate the translations. Can also be set via STRAPI_ADMIN_LLM_TRANSLATOR_LLM_MODEL env var.',
                })}
              >
                <Field.Label>
                  {formatMessage({
                    id: getTranslation('plugin.page.form.llm_model'),
                    defaultMessage: 'LLM Model',
                  })}
                </Field.Label>
                <TextInput
                  id="llm_model"
                  value={config.llmModel as string}
                  onChange={(e: { target: { value: string } }) =>
                    setConfig({ ...config, llmModel: e.target.value })
                  }
                  placeholder={DEFAULT_LLM_MODEL}
                  name="llm_model"
                />
                <Field.Error />
                <Field.Hint />
              </Field.Root>
              <Field.Root
                id="llm_base_url"
                flex={1}
                hint={formatMessage({
                  id: getTranslation('plugin.page.form.llm_base_url_hint'),
                  defaultMessage:
                    'Base URL for the LLM API. Can also be set via STRAPI_ADMIN_LLM_TRANSLATOR_LLM_BASE_URL env var.',
                })}
              >
                <Field.Label>
                  {formatMessage({
                    id: getTranslation('plugin.page.form.llm_base_url'),
                    defaultMessage: 'LLM Base Url',
                  })}
                </Field.Label>
                <TextInput
                  id="llm_base_url"
                  value={config.llmBaseUrl as string}
                  onChange={(e: { target: { value: string } }) =>
                    setConfig({ ...config, llmBaseUrl: e.target.value })
                  }
                  placeholder={DEFAULT_LLM_BASE_URL}
                  name="llm_base_url"
                />
                <Field.Error />
                <Field.Hint />
              </Field.Root>
            </Flex>
            <Box marginTop={6}>
              <Checkbox
                checked={config.debugLogs}
                onCheckedChange={(checked: boolean) =>
                  setConfig({ ...config, debugLogs: checked })
                }
                hint={formatMessage({
                  id: getTranslation('plugin.page.form.debug_logs_hint'),
                  defaultMessage:
                    'Enable verbose server-side logging for troubleshooting translations',
                })}
              >
                {formatMessage({
                  id: getTranslation('plugin.page.form.debug_logs'),
                  defaultMessage: 'Debug Logs',
                })}
              </Checkbox>
            </Box>
            <Flex gap={2} marginTop={6} justifyContent="flex-end">
              <Button variant="secondary" type="button" onClick={handleRestore} marginTop={4}>
                {formatMessage({
                  id: getTranslation('plugin.page.form.restore'),
                  defaultMessage: 'Restore to default',
                })}
              </Button>

              <Button variant="default" type="submit" marginTop={4}>
                {formatMessage({
                  id: getTranslation('plugin.page.form.save'),
                  defaultMessage: 'Save',
                })}
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Main>
  );
};

export { HomePage };
