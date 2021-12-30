import React, {ChangeEvent, FC, useState} from 'react';
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan: FC<EditableSpanPropsType> = React.memo(function ({value, onChange, ...restProps}) {

  // TODO - if in edit mode textfield value trim length === 0 dont save new value
  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState(value);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(value);
  }
  const activateViewMode = () => {
    setEditMode(false);
    onChange(title);
  }
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode
    ? <TextField value={title} onChange={onChangeTitleHandler} autoFocus onBlur={activateViewMode}/>
    : <span onDoubleClick={activateEditMode}>{value}</span>
});
