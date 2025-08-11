import { INestApplication } from '@nestjs/common'
import { describe, beforeEach, it, expect } from 'vitest'
import { createTestApp } from './utils/app'
import { startTestAppServer, TestRequestInstance } from './utils/server'

type User = {
  id: string;
  username: string;
  friends?: User[];
};

describe('App Startup (e2e)', () => {
  let app: INestApplication
  let request: TestRequestInstance

  beforeEach(async () => {
    app = await createTestApp()
    request = await startTestAppServer(app)
  })

  it('should respond with 404 on /', async () => {
    const response = await request.anonymus.get('/')
    expect(response.status).toBe(404)
  })

  it('should respond with 200 and ok status on /health', async () => {
    const response = await request.anonymus.get('/health')

    expect(response.status).toBe(200)
    expect(response.data.status).toBe('ok')
  })
})
