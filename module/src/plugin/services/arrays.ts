export const sortByKey = (key: string) => {
  return (a: any, b: any, order?: 'asc' | 'desc') => {
    // if there's an order and it's set to desc, then flip the comparison
    let asc = 1;
    let desc = -1;
    if (order && order === 'desc') {
      asc = -1;
      desc = 1;
    }
    const x = a[key];
    const y = b[key];
    return x < y ? asc : x > y ? desc : 0;
  };
};
