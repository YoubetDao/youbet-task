import { IData } from '@/components/filter-button'
import { TaskPriorityEnum } from '@/openapi/client'

const selectedFn = (list: IData[]) => {
  return list.map((item) => item.value).join(',')
}

function filterFromEntity<T extends { _id?: string; login?: string; value?: string; name?: string }>(
  ids: string,
  entity: T[],
): IData[] {
  return entity
    .map((item) => {
      const setKey = 'login' in item ? item.login! : 'value' in item ? item.value! : item._id! + ''
      const getKey = 'name' in item ? item.name! : setKey
      if (ids.split(',').includes(setKey)) {
        return { name: getKey, value: setKey }
      }
      return null
    })
    .filter((x): x is IData => x !== null)
}

const priorities = [
  {
    name: 'P0',
    value: TaskPriorityEnum.P0,
  },
  {
    name: 'P1',
    value: TaskPriorityEnum.P1,
  },
  {
    name: 'P2',
    value: TaskPriorityEnum.P2,
  },
]
export { selectedFn, filterFromEntity, priorities }
