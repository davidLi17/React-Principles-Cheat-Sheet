import React, { Fragment, useMemo, useState } from "react";
import {
  TableColumnPropsNew as TableColumnProps,
  TableNew as Table,
} from "@okee-uikit/react";

interface DemoData {
  id: number;
  code: string;
  name: string;
  age: number;
  gender: string;
  article: string;
  children?: DemoData[];
}

function Demo(): JSX.Element {
  const [data] = useState<DemoData[]>(createData);

  const columns = useMemo<TableColumnProps<DemoData>[]>(
    () => [
      {
        id: "id_name",
        title: "Identify",
        fixed: "left",
        children: [
          {
            id: "id",
            width: 100,
            title: "ID",
            dataProp: "id",
          },
          {
            id: "name",
            width: 100,
            title: "Name",
            dataProp: "name",
          },
        ],
      },
      {
        id: "book",
        title: "Related book",
        dataProp: "article",
      },
      {
        id: "serial",
        width: 200,
        title: "Crypto",
        dataProp: "code",
      },
      {
        id: "human",
        title: "Body",
        fixed: "right",
        children: [
          {
            id: "years",
            width: 100,
            title: "Age",
            dataProp: "age",
          },
          {
            id: "gender",
            width: 100,
            title: "Gender",
            dataProp: "gender",
          },
        ],
      },
    ],
    []
  );

  return (
    <Table
      data={data}
      columns={columns}
      summaryTop={(context) => {
        return (
          <Fragment>
            <Table.Summary.Row className="123">
              <Table.Summary.Cell colSpan={1} rowSpan={2}>
                Summary
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>Two Column</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={1}>One Column</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={1} rowSpan={2}>
                Age Summary
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={1} rowSpan={2}>
                Gender Summary
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row className="123">
              <Table.Summary.Cell colSpan={3}>
                This is summary content.
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Fragment>
        );
      }}
      headProps={{
        positionSticky: true,
      }}
      emptyType="empty"
      headerBottomBordered={false}
      bodyBottomBordered={true}
    />
  );
}

function createData(): DemoData[] {
  return [
    {
      id: 1,
      code: "Alpha",
      name: "Alice",
      age: 13,
      gender: "girl",
      article: "Alice and Bob: A History Of The World's Most Famous Couple",
      children: [
        {
          id: 1,
          code: "Athena",
          name: "Pallas Athena",
          age: 13,
          gender: "girl",
          article: "Alice and Bob: A History Of The World's Most Famous Couple",
        },
        {
          id: 2,
          code: "Venus",
          name: "Venus",
          age: 13,
          gender: "girl",
          article: "Alice and Bob: A History Of The World's Most Famous Couple",
        },
      ],
    },
    {
      id: 2,
      code: "Beta",
      name: "Bob",
      age: 14,
      gender: "boy",
      article: "Alice and Bob: A History Of The World's Most Famous Couple",
      children: [
        {
          id: 1,
          code: "RSA",
          name: "BoRivestb",
          age: 14,
          gender: "boy",
          article:
            "A Method of Obtaining Digital Signatures and Public-Key Cryptosystems",
        },
        {
          id: 2,
          code: "RSA",
          name: "Shamir",
          age: 14,
          gender: "boy",
          article:
            "A Method of Obtaining Digital Signatures and Public-Key Cryptosystems",
        },
        {
          id: 3,
          code: "RSA",
          name: "Adleman",
          age: 14,
          gender: "boy",
          article:
            "A Method of Obtaining Digital Signatures and Public-Key Cryptosystems",
        },
      ],
    },
    {
      id: 3,
      code: "Gamma",
      name: "Carol",
      age: 15,
      gender: "girl",
      article: "Alice and Bob: A History Of The World's Most Famous Couple",
      children: [
        {
          id: 3,
          code: "Gamma",
          name: "Carol",
          age: 15,
          gender: "girl",
          article: "Alice and Bob: A History Of The World's Most Famous Couple",
          children: [
            {
              id: 3,
              code: "Gamma",
              name: "Carol",
              age: 15,
              gender: "girl",
              article:
                "Alice and Bob: A History Of The World's Most Famous Couple",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      code: "Delta",
      name: "Dave",
      age: 16,
      gender: "boy",
      article: "Alice and Bob: A History Of The World's Most Famous Couple",
    },
  ];
}

export default Demo;
