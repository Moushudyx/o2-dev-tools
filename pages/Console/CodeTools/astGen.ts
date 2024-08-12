/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
 * @Author: moushu
 * @Date: 2023-06-04 14:44:22
 * @LastEditTime: 2023-06-04 22:29:43
 * @Description: 生成 AST 的方法
 * @FilePath: \o2-dev-tools\pages\Console\CodeTools\astGen.ts
 */
import { ParserOptions, parse } from '@babel/parser';

export const ast = getAst(
  `
  import React, { Component } from 'react';
  import {
    designO2Page,
    O2Column,
    O2ColumnInput,
    O2ColumnLov,
    O2Table,
    usePageTitle,
    useTableOption,
  } from 'o2-design';
  import formatterCollections from 'utils/intl/formatterCollections';
  import { getCurrentOrganizationId } from 'utils/utils';
  import intl from 'utils/intl';
  import { O2MKT_CM } from 'o2Utils/config';
  import codeConfig from 'o2Utils/codeConfig/o2-marketing';

  const prefix = O2MKT_CM;
  const organizationId = getCurrentOrganizationId();
  const { parallelGroup: { parallelGroupType = 'O2MKT.PARALLEL_GROUP_TYPE' } = {} } = codeConfig;

  const Page = designO2Page(() => {
    usePageTitle(() => intl.get('o2.mkt.parallelGroup.view.title.list').d('平行组定义'));

    const option = useTableOption({
      url: {
      },
      permission: 'o2.o2rule.market.parallel-group.ps.button',
      enable: {
        delete: false,
      },
    });

    return () => (
      <>
        <O2Table option={option}>
          <O2Column
            title={intl.get('o2.mkt.parallelGroup.model.parallelGroupCode').d('平行组编码')}
            field="parallelGroupCode"
            tooltip="overflow"
            fit
          />
          <O2ColumnInput
            title={intl.get('o2.mkt.parallelGroup.model.parallelGroupName').d('平行组名称')}
            field="parallelGroupName"
            tooltip="overflow"
            editProps={{
              maxLength: 30,
              showLengthInfo: true,
            }}
            formFilter
            required
            fit
          />
          <O2ColumnLov
            title={intl.get('o2.mkt.parallelGroup.model.parallelGroupType').d('平行组类型')}
            field="parallelGroupType"
            lovCode={parallelGroupType}
            editable={({ data }) => !data.parallelGroupId}
            formFilter
            required
            fit
          />
          <O2Column
            title={intl.get('o2.mkt.parallelGroup.model.lastUpdateDate').d('最近更新时间')}
            field="lastUpdateDate"
            tooltip="overflow"
            fit
          />
        </O2Table>
      </>
    );
  });

  @formatterCollections({ code: ['o2.mkt.parallelGroup'] })
  export default class extends Component {
    render() {
      return <Page {...this.props} />;
    }
  }
  `
);
/** 警告：此方法可能报错 */
export function getAst(code: string, options?: ParserOptions) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
    ...options,
  });
}
