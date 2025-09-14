import { enqueueSnackbar } from "notistack";
import { HttpError, defaultErrorMessage } from "./request.utility";

export const handleError = (error: any) => {
  if (error instanceof HttpError) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }
  else {
    enqueueSnackbar(defaultErrorMessage, { variant: 'error' });
  }
}