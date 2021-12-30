import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import {setAppError} from "./state/app-reducer";

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan: FC<EditableSpanPropsType> = React.memo(function ({value, onChange, ...restProps}) {

  let [editMode, setEditMode] = useState(false);
  let [title, setTitle] = useState(value);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(value);
  }
  const activateViewMode = () => {
    if (title.trim().length === 0) {
      setEditMode(false);
      return
    }
    setEditMode(false);
    onChange(title);
  }
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) {
      if (title.trim().length === 0) {
        setEditMode(false);
        return
      }
      setEditMode(false);
      onChange(title);
    }
  }
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode
    ? <TextField value={title}
                 onChange={onChangeTitleHandler}
                 onBlur={activateViewMode}
                 onKeyPress={onKeyPressHandler}
                 autoFocus
    />
    : <span onDoubleClick={activateEditMode}>{value}</span>
});
