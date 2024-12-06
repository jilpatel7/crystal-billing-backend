import { Response } from 'express'

const generalResponse = (resObject: {
  response: Response,
  data?: any,
  message: string,
  response_type?: string,
  toast?: boolean
  statusCode?: number
}) => {
  const { response, data = [], message = '', response_type = 'success', toast = false, statusCode = 200 } = resObject
  response.status(statusCode).send({
    data: data,
    message: message,
    toast: toast,
    response_type: response_type,
  })
}

export default generalResponse
