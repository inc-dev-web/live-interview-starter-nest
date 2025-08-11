import { INestApplication } from '@nestjs/common'
import { Server } from 'node:http'
import axios, { Axios } from 'axios'

export interface TestRequestInstance {
  server: Server

  anonymus: Axios
}

export const startTestAppServer = async (
  app: INestApplication
): Promise<TestRequestInstance> => {
  await app.listen(0)

  const server: Server = app.getHttpServer()
  const address = server.address()

  if (!address) {
    throw new Error('Server address is not available')
  }

  const anonymus = axios.create({
    baseURL:
      typeof address === 'string'
        ? address
        : `http://localhost:${address.port.toString()}`,
    validateStatus: () => true,
  })

  return {
    server,
    anonymus,
  }
}
