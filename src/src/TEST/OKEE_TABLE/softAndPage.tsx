import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  TableNew as Table,
  TableColumnPropsNew as TableColumnProps,
  TableStateNew as TableState,
} from "@okee-uikit/react";
import "@okee-uikit/react/themes/platform/index.css";
import "./index.css";

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
  const columns = useMemo<TableColumnProps<DemoData>[]>(
    () => [
      {
        id: "id",
        width: 100,
        title: "ID",
        dataProp: "id",
        sortOptions: {
          directions: ["descend", "reset"],
        },
      },
      {
        id: "name",
        width: 100,
        title: "Name",
        dataProp: "name",
      },
      {
        id: "book",
        width: 400,
        title: "Related book",
        dataProp: "article",
      },
      {
        id: "serial",
        width: 100,
        title: "Crypto",
        dataProp: "code",
      },
      {
        id: "years",
        width: 100,
        title: "Age",
        dataProp: "age",
        filterOptions: {
          data: [
            { label: "< 17", value: "lt-17" },
            { label: "< 20", value: "lt-20" },
            { label: "< 23", value: "lt-23" },
            { label: "> 23", value: "gt-23" },
          ],
          type: "multiple",
        },
        sortOptions: {
          directions: ["ascend", "descend", "reset"],
        },
      },
      {
        id: "gender",
        width: 100,
        title: "Gender",
        dataProp: "gender",
      },
    ],
    []
  );

  const [data, setData] = useState<DemoData[]>([]);

  const [loading, setLoading] = useState(false);

  // The total amount of data.
  const [total, setTotal] = useState(10000);

  // The state for filter, sort and pagination.
  const [state, setState] = useState<TableState>({
    filterState: {},
    sortState: [],
    page: 1,
    pageSize: 10,
  });

  // Mock remote data request via filter, sort and pagination
  const onStateChange = useCallback(async (state: TableState) => {
    console.log("🔍LHG:OKEE_TABLE/softAndPage.tsx state:::", state);
    const { filterState, sortState, page, pageSize } = state;
    setLoading(true);

    let path = "/item?";

    Object.entries(filterState).forEach(([key, value]) => {
      if (!value) {
        return;
      }
      path += key;
      path += "=";
      path += Array.isArray(value) ? value.join(",") : value;
      path += "&";
    });

    sortState.forEach(({ column, order }) => {
      path += `sortBy=${column}&orderBy=${order}&`;
    });

    path += `offset=${(page - 1) * pageSize}`;

    console.log(`request path=${path}`);

    const newData = await mockData(path);

    setState(state);
    setTotal(Math.ceil(10000 / (Object.keys(filterState).length + 1)));
    setData(newData);
    setLoading(false);
  }, []);

  // Init data
  useEffect(() => {
    onStateChange(state);
  }, []);

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      filterOptions={{ value: state.filterState }}
      sortOptions={{ value: state.sortState }}
      paginationOptions={{
        value: state.page,
        size: state.pageSize,
        total,
        props: {
          showTotal: true,
          filled: true,
        },
      }}
      onStateChange={onStateChange}
      emptyType="empty"
      headerBottomBordered={false}
      bodyBottomBordered={true}
    />
  );
}

async function mockData(path: string): Promise<DemoData[]> {
  return new Promise((resolve, reject) => {
    const data: DemoData[] = [
      {
        id: 1,
        code: "Alpha",
        name: "Alice23456789",
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
            article:
              "Alice and Bob: A History Of The World's Most Famous Couple",
          },
          {
            id: 2,
            code: "Venus",
            name: "Venus",
            age: 13,
            gender: "girl",
            article:
              "Alice and Bob: A History Of The World's Most Famous Couple",
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
            article:
              "Alice and Bob: A History Of The World's Most Famous Couple",
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
      ...Array.from({ length: 7 }, (_, i) => ({
        id: 4 + i,
        code: "Delta",
        name: "Dave",
        age: 16,
        gender: "boy",
        article: "Alice and Bob: A History Of The World's Most Famous Couple",
      })),
    ];

    setTimeout(() => resolve(data), 500);
  });
}

export default Demo;
