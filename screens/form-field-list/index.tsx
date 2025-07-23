import React, { useState, useCallback } from 'react'
import { Reorder, AnimatePresence } from 'framer-motion'
import { FormFieldType } from '@/types'
import { FieldItem } from '@/screens/field-item'

import { LuRows2 } from 'react-icons/lu'
import { Badge } from '@/components/ui/badge'

export type FormFieldOrGroup = FormFieldType | FormFieldType[]

type FormFieldListProps = {
  formFields: FormFieldOrGroup[]
  setFormFields: React.Dispatch<React.SetStateAction<FormFieldOrGroup[]>>
  updateFormField: (path: number[], updates: Partial<FormFieldType>) => void
  openEditDialog: (field: FormFieldType) => void
}

export const FormFieldList: React.FC<FormFieldListProps> = ({
  formFields,
  setFormFields,
  updateFormField,
  openEditDialog,
}) => {
  const [rowTabs, setRowTabs] = useState<{ [key: number]: FormFieldType[] }>({})

  const handleHorizontalReorder = useCallback(
    (index: number, newOrder: FormFieldType[]) => {
      setRowTabs((prev) => ({ ...prev, [index]: newOrder }))

      // Delay setFormFields by 1 second
      setTimeout(() => {
        setFormFields((prevFields) => {
          const updatedFields = [...prevFields]
          updatedFields[index] = newOrder
          return updatedFields
        })
      }, 1000)
    },
    [setFormFields],
  )

  return (
    <div className="mt-3 lg:mt-0">
      <div className="flex flex-col gap-1">
        <Reorder.Group
          axis="y"
          onReorder={setFormFields}
          values={formFields}
        >
          {formFields.map((item, index) => (
            Array.isArray(item) ? (
              <div key={item.map((f) => f.name).join('-')} className="flex items-center gap-1">
                <Reorder.Item
                  value={item}
                  whileDrag={{ backgroundColor: '#e5e7eb', borderRadius: '12px' }}
                >
                  <LuRows2 className="cursor-grab w-4 h-4" />
                  <div className="w-full grid grid-cols-12 gap-1">
                    <Reorder.Group
                      as="ul"
                      axis="x"
                      onReorder={(newOrder) => handleHorizontalReorder(index, newOrder)}
                      values={rowTabs[index] || item}
                    >
                      <AnimatePresence initial={false}>
                        {(rowTabs[index] || item).map((field, fieldIndex) => (
                          <Reorder.Item
                            key={field.name}
                            value={field}
                            whileDrag={{ backgroundColor: '#e5e7eb', borderRadius: '12px' }}
                          >
                            <div className="w-full col-span-12">
                              <FieldItem
                                index={index}
                                subIndex={fieldIndex}
                                field={field}
                                formFields={formFields}
                                setFormFields={setFormFields}
                                updateFormField={updateFormField}
                                openEditDialog={openEditDialog}
                              />
                            </div>
                          </Reorder.Item>
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>
                  </div>
                </Reorder.Item>
              </div>
            ) : (
              <div key={item.name} className="flex items-center gap-1">
                <Reorder.Item
                  value={item}
                  whileDrag={{ backgroundColor: '#e5e7eb', borderRadius: '12px' }}
                >
                  <LuRows2 className="cursor-grab w-4 h-4" />
                  <FieldItem
                    field={item}
                    index={index}
                    formFields={formFields}
                    setFormFields={setFormFields}
                    updateFormField={updateFormField}
                    openEditDialog={openEditDialog}
                  />
                </Reorder.Item>
              </div>
            )
          ))}
        </Reorder.Group>
      </div>
    </div>
  )
}
