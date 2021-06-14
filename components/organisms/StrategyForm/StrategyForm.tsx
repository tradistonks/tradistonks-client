import {
  Button,
  Col,
  DatePicker,
  FormInstance,
  Input,
  List,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useState } from 'react';
import { APIExternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import {
  StrategyDTO,
  StrategyDTOSymbol,
} from '../../../utils/dto/strategy.dto';
import { SymbolSearchResponseDTOResult } from '../../../utils/dto/symbol-search-response.dto';
import { FormEditor } from '../../atoms/Editor/Editor';
import Form, { FormList } from '../../atoms/Form/Form';
import FormItem from '../../atoms/FormItem/FormItem';

export type StrategyFormProps = {
  form?: FormInstance<StrategyDTO>;
  initialValues?: Partial<StrategyDTO>;
  onFinish: (values: StrategyDTO) => void;

  languages: Pick<LanguageDTO, '_id' | 'name'>[];

  actions?: React.ReactNode[];
};

export function StrategyForm(props: StrategyFormProps) {
  const api = new APIExternal();

  const [form] = useForm<StrategyDTO>(props.form);

  const [isSymbolSearchLoading, setIsSymbolSearchLoading] = useState(false);
  const [symbolSearchResult, setSymbolSearchResult] = useState<
    SymbolSearchResponseDTOResult[]
  >([]);

  const onSymbolSearch = async (
    search: string,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
      | undefined,
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setIsSymbolSearchLoading(true);

    try {
      const data = await api.searchSymbols(search);
      setSymbolSearchResult(data.result);
    } catch (error) {
      notification.error({
        message: 'Failed to search for symbols',
        description: api.errorToString(error),
      });
    }

    setIsSymbolSearchLoading(false);
  };

  const hasTicker = (ticker: string) => {
    const symbols = form.getFieldValue('symbols') as StrategyDTOSymbol[];
    return symbols.some((symbol) => symbol.ticker === ticker);
  };

  const momentOrNull = (d?: Date) => (d ? moment(d) : null);

  return (
    <Form
      form={props.form}
      onFinish={props.onFinish}
      initialValues={{
        ...props.initialValues,
        from: momentOrNull(props.initialValues?.from),
        to: momentOrNull(props.initialValues?.to),
      }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <FormItem
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the strategy's name!",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Language"
            name="language"
            rules={[
              {
                required: true,
                message: "Please specify the strategy's language!",
              },
            ]}
          >
            <Select>
              {props.languages.map((language) => (
                <Select.Option
                  value={language._id}
                  key={`strategy-language-${language._id}`}
                >
                  {language.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="Symbols Candles Granularity"
            name="symbols_candles_granularity"
            required
          >
            <Select>
              <Select.Option value="1">1 minute</Select.Option>
              <Select.Option value="5">5 minutes</Select.Option>
              <Select.Option value="15">15 minutes</Select.Option>
              <Select.Option value="30">30 minutes</Select.Option>
              <Select.Option value="60">60 minutes</Select.Option>
              <Select.Option value="D">1 day</Select.Option>
              <Select.Option value="W">1 week</Select.Option>
              <Select.Option value="M">1 month</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="Symbols Data Start" name="from" required>
            <DatePicker showTime />
          </FormItem>

          <FormItem label="Symbols Data End" name="to">
            <DatePicker showTime />
          </FormItem>

          <FormItem label="Symbols" required>
            <FormList
              name="symbols"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      throw new Error('At least 1 symbol needed');
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  <FormItem hidden={fields.length === 0}>
                    <List
                      itemLayout="horizontal"
                      dataSource={fields}
                      style={{
                        overflow: 'auto',
                        maxHeight: '400px',
                      }}
                      renderItem={(_, index) => {
                        const symbol = form.getFieldValue([
                          'symbols',
                          index,
                        ]) as StrategyDTOSymbol;

                        return (
                          <List.Item>
                            <List.Item.Meta
                              title={symbol.name}
                              description={symbol.ticker}
                            />
                            <Space>
                              <div>{symbol.type}</div>
                              <Button onClick={() => remove(index)}>-</Button>
                            </Space>
                          </List.Item>
                        );
                      }}
                    />
                  </FormItem>
                  <FormItem>
                    <Input.Search
                      placeholder="Search a symbol"
                      onSearch={onSymbolSearch}
                      loading={isSymbolSearchLoading}
                      enterButton
                    />
                    <List
                      itemLayout="horizontal"
                      dataSource={symbolSearchResult}
                      style={{
                        overflow: 'auto',
                        maxHeight: '400px',
                      }}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.description || item.displaySymbol}
                            description={item.symbol}
                          />
                          <Space>
                            <div>{item.type}</div>
                            <Button
                              onClick={() => {
                                add({
                                  name: item.description || item.displaySymbol,
                                  ticker: item.symbol,
                                  type: item.type,
                                });
                              }}
                              style={{
                                visibility: hasTicker(item.symbol)
                                  ? 'hidden'
                                  : undefined,
                              }}
                            >
                              +
                            </Button>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </FormItem>
                </>
              )}
            </FormList>
          </FormItem>
        </Col>

        <Col span={18}>
          <FormItem label="Files" name="files" wrapperCol={{ span: 24 }}>
            <FormEditor height="800px" />
          </FormItem>
        </Col>
      </Row>
      <Row justify="end">
        <Space>
          {(props.actions ?? []).map((action, i) => (
            <FormItem key={`action-${i}`}>{action}</FormItem>
          ))}
        </Space>
      </Row>
    </Form>
  );
}
