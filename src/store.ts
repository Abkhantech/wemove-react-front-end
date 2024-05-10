import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/reducers/userSlice'

export const Store = configureStore({
  reducer: {
    user: userReducer,
  }
})
