const initialState: InitialStateType = {
  status: 'idle',
  error: null,
}

// REDUCER
export const appReducer = (state = initialState, action: AppReducerActionsType) => {
  switch (action.type) {
    case 'APP/SET-STATUS': {
      return {...state, status: action.status}
    }
    case 'APP/SET-ERROR': {
      return {...state, error: action.error}
    }
    default: {
      return state
    }
  }
}

// ACTION CREATORS
export const setAppStatus = (status: RequestAppStatuses) => ({
  type: 'APP/SET-STATUS',
  status,
} as const)
export const setAppError = (error: string | null) => ({
  type: 'APP/SET-ERROR',
  error,
} as const)

// TYPES
export type RequestAppStatuses = 'idle' | 'loading' | 'succeded' | 'failed'
type InitialStateType = {
  status: RequestAppStatuses
  error: string | null
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatus>
export type SetAppErrorsActionType = ReturnType<typeof setAppError>
export type AppReducerActionsType =
  SetAppStatusActionType
  | SetAppErrorsActionType