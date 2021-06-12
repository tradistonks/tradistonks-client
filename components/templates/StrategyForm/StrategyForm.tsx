import {
  Col,
  FormInstance,
  Input,
  List,
  notification,
  Row,
  Select,
  Space,
} from 'antd';
import { Store } from 'antd/lib/form/interface';
import React, { useState } from 'react';
import { APIExternal } from '../../../utils/api';
import { LanguageDTO } from '../../../utils/dto/language.dto';
import { SymbolSearchResponseDTOResult } from '../../../utils/dto/symbol-search-response.dto';
import { FormEditor } from '../../atoms/Editor/Editor';
import Form from '../../atoms/Form/Form';
import FormItem from '../../atoms/FormItem/FormItem';

export type StrategyFormProps<Values = unknown> = {
  form?: FormInstance<Values>;
  initialValues?: Store;
  onFinish: (values: Values) => void;

  languages: Pick<LanguageDTO, '_id' | 'name'>[];

  actions?: React.ReactNode[];
};

export function StrategyForm<Values = unknown>(
  props: StrategyFormProps<Values>,
) {
  const api = new APIExternal();

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

  return (
    <Form
      form={props.form}
      onFinish={props.onFinish}
      initialValues={props.initialValues}
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

          <FormItem label="Symbols">
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
                  <div>{item.type}</div>
                </List.Item>
              )}
            />
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
