export function Count(times: number, resolve: any) {
  let count = 0;

  const check = () => {
    count++;
    if (count === times) resolve();
  };

  return check;
}
