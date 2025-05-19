export type EnumType = { [key: string]: number | string };
export type EnumMapType = {
  name: string;
  id: number;
};
type EnumAsArrayType = EnumMapType[];

const enumToArray = (
  data: EnumType,
  captalize = false,
  order = false
): EnumAsArrayType =>
  Object.keys(data)
    .filter((key) => Number.isNaN(+key))
    .map((key: string) => ({
      name: captalize ? key.replace(/([A-Z])/g, ' $1').trim() : key,
      id: data[key] as number,
    }))
    .sort((a, b) => (order ? a.name.localeCompare(b.name) : 0));

export default enumToArray;
