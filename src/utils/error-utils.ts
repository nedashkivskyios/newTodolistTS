import {setAppError, SetAppErrorsActionType, setAppStatus, SetAppStatusActionType} from "../state/app-reducer";
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";

export const handleServerAppError = <D>(params: {
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorsActionType | SetAppStatusActionType>
}) => {
  if (params.data.messages.length !== 0) {
    params.dispatch(setAppError(params.data.messages[0]))
    params.dispatch(setAppStatus('failed'))
  } else {
    params.dispatch(setAppError('Some error ocured'))
    params.dispatch(setAppStatus('failed'))
  }
}

export const handleNetworkAppError = (params: { error: { message: string }, dispatch: Dispatch<SetAppErrorsActionType | SetAppStatusActionType> }) => {
  params.dispatch(setAppError(params.error.message ?? 'Some network error occurred'))
  params.dispatch(setAppStatus('failed'))
}